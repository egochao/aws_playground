import aws_cdk as cdk
from stacks.vpc_stack import VPCStack
from stacks.security_stack import SecurityStack
from stacks.s3_stack import S3Stack
from stacks.cognito_stack import CognitoStack

app = cdk.App()

vpc_stack = VPCStack(app, "vpc")
security_stack = SecurityStack(app, "security-stack", vpc=vpc_stack.vpc)
s3_stack = S3Stack(app, "s3bucket")
cognito_stack = CognitoStack(app, "cognito")

app.synth()
