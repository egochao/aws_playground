import * as cdk from 'aws-cdk-lib';
import { SecretValue } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';


export class SecretsStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const github_user_token = new secretsmanager.Secret(this, 'static-web-github', {
            secretObjectValue: {
            username: SecretValue.unsafePlainText("egochao"),
            password: SecretValue.unsafePlainText('dummy password'),
            },
        })
        console.log(github_user_token.secretValueFromJson('username').toString()),
        console.log(github_user_token.secretValueFromJson('password'))
    }
}