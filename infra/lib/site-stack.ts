import * as path from 'node:path';

import {
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
  CfnOutput,
} from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface SiteStackProps extends StackProps {
  /** Absolute path to the built SPA (Vite `dist/`). */
  readonly distPath: string;
  /** Optional custom domain, e.g. "www.justcook.ing". Requires certArn. */
  readonly domainName?: string;
  /**
   * ACM certificate ARN (MUST be in us-east-1 for CloudFront). When omitted the
   * distribution serves on its *.cloudfront.net domain.
   */
  readonly certArn?: string;
  /**
   * API host (e.g. "api.justcook.ing"). When set, /recipe/* is served by the
   * API's share route (per-recipe social preview tags) with automatic
   * failover to the static SPA, and /api/og/* serves preview images.
   */
  readonly apiDomain?: string;
}

/**
 * JustCooking frontend hosting — private S3 bucket fronted by CloudFront via
 * Origin Access Control (OAC). Cheapest viable static-site setup:
 *  - S3 storage of a few MB (cents)
 *  - CloudFront perpetual free tier (1 TB + 10M req/mo)
 *  - PRICE_CLASS_100 (NA + EU edges only, cheapest)
 * SPA client-side routing handled by rewriting 403/404 to /index.html (200).
 */
export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    // Private bucket — no public access; only CloudFront (OAC) can read it.
    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // The SPA is a rebuildable artifact — safe to destroy with the stack.
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const certificate = props.certArn
      ? acm.Certificate.fromCertificateArn(this, 'SiteCert', props.certArn)
      : undefined;

    const siteOrigin = origins.S3BucketOrigin.withOriginAccessControl(bucket);

    // Link previews: WhatsApp/Slack/X crawlers don't run JS, so /recipe/* goes
    // to the API, which returns the same SPA HTML with that recipe's OG tags.
    // If the API errors, CloudFront fails over to the static index.html so the
    // app always loads. Only HTML is cached here (5 min at the edge).
    const additionalBehaviors: Record<string, cloudfront.BehaviorOptions> = {};
    if (props.apiDomain) {
      const apiOrigin = new origins.HttpOrigin(props.apiDomain, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        // Fail over to the static SPA quickly if the API is slow or cold.
        readTimeout: Duration.seconds(4),
        connectionAttempts: 1,
      });
      const shareCache = new cloudfront.CachePolicy(this, 'SharePageCache', {
        comment: 'Recipe share pages: path-only key, no cookies/headers',
        defaultTtl: Duration.minutes(5),
        maxTtl: Duration.hours(1),
        minTtl: Duration.seconds(0),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      });
      additionalBehaviors['/recipe/*'] = {
        origin: new origins.OriginGroup({
          primaryOrigin: apiOrigin,
          fallbackOrigin: siteOrigin,
          // 404 covers deeper SPA paths (e.g. /recipe/:id/edit) the API doesn't serve.
          fallbackStatusCodes: [404, 500, 502, 503, 504],
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: shareCache,
        compress: true,
      };
      additionalBehaviors['/api/og/*'] = {
        origin: apiOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        // Versioned (?v=updatedAt) so a new photo busts the edge cache.
        cachePolicy: new cloudfront.CachePolicy(this, 'OgImageCache', {
          comment: 'Recipe preview images: keyed on path + v query',
          defaultTtl: Duration.days(1),
          maxTtl: Duration.days(30),
          minTtl: Duration.seconds(0),
          cookieBehavior: cloudfront.CacheCookieBehavior.none(),
          headerBehavior: cloudfront.CacheHeaderBehavior.none(),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList('v'),
        }),
        compress: false,
      };
    }

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      additionalBehaviors,
      defaultBehavior: {
        origin: siteOrigin,
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        compress: true,
      },
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      // SPA routing: unknown paths return index.html so the client router handles them.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
      ],
      ...(props.domainName && certificate
        ? { domainNames: [props.domainName], certificate }
        : {}),
    });

    // Publish the built SPA and invalidate the CDN cache on each deploy.
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [s3deploy.Source.asset(props.distPath)],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
      // Keep previous hashed assets: share pages are cached up to 5 min at the
      // edge and may still reference the prior build's JS/CSS bundles.
      prune: false,
    });

    new CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });
    new CfnOutput(this, 'DistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront domain — point the Cloudflare CNAME here',
    });
  }
}

/** Default dist path: ../dist relative to the infra dir (recipe-react build output). */
export const defaultDistPath = path.resolve(__dirname, '..', '..', 'dist');
