import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';

export class StaticWebStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const repo = new codecommit.Repository(this, 'StaticWebRepository', {
            repositoryName: 'static-web-app-repo',
            description: 'Static Web App Repository',
            code: codecommit.Code.fromDirectory('static_web_app'),
        });

        const amplifyApp = new amplify.App(this, 'StaticWebApp', {
            sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
                repository: repo,
            }),
        });

        const masterBranch = amplifyApp.addBranch('main');

    }
}