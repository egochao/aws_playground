import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as cdk from 'aws-cdk-lib';



export class CognitoStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: 'static-web-app-user-pool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            },
            autoVerify: {
                email: true
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool,
            userPoolClientName: 'static-web-app-user-pool',
            generateSecret: true
        });
        // const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
        //     userPool,
        //     domainName: 'UserPoolDomain'
        // });
    }
}
