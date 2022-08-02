from aws_cdk import aws_apigateway as apigw, aws_lambda as _lambda, Stack
from constructs import Construct


class LambdaStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        prj_name = self.node.try_get_context("project_name")
        env_name = self.node.try_get_context("env")

        lambda_fn = _lambda.Function(
            self,
            "hello-world-lambda",
            runtime=_lambda.Runtime.PYTHON_3_9,
            code=_lambda.Code.from_asset("lambda"),
            handler="hello.handler",
        )

        api_gateway = apigw.LambdaRestApi(
            self,
            "helloworld",
            handler=lambda_fn,
            rest_api_name=prj_name + "-service-lambda",
        )
