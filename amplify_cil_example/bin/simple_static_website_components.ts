#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { CognitoStack } from '../lib/cognito_stack';
import { StaticWebStack } from '../lib/static_web_stack';
import { SecretsStack } from '../lib/secret_stack';

const app = new cdk.App();
new CognitoStack(app, 'CognitoStack');
new StaticWebStack(app, 'StaticWebStack');
new SecretsStack(app, 'SecretsStack');
