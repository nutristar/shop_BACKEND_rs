// import * as cdk from 'aws-cdk-lib';
// import { Stack, StackProps,  aws_apigateway as apigateway } from 'aws-cdk-lib';
// import aws_cognito as cognito from 'aws-cdk-lib';
// import aws_lambda as lambda from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as dotenv from 'dotenv';
//
// dotenv.config();

// export class AuthorizationStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     // Создание Cognito User Pool
//     const userPool = new cognito.UserPool(this, 'MyUserPool', {
//       selfSignUpEnabled: true,
//       userVerification: {
//         emailSubject: 'Verify your email for our app!',
//         emailBody: 'Thanks for signing up to our app! Your verification code is {####}',
//         emailStyle: cognito.VerificationEmailStyle.CODE,
//       },
//       signInAliases: {
//         email: true,
//       },
//       standardAttributes: {
//         email: {
//           required: true,
//           mutable: true,
//         },
//       },
//     });

//     // Создание App Client
//     const userPoolClient = new cognito.UserPoolClient(this, 'AppClient', {
//       userPool,
//       authFlows: {
//         userPassword: true,
//       },
//     });

//     // Добавление Cognito Authorizer в API Gateway
//     const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'UserAuthorizer', {
//       cognitoUserPools: [userPool],
//     });
//
//
//     //  значения переменных окружения
//     const login = process.env.LOGIN;
//     const password = process.env.NUTRISTAR_PASSWORD;
//
//
//     const basicAuthorizerLambda = new lambda.Function(this, 'BasicAuthorizerFunction', {
//       runtime: lambda.Runtime.PYTHON_3_8,
//       code: lambda.Code.fromAsset('./basicAuthorizerLambda'),
//       handler: 'basicAuthorizer.handler',
//       environment: {
//         [login]: password
//       },
//     });
//
//
//
//
//     // Создание API Gateway
//     const api = new apigateway.RestApi(this, 'MyApi', {
//       restApiName: 'Service',
//       defaultCorsPreflightOptions: {
//         allowOrigins: apigateway.Cors.ALL_ORIGINS,
//         allowMethods: apigateway.Cors.ALL_METHODS,
//       },
//     });
//
//     // Настройка пути API Gateway с Cognito Authorizer
//     const resource = api.root.addResource('myresource');
//     resource.addMethod('GET', new apigateway.LambdaIntegration(basicAuthorizerLambda), {
//       authorizer,
//       authorizationType: apigateway.AuthorizationType.COGNITO,
//     });
//   }
// }

import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, aws_lambda as lambda, aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';

dotenv.config();

export class AuthorizationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Значения переменных окружения
    const login: string = process.env.LOGIN || 'defaultLogin';
    const password: string = process.env.NUTRISTAR_PASSWORD || 'defaultPassword';


    // Определение Lambda функции для авторизации
    const basicAuthorizerLambda = new lambda.Function(this, 'BasicAuthorizerFunction', {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset('./basicAuthorizerLambda'),
      handler: 'basicAuthorizer.handler',
      environment: {
        [login]: password
      },
    });






  }
}




const app = new cdk.App();
new AuthorizationStack(app, 'AuthorisLUNA', {   //  название стека
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
