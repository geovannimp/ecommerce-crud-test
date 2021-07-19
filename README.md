This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, copy the `.env.example` to `.env.local` and fill missing fields.

Then:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

`main.tf` has the config to create the S3 bucket used to store product photos.

Cause of the time, I didn't have time to deploy the whole project to aws, but I intended to use [terraform next-js](https://registry.terraform.io/modules/dealmore/next-js/aws/latest) for that.

## Database

You can use the docker-compose file delivered with the project to run the postgres database using the following command inside the project:

Then:
```bash
docker-compose up
```

## Docs

All endpoints are documented using swagger, you can access through http://localhost:3000/docs.

## Missing things

- Cause of time, I wasn't able to implement the product photo edit page, but all endpoints are implemented and can be accessed through swagger.

- The "db:create" command is not working cause the library used has a bug, but I already opened a PR and I'm waiting the PR to be merged (https://github.com/Tada5hi/typeorm-extension/pull/13)
