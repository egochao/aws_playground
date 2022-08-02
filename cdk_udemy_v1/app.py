import aws_cdk as cdk
from stacks.vpc_stack import VPCStack
from stacks.security_stack import SecurityStack
from stacks.s3_stack import S3Stack
from stacks.cognito_stack import CognitoStack
from stacks.apigateway_stack import APIStack
from stacks.lambda_stack import LambdaStack


app = cdk.App()

vpc_stack = VPCStack(app, "vpc")
security_stack = SecurityStack(app, "security-stack", vpc=vpc_stack.vpc)
s3_stack = S3Stack(app, "s3bucket")
cognito_stack = CognitoStack(app, "cognito")
apigw_stack = APIStack(app, "apigw")
lambda_stack = LambdaStack(app, "lambda")

app.synth()
