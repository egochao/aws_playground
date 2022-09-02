import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';


export class SecretsStack extends cdk.Stack {
    public readonly githubSecretName: string;
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const githubSecret = new secretsmanager.Secret(this, 'static-web-github', {})

        this.githubSecretName = githubSecret.secretName;

        new cdk.CfnOutput(this, 'secretName', {
            value: githubSecret.secretName,
        });
    }
}
