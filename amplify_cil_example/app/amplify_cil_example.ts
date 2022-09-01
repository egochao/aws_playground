#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { CognitoStack } from '../stack/cognito_stack';

const app = new cdk.App();
new CognitoStack(app, 'CognitoStack');
