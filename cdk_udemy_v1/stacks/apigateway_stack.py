from aws_cdk import aws_apigateway as apigw, aws_iam as iam, aws_ssm as ssm, Stack
from constructs import Construct
import aws_cdk as cdk

class APIStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        prj_name = self.node.try_get_context("project_name")
        env_name = self.node.try_get_context("env")

        account = cdk.Aws.ACCOUNT_ID
        region = cdk.Aws.REGION

        api_gateway = apigw.RestApi(
            self, "restapi", endpoint_types=[apigw.EndpointType.REGIONAL], rest_api_name=prj_name + "-service"
        )
        api_gateway.root.add_method("ANY")

        ssm.StringParameter(
            self,
            "api-gw",
            parameter_name="/" + env_name + "/api-gw-url",
            string_value="https://" + api_gateway.rest_api_id + ".execute-api." + region + ".amazonaws.com/",
        )
        ssm.StringParameter(
            self, "api-gw-id", parameter_name="/" + env_name + "api-gw-id", string_value=api_gateway.rest_api_id
        )
