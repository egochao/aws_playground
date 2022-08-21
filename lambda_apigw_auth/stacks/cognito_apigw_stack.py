
from constructs import Construct
from aws_solutions_constructs.aws_cognito_apigateway_lambda import CognitoToApiGatewayToLambda
from aws_cdk import (
    aws_lambda as _lambda,
    Stack
)
from constructs import Construct
from typing import Any

class CognitoApigwAuthStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Overriding LambdaRestApiProps with type Any
        gateway_props = dict[Any, Any]

        construct = CognitoToApiGatewayToLambda(self, 'test-cognito-apigateway-lambda',
                                                lambda_function_props=_lambda.FunctionProps(
                                                    code=_lambda.Code.from_asset(
                                                        'lambda'),
                                                    runtime=_lambda.Runtime.PYTHON_3_9,
                                                    handler='index.handler'
                                                ),
                                                api_gateway_props=gateway_props(
                                                    proxy=False
                                                )
                                                )

        resource = construct.api_gateway.root.add_resource('foobar')
        resource.add_method('POST')

        # Mandatory to call this method to Apply the Cognito Authorizers on all API methods
        construct.add_authorizers()
