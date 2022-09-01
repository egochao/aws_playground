import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';

export class StaticWebStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const amplifyApp = new amplify.App(this, 'StaticWebApp', {
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: 'egochao',
                repository: 'https://github.com/egochao/simple_gatsby_blog',
                oauthToken: cdk.SecretValue.secretsManager('bacnv6-token'),
            }),
        });
        const masterBranch = amplifyApp.addBranch('master');
    }
}