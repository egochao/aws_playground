#!/usr/bin/env python3
import os

import aws_cdk as cdk

from stacks.lambda_apigw_auth_stack import LambdaApigwAuthStack
from stacks.cognito_apigw_stack import CognitoApigwAuthStack

app = cdk.App()
# LambdaApigwAuthStack(app, "LambdaApigwAuthStack")
CognitoApigwAuthStack(app, "CognitoApigwAuthStack")

app.synth()
