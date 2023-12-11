"use strict";
// import * as cdk from 'aws-cdk-lib';
// import { Stack, StackProps,  aws_apigateway as apigateway } from 'aws-cdk-lib';
// import aws_cognito as cognito from 'aws-cdk-lib';
// import aws_lambda as lambda from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as dotenv from 'dotenv';
//
// dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationStack = void 0;
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
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const dotenv = require("dotenv");
dotenv.config();
class AuthorizationStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Значения переменных окружения
        const login = process.env.LOGIN || 'defaultLogin';
        const password = process.env.NUTRISTAR_PASSWORD || 'defaultPassword';
        // Определение Lambda функции для авторизации
        const basicAuthorizerLambda = new aws_cdk_lib_1.aws_lambda.Function(this, 'BasicAuthorizerFunction', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./basicAuthorizerLambda'),
            handler: 'basicAuthorizer.handler',
            environment: {
                [login]: password
            },
        });
        const importedApiId = cdk.Fn.importValue('ImportServiceApiId');
        const api = aws_cdk_lib_1.aws_apigateway.RestApi.fromRestApiId(this, 'ImportedApi', importedApiId);
        const authorizer = new aws_cdk_lib_1.aws_apigateway.TokenAuthorizer(this, 'MyAuthorizer', {
            handler: basicAuthorizerLambda,
            restApi: api,
        });
    }
}
exports.AuthorizationStack = AuthorizationStack;
const app = new cdk.App();
new AuthorizationStack(app, 'AuthorisLUNA', {
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDO0FBQ3RDLGtGQUFrRjtBQUNsRixvREFBb0Q7QUFDcEQsa0RBQWtEO0FBQ2xELDBDQUEwQztBQUMxQyxvQ0FBb0M7QUFDcEMsRUFBRTtBQUNGLG1CQUFtQjs7O0FBRW5CLGtEQUFrRDtBQUNsRCxvRUFBb0U7QUFDcEUsK0JBQStCO0FBRS9CLG9DQUFvQztBQUNwQyxrRUFBa0U7QUFDbEUsaUNBQWlDO0FBQ2pDLDRCQUE0QjtBQUM1QiwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLDJEQUEyRDtBQUMzRCxXQUFXO0FBQ1gseUJBQXlCO0FBQ3pCLHVCQUF1QjtBQUN2QixXQUFXO0FBQ1gsOEJBQThCO0FBQzlCLG1CQUFtQjtBQUNuQiw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCLGFBQWE7QUFDYixXQUFXO0FBQ1gsVUFBVTtBQUVWLDZCQUE2QjtBQUM3Qiw2RUFBNkU7QUFDN0Usa0JBQWtCO0FBQ2xCLHFCQUFxQjtBQUNyQiw4QkFBOEI7QUFDOUIsV0FBVztBQUNYLFVBQVU7QUFFVixxREFBcUQ7QUFDckQsNkZBQTZGO0FBQzdGLHNDQUFzQztBQUN0QyxVQUFVO0FBQ1YsRUFBRTtBQUNGLEVBQUU7QUFDRix3Q0FBd0M7QUFDeEMsdUNBQXVDO0FBQ3ZDLHVEQUF1RDtBQUN2RCxFQUFFO0FBQ0YsRUFBRTtBQUNGLDJGQUEyRjtBQUMzRiw0Q0FBNEM7QUFDNUMsZ0VBQWdFO0FBQ2hFLDRDQUE0QztBQUM1Qyx1QkFBdUI7QUFDdkIsNEJBQTRCO0FBQzVCLFdBQVc7QUFDWCxVQUFVO0FBQ1YsRUFBRTtBQUNGLEVBQUU7QUFDRixFQUFFO0FBQ0YsRUFBRTtBQUNGLDhCQUE4QjtBQUM5QiwwREFBMEQ7QUFDMUQsZ0NBQWdDO0FBQ2hDLHVDQUF1QztBQUN2QyxxREFBcUQ7QUFDckQscURBQXFEO0FBQ3JELFdBQVc7QUFDWCxVQUFVO0FBQ1YsRUFBRTtBQUNGLHlEQUF5RDtBQUN6RCwyREFBMkQ7QUFDM0QsMkZBQTJGO0FBQzNGLG9CQUFvQjtBQUNwQixpRUFBaUU7QUFDakUsVUFBVTtBQUNWLE1BQU07QUFDTixJQUFJO0FBRUosbUNBQW1DO0FBQ25DLDZDQUFvRztBQUVwRyxpQ0FBaUM7QUFFakMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLE1BQWEsa0JBQW1CLFNBQVEsbUJBQUs7SUFDM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixnQ0FBZ0M7UUFDaEMsTUFBTSxLQUFLLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksY0FBYyxDQUFDO1FBQzFELE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksaUJBQWlCLENBQUM7UUFHN0UsNkNBQTZDO1FBQzdDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSx3QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDakYsT0FBTyxFQUFFLHdCQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsSUFBSSxFQUFFLHdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQztZQUN0RCxPQUFPLEVBQUUseUJBQXlCO1lBQ2xDLFdBQVcsRUFBRTtnQkFDWCxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVE7YUFDbEI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sR0FBRyxHQUFHLDRCQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBR2pGLE1BQU0sVUFBVSxHQUFHLElBQUksNEJBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNwRSxPQUFPLEVBQUUscUJBQXFCO1lBQzlCLE9BQU8sRUFBRSxHQUFHO1NBRWYsQ0FBQyxDQUFDO0lBSUwsQ0FBQztDQUNGO0FBaENELGdEQWdDQztBQUtELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksa0JBQWtCLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRTtJQUN4QyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO0NBQzVELENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCAgYXdzX2FwaWdhdGV3YXkgYXMgYXBpZ2F0ZXdheSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuLy8gaW1wb3J0IGF3c19jb2duaXRvIGFzIGNvZ25pdG8gZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBpbXBvcnQgYXdzX2xhbWJkYSBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuLy8gaW1wb3J0ICogYXMgZG90ZW52IGZyb20gJ2RvdGVudic7XHJcbi8vXHJcbi8vIGRvdGVudi5jb25maWcoKTtcclxuXHJcbi8vIGV4cG9ydCBjbGFzcyBBdXRob3JpemF0aW9uU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcbi8vICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XHJcbi8vICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbi8vICAgICAvLyDQodC+0LfQtNCw0L3QuNC1IENvZ25pdG8gVXNlciBQb29sXHJcbi8vICAgICBjb25zdCB1c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsICdNeVVzZXJQb29sJywge1xyXG4vLyAgICAgICBzZWxmU2lnblVwRW5hYmxlZDogdHJ1ZSxcclxuLy8gICAgICAgdXNlclZlcmlmaWNhdGlvbjoge1xyXG4vLyAgICAgICAgIGVtYWlsU3ViamVjdDogJ1ZlcmlmeSB5b3VyIGVtYWlsIGZvciBvdXIgYXBwIScsXHJcbi8vICAgICAgICAgZW1haWxCb2R5OiAnVGhhbmtzIGZvciBzaWduaW5nIHVwIHRvIG91ciBhcHAhIFlvdXIgdmVyaWZpY2F0aW9uIGNvZGUgaXMgeyMjIyN9JyxcclxuLy8gICAgICAgICBlbWFpbFN0eWxlOiBjb2duaXRvLlZlcmlmaWNhdGlvbkVtYWlsU3R5bGUuQ09ERSxcclxuLy8gICAgICAgfSxcclxuLy8gICAgICAgc2lnbkluQWxpYXNlczoge1xyXG4vLyAgICAgICAgIGVtYWlsOiB0cnVlLFxyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICBzdGFuZGFyZEF0dHJpYnV0ZXM6IHtcclxuLy8gICAgICAgICBlbWFpbDoge1xyXG4vLyAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbi8vICAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxyXG4vLyAgICAgICAgIH0sXHJcbi8vICAgICAgIH0sXHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICAvLyDQodC+0LfQtNCw0L3QuNC1IEFwcCBDbGllbnRcclxuLy8gICAgIGNvbnN0IHVzZXJQb29sQ2xpZW50ID0gbmV3IGNvZ25pdG8uVXNlclBvb2xDbGllbnQodGhpcywgJ0FwcENsaWVudCcsIHtcclxuLy8gICAgICAgdXNlclBvb2wsXHJcbi8vICAgICAgIGF1dGhGbG93czoge1xyXG4vLyAgICAgICAgIHVzZXJQYXNzd29yZDogdHJ1ZSxcclxuLy8gICAgICAgfSxcclxuLy8gICAgIH0pO1xyXG5cclxuLy8gICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1IENvZ25pdG8gQXV0aG9yaXplciDQsiBBUEkgR2F0ZXdheVxyXG4vLyAgICAgY29uc3QgYXV0aG9yaXplciA9IG5ldyBhcGlnYXRld2F5LkNvZ25pdG9Vc2VyUG9vbHNBdXRob3JpemVyKHRoaXMsICdVc2VyQXV0aG9yaXplcicsIHtcclxuLy8gICAgICAgY29nbml0b1VzZXJQb29sczogW3VzZXJQb29sXSxcclxuLy8gICAgIH0pO1xyXG4vL1xyXG4vL1xyXG4vLyAgICAgLy8gINC30L3QsNGH0LXQvdC40Y8g0L/QtdGA0LXQvNC10L3QvdGL0YUg0L7QutGA0YPQttC10L3QuNGPXHJcbi8vICAgICBjb25zdCBsb2dpbiA9IHByb2Nlc3MuZW52LkxPR0lOO1xyXG4vLyAgICAgY29uc3QgcGFzc3dvcmQgPSBwcm9jZXNzLmVudi5OVVRSSVNUQVJfUEFTU1dPUkQ7XHJcbi8vXHJcbi8vXHJcbi8vICAgICBjb25zdCBiYXNpY0F1dGhvcml6ZXJMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdCYXNpY0F1dGhvcml6ZXJGdW5jdGlvbicsIHtcclxuLy8gICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuLy8gICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL2Jhc2ljQXV0aG9yaXplckxhbWJkYScpLFxyXG4vLyAgICAgICBoYW5kbGVyOiAnYmFzaWNBdXRob3JpemVyLmhhbmRsZXInLFxyXG4vLyAgICAgICBlbnZpcm9ubWVudDoge1xyXG4vLyAgICAgICAgIFtsb2dpbl06IHBhc3N3b3JkXHJcbi8vICAgICAgIH0sXHJcbi8vICAgICB9KTtcclxuLy9cclxuLy9cclxuLy9cclxuLy9cclxuLy8gICAgIC8vINCh0L7Qt9C00LDQvdC40LUgQVBJIEdhdGV3YXlcclxuLy8gICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ015QXBpJywge1xyXG4vLyAgICAgICByZXN0QXBpTmFtZTogJ1NlcnZpY2UnLFxyXG4vLyAgICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcclxuLy8gICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcclxuLy8gICAgICAgICBhbGxvd01ldGhvZHM6IGFwaWdhdGV3YXkuQ29ycy5BTExfTUVUSE9EUyxcclxuLy8gICAgICAgfSxcclxuLy8gICAgIH0pO1xyXG4vL1xyXG4vLyAgICAgLy8g0J3QsNGB0YLRgNC+0LnQutCwINC/0YPRgtC4IEFQSSBHYXRld2F5INGBIENvZ25pdG8gQXV0aG9yaXplclxyXG4vLyAgICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnbXlyZXNvdXJjZScpO1xyXG4vLyAgICAgcmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihiYXNpY0F1dGhvcml6ZXJMYW1iZGEpLCB7XHJcbi8vICAgICAgIGF1dGhvcml6ZXIsXHJcbi8vICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcGlnYXRld2F5LkF1dGhvcml6YXRpb25UeXBlLkNPR05JVE8sXHJcbi8vICAgICB9KTtcclxuLy8gICB9XHJcbi8vIH1cclxuXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBhd3NfbGFtYmRhIGFzIGxhbWJkYSwgYXdzX2FwaWdhdGV3YXkgYXMgYXBpZ2F0ZXdheSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnO1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1dGhvcml6YXRpb25TdGFjayBleHRlbmRzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8vINCX0L3QsNGH0LXQvdC40Y8g0L/QtdGA0LXQvNC10L3QvdGL0YUg0L7QutGA0YPQttC10L3QuNGPXHJcbiAgICBjb25zdCBsb2dpbjogc3RyaW5nID0gcHJvY2Vzcy5lbnYuTE9HSU4gfHwgJ2RlZmF1bHRMb2dpbic7XHJcbiAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gcHJvY2Vzcy5lbnYuTlVUUklTVEFSX1BBU1NXT1JEIHx8ICdkZWZhdWx0UGFzc3dvcmQnO1xyXG5cclxuXHJcbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1IExhbWJkYSDRhNGD0L3QutGG0LjQuCDQtNC70Y8g0LDQstGC0L7RgNC40LfQsNGG0LjQuFxyXG4gICAgY29uc3QgYmFzaWNBdXRob3JpemVyTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnQmFzaWNBdXRob3JpemVyRnVuY3Rpb24nLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9iYXNpY0F1dGhvcml6ZXJMYW1iZGEnKSxcclxuICAgICAgaGFuZGxlcjogJ2Jhc2ljQXV0aG9yaXplci5oYW5kbGVyJyxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBbbG9naW5dOiBwYXNzd29yZFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaW1wb3J0ZWRBcGlJZCA9IGNkay5Gbi5pbXBvcnRWYWx1ZSgnSW1wb3J0U2VydmljZUFwaUlkJyk7XHJcbiAgICBjb25zdCBhcGkgPSBhcGlnYXRld2F5LlJlc3RBcGkuZnJvbVJlc3RBcGlJZCh0aGlzLCAnSW1wb3J0ZWRBcGknLCBpbXBvcnRlZEFwaUlkKTtcclxuXHJcblxyXG4gICAgY29uc3QgYXV0aG9yaXplciA9IG5ldyBhcGlnYXRld2F5LlRva2VuQXV0aG9yaXplcih0aGlzLCAnTXlBdXRob3JpemVyJywge1xyXG4gICAgICAgIGhhbmRsZXI6IGJhc2ljQXV0aG9yaXplckxhbWJkYSxcclxuICAgICAgICByZXN0QXBpOiBhcGksXHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5uZXcgQXV0aG9yaXphdGlvblN0YWNrKGFwcCwgJ0F1dGhvcmlzTFVOQScsIHsgICAvLyAg0L3QsNC30LLQsNC90LjQtSDRgdGC0LXQutCwXHJcbiAgICBlbnY6IHsgYWNjb3VudDogJzc2MTU3NjM0MzYyMScsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSwgLy9cclxufSk7XHJcbmFwcC5zeW50aCgpO1xyXG4iXX0=