#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { CognitoStack } from '../lib/cognito_stack';
import { StaticWebStack } from '../lib/static_web_stack';
import { SecretsStack } from '../lib/secret_stack';

const app = new cdk.App();
const secrets = new SecretsStack(app, 'SecretsStack');

const authStack = new CognitoStack(app, 'CognitoStack');

const website = new StaticWebStack(app, 'StaticWebStack');
