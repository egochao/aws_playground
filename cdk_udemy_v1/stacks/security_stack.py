from aws_cdk import aws_ec2 as ec2, aws_ssm as ssm, aws_iam as iam, Stack
from constructs import Construct


class SecurityStack(Stack):
    def __init__(self, scope: Construct, id: str, vpc: ec2.Vpc, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        prj_name = self.node.try_get_context("project_name")
        env_name = self.node.try_get_context("env")

        lambda_sg = ec2.SecurityGroup(
            self,
            "lambdasg",
            security_group_name="lambda-sg",
            vpc=vpc,
            description="Allow Lambda to access the internet",
            allow_all_outbound=True,
        )

        self.bastion_sg = ec2.SecurityGroup(
            self,
            "bastionsg",
            security_group_name="bastion-sg",
            vpc=vpc,
            description="Allow SSH access to the bastion host",
            allow_all_outbound=True,
        )

        self.bastion_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(22), "Allow SSH access from the world")

        lambda_role = iam.Role(
            self,
            "lambda-role",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            role_name="lambda-role",
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaBasicExecutionRole")
            ],
        )

        lambda_role.add_to_policy(
            statement=iam.PolicyStatement(
                actions=["s3:*", "rds:*"],
                resources=["*"],
            )
        )

        # ssm parameters
        ssm.StringParameter(
            self,
            "lambda-param",
            parameter_name=f"/{env_name}/lambda/sg",
            string_value=lambda_sg.security_group_id,
        )

        ssm.StringParameter(
            self,
            "lambda-param-arn",
            parameter_name=f"/{env_name}/lambda-role-arn",
            string_value=lambda_role.role_arn,
        )

        ssm.StringParameter(
            self,
            "lambdarole-param-name",
            parameter_name=f"/{env_name}/lambda-role-name",
            string_value=lambda_role.role_name,
        )
