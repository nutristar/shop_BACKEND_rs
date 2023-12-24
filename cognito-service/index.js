"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoAuthorizerStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
class CognitoAuthorizerStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Создание Cognito User Pool
        const userPool = new aws_cognito_1.UserPool(this, 'MyUserPool', {
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: 'Verify your email for our awesome app!',
                emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
                emailStyle: aws_cognito_1.VerificationEmailStyle.CODE,
            },
            signInAliases: {
                email: true
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true
                },
            }
        });
        // Создание Cognito User Pool Client
        const userPoolClient = new aws_cognito_1.UserPoolClient(this, 'UserPoolClient', {
            userPool,
            authFlows: {
                userPassword: true
            }
        });
        // Вывод информации о User Pool
        new aws_cdk_lib_1.CfnOutput(this, 'UserPoolId', {
            value: userPool.userPoolId
        });
        // Вывод информации о User Pool Client
        new aws_cdk_lib_1.CfnOutput(this, 'UserPoolClientId', {
            value: userPoolClient.userPoolClientId
        });
    }
}
exports.CognitoAuthorizerStack = CognitoAuthorizerStack;
const app = new cdk.App();
new CognitoAuthorizerStack(app, 'CognitoAuthorizerStack', {
    env: { account: '761576343621', region: 'us-east-1' },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsNkNBQTJEO0FBRTNELHlEQUEyRjtBQUUzRixNQUFhLHNCQUF1QixTQUFRLG1CQUFLO0lBQy9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkJBQTZCO1FBQzdCLE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hELGlCQUFpQixFQUFFLElBQUk7WUFDdkIsZ0JBQWdCLEVBQUU7Z0JBQ2hCLFlBQVksRUFBRSx3Q0FBd0M7Z0JBQ3RELFNBQVMsRUFBRSw0RUFBNEU7Z0JBQ3ZGLFVBQVUsRUFBRSxvQ0FBc0IsQ0FBQyxJQUFJO2FBQ3hDO1lBQ0QsYUFBYSxFQUFFO2dCQUNiLEtBQUssRUFBRSxJQUFJO2FBQ1o7WUFDRCxrQkFBa0IsRUFBRTtnQkFDbEIsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsTUFBTSxjQUFjLEdBQUcsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNoRSxRQUFRO1lBQ1IsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRSxJQUFJO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsK0JBQStCO1FBQy9CLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtTQUMzQixDQUFDLENBQUM7UUFFSCxzQ0FBc0M7UUFDdEMsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN0QyxLQUFLLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtTQUN2QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF6Q0Qsd0RBeUNDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLEVBQUU7SUFDeEQsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO0NBQ3RELENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBDZm5PdXRwdXQgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBVc2VyUG9vbCwgVmVyaWZpY2F0aW9uRW1haWxTdHlsZSwgVXNlclBvb2xDbGllbnQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29nbml0b0F1dGhvcml6ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUgQ29nbml0byBVc2VyIFBvb2xcclxuICAgIGNvbnN0IHVzZXJQb29sID0gbmV3IFVzZXJQb29sKHRoaXMsICdNeVVzZXJQb29sJywge1xyXG4gICAgICBzZWxmU2lnblVwRW5hYmxlZDogdHJ1ZSxcclxuICAgICAgdXNlclZlcmlmaWNhdGlvbjoge1xyXG4gICAgICAgIGVtYWlsU3ViamVjdDogJ1ZlcmlmeSB5b3VyIGVtYWlsIGZvciBvdXIgYXdlc29tZSBhcHAhJyxcclxuICAgICAgICBlbWFpbEJvZHk6ICdUaGFua3MgZm9yIHNpZ25pbmcgdXAgdG8gb3VyIGF3ZXNvbWUgYXBwISBZb3VyIHZlcmlmaWNhdGlvbiBjb2RlIGlzIHsjIyMjfScsXHJcbiAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxyXG4gICAgICB9LFxyXG4gICAgICBzaWduSW5BbGlhc2VzOiB7XHJcbiAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbXV0YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUgQ29nbml0byBVc2VyIFBvb2wgQ2xpZW50XHJcbiAgICBjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBVc2VyUG9vbENsaWVudCh0aGlzLCAnVXNlclBvb2xDbGllbnQnLCB7XHJcbiAgICAgIHVzZXJQb29sLFxyXG4gICAgICBhdXRoRmxvd3M6IHtcclxuICAgICAgICB1c2VyUGFzc3dvcmQ6IHRydWVcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JLRi9Cy0L7QtCDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviBVc2VyIFBvb2xcclxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ1VzZXJQb29sSWQnLCB7XHJcbiAgICAgIHZhbHVlOiB1c2VyUG9vbC51c2VyUG9vbElkXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQktGL0LLQvtC0INC40L3RhNC+0YDQvNCw0YbQuNC4INC+IFVzZXIgUG9vbCBDbGllbnRcclxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ1VzZXJQb29sQ2xpZW50SWQnLCB7XHJcbiAgICAgIHZhbHVlOiB1c2VyUG9vbENsaWVudC51c2VyUG9vbENsaWVudElkXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcbm5ldyBDb2duaXRvQXV0aG9yaXplclN0YWNrKGFwcCwgJ0NvZ25pdG9BdXRob3JpemVyU3RhY2snLCB7XHJcbiAgZW52OiB7IGFjY291bnQ6ICc3NjE1NzYzNDM2MjEnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXHJcbn0pO1xyXG5hcHAuc3ludGgoKTtcclxuIl19