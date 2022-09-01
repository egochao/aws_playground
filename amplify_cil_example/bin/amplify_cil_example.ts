#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { CognitoStack } from '../lib/cognito_stack';
import { StaticWebStack } from '../lib/static_web_stack';


const app = new cdk.App();
new CognitoStack(app, 'CognitoStack');
new StaticWebStack(app, 'StaticWebStack');
