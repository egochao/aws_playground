from aws_cdk import aws_ec2 as ec2, aws_ssm as ssm, aws_s3 as s3, Stack
import aws_cdk as cdk

from constructs import Construct


class S3Stack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        prj_name = self.node.try_get_context("project_name")
        env_name = self.node.try_get_context("env")

        account_id = cdk.Aws.ACCOUNT_ID

        lambda_bucket = s3.Bucket(
            self,
            "lambda-bucket",
            access_control=s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            bucket_name=f"{account_id}-{env_name}-lambda-deploy-packages",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=cdk.RemovalPolicy.RETAIN,
        )

        ssm.StringParameter(
            self,
            "ssm-lambda-bucket",
            parameter_name=f"/{env_name}/lambda-s3-bucket",
            string_value=lambda_bucket.bucket_name,
        )
