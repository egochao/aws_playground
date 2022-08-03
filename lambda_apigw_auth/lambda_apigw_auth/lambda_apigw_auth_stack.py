from aws_cdk import (
    Stack,
    aws_dynamodb as dynamo_db,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
)
from aws_cdk import RemovalPolicy

import aws_cdk as cdk
from constructs import Construct


class LambdaApigwAuthStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # DynamoDB Table
        table = dynamo_db.Table(
            self,
            "Hits",
            partition_key=dynamo_db.Attribute(name="path", type=dynamo_db.AttributeType.STRING),
            encryption=dynamo_db.TableEncryption.AWS_MANAGED,
            removal_policy=RemovalPolicy.DESTROY,
            read_capacity=5,
        )

        # defines an AWS  Lambda resource
        dynamo_lambda = _lambda.Function(
            self,
            "DynamoLambdaHandler",
            runtime=_lambda.Runtime.PYTHON_3_9,  # execution environment
            handler="hello.handler",  # file is "hello", function is "handler"
            code=_lambda.Code.from_asset("lambda"),  # Code loaded from the lambda_fns dir
            environment={"HITS_TABLE_NAME": table.table_name},
        )

        # grant the lambda role read/write permissions to our table'
        table.grant_read_write_data(dynamo_lambda)

        api = apigw.LambdaRestApi(
            self,
            "Endpoint",
            handler=dynamo_lambda,
        )

        cdk.CfnOutput(self, "HTTP API Url", value=api.url)
