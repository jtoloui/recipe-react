# recipe-react/infra — FE hosting (CDK)

Deploys the JustCooking frontend to **S3 (private) + CloudFront (OAC)** — the
cheapest static-site setup (CloudFront's 1 TB + 10M req/mo perpetual free tier;
`PRICE_CLASS_100`). SPA routing via 403/404 → `/index.html`.

## Prereqs
- AWS SSO profile `justcooking.AdministratorAccess` (account `276663280738`).
- The SPA built first: from the repo root run `npm run build` → produces `dist/`.

## Deploy
```bash
cd infra
npm install
export AWS_PROFILE=justcooking.AdministratorAccess

# One-time per account/region:
npx cdk bootstrap aws://276663280738/us-east-1

# Deploy (builds against ../dist by default):
npx cdk deploy -c account=276663280738

# With a custom domain (ACM cert MUST be in us-east-1):
npx cdk deploy -c account=276663280738 \
  -c domainName=www.justcook.ing \
  -c certArn=arn:aws:acm:us-east-1:276663280738:certificate/XXXX
```

After deploy, point a Cloudflare CNAME for your hostname at the `DistributionDomain`
output (the `*.cloudfront.net` value).

## Config (CDK context `-c`)
- `account` — AWS account id (defaults to CDK_DEFAULT_ACCOUNT).
- `region` — defaults to `us-east-1` (CloudFront + its cert live here).
- `distPath` — path to the built SPA (defaults to `../dist`).
- `domainName` + `certArn` — optional custom domain (both required together).

Cost target: ~$0/mo (free tier). No NAT, no public bucket, no API Gateway.
