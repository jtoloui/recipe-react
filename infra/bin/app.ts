#!/usr/bin/env node
import { App } from 'aws-cdk-lib';

import { SiteStack, defaultDistPath } from '../lib/site-stack.js';

const app = new App();

// Config via `cdk deploy -c key=value` or cdk.json context.
const account =
  app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT;
// CloudFront + its ACM cert live in us-east-1; keep the site stack there.
const region = app.node.tryGetContext('region') ?? 'us-east-1';
const domainName = app.node.tryGetContext('domainName') as string | undefined;
const certArn = app.node.tryGetContext('certArn') as string | undefined;
const distPath =
  (app.node.tryGetContext('distPath') as string | undefined) ?? defaultDistPath;

new SiteStack(app, 'JustCookingSite', {
  env: { account, region },
  distPath,
  domainName,
  certArn,
  description: 'JustCooking frontend — S3 + CloudFront static hosting',
});
