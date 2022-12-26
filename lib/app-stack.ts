import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';


export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Write an simple lambda function
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.lambda_handler'
    });




  }
}
