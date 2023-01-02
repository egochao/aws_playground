import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  AccountRecovery,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito'
import {
  CfnOutput,
  Duration,
  Expiration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import * as path from 'path'
import {
    GraphqlApi,
    SchemaFile,
    AuthorizationType,
    FieldLogLevel,
    MappingTemplate,
    PrimaryKey,
    Values,
} from '@aws-cdk/aws-appsync-alpha'

import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

export class AppsyncTodoBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, 'todoTestUserPool', {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    })
    new CfnUserPoolGroup(this, 'TodoUserPoolGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'Admin',
      description: 'Admin users for the TodoTestAPI',
    })
    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
    })
      

    const todoTable = new Table(this, 'Todo Table', {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
    })

    const api = new GraphqlApi(this, 'TodoTestAPI', {
      name: 'TodoTestAPI',
      schema: SchemaFile.fromAsset(path.join(__dirname, 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.API_KEY,
            apiKeyConfig: {
              name: 'simple api key',
              description: 'a simple api key',
              expires: Expiration.after(Duration.days(30)),
            },
          },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    })
    
    api
    .addDynamoDbDataSource('TodoTableQueryGetTodo', todoTable)
    .createResolver( "QueryGetTodoResolver", {
      typeName: 'Query',
      fieldName: 'getTodo',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    })

    api
    .addDynamoDbDataSource('TodoTableQueryScanTodos', todoTable)
    .createResolver( "QueryScanTodosResolver", {
      typeName: 'Query',
      fieldName: 'listTodos',
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    })

    api
    .addDynamoDbDataSource('TodoTableMutationAddTodo', todoTable)
    .createResolver("MutationAddTodoResolver", {
          typeName: 'Mutation',
          fieldName: 'addTodo',
          requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
            PrimaryKey.partition('id').auto(),
            Values.projecting('input')
          ),
          responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        })

    api
    .addDynamoDbDataSource('TodoTableMutationUpdateTodo', todoTable)
    .createResolver("MutationUpdateTodoResolver", {
      typeName: 'Mutation',
      fieldName: 'updateTodo',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition('id').is('input.id'),
        Values.projecting('input')
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    })

    api
    .addDynamoDbDataSource('TodoTableMutationDeleteTodo', todoTable)
    .createResolver("MutationDeleteTodoResolver", {
      typeName: 'Mutation',
      fieldName: 'deleteTodo',
      requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    })

    new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    })
    
    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    })
    
    new CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    })
    new CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey as string,
    })
    
    new CfnOutput(this, 'GraphQLAPIID', {
      value: api.apiId,
    })    
  }
}
