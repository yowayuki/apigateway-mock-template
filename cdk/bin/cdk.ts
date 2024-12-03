#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { S3Stack } from "../lib/s3stack";
import { MockApiStack } from "../lib/mock-api-stack";

const app = new cdk.App();
const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new S3Stack(app, "S3Stack", {
  env: defaultEnv,
});
new MockApiStack(app, "MockApiStack", {
  env: defaultEnv,
});
