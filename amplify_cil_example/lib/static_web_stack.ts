import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

  
export class StaticWebStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const githubSecret = new secretsmanager.Secret(this, 'githubSecret')
          

        const githubToken = secretsmanager.Secret.fromSecretNameV2(
            this, 'githubToken', githubSecret.secretName).secretValue;
        const amplifyApp = new amplify.App(this, 'StaticWebApp', {
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: "egochao",
                repository: "simple_gatsby_blog",
                oauthToken: githubToken,
            }),
        });
        const masterBranch = amplifyApp.addBranch("master");

        new cdk.CfnOutput(this, 'secretName', {
            value: githubSecret.secretName,
        });
        new cdk.CfnOutput(this, 'secretArn', {
            value: githubSecret.secretArn,
        });
        
    }
}
