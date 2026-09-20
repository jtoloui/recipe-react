#!/usr/bin/env node
import { App } from 'aws-cdk-lib';

import { SiteStack, defaultDistPath } from '../lib/site-stack.js';

const app = new App();

// Config via `cdk deploy -c key=value` or cdk.json context.
const account =
  app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT;
// Everything (S3 + CloudFront) lives in eu-west-2 (London). CloudFront is
// global; ONLY its ACM cert must be in us-east-1 — pass that cert's ARN via
// -c certArn when adding a custom domain (a cross-region reference, not a
// reason to place this stack in us-east-1).
const region = app.node.tryGetContext('region') ?? 'eu-west-2';

// Environment parameterisation (-c env=dev|prod, default dev) so a dev and a
// prod site stack coexist in one account, matching the API app's convention.
const env = (app.node.tryGetContext('env') as string | undefined) ?? 'dev';
if (env !== 'dev' && env !== 'prod') {
  throw new Error(`Invalid -c env=${env}: must be 'dev' or 'prod'`);
}
const Env = env === 'prod' ? 'Prod' : 'Dev';

// Per-env custom-domain default so a plain `cdk deploy` can't silently drop the
// alias + ACM cert (which reverts CloudFront to the default cert and breaks www
// TLS). Still overridable with -c domainName.
const domainDefault = env === 'prod' ? 'www.justcook.ing' : 'dev.justcook.ing';
const domainName =
  (app.node.tryGetContext('domainName') as string | undefined) ?? domainDefault;
const certArn = app.node.tryGetContext('certArn') as string | undefined;
const distPath =
  (app.node.tryGetContext('distPath') as string | undefined) ?? defaultDistPath;

new SiteStack(app, `JustCookingSite${Env}`, {
  env: { account, region },
  distPath,
  domainName,
  certArn,
  description: `JustCooking frontend (${env}) — S3 + CloudFront static hosting`,
});
