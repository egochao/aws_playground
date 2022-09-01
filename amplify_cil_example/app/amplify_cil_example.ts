#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { CognitoStack } from '../stack/cognito_stack';
import { StaticWebStack } from '../stack/static_web_stack';


const app = new cdk.App();
new CognitoStack(app, 'CognitoStack');
new StaticWebStack(app, 'StaticWebStack');
