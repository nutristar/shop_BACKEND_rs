import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool, VerificationEmailStyle, UserPoolClient } from 'aws-cdk-lib/aws-cognito';

export class CognitoAuthorizerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Создание Cognito User Pool
    const userPool = new UserPool(this, 'MyUserPool', {
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
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
    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: {
        userPassword: true
      }
    });

    // Вывод информации о User Pool
    new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    });

    // Вывод информации о User Pool Client
    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    });
  }
}

const app = new cdk.App();
new CognitoAuthorizerStack(app, 'CognitoAuthorizerStack', {
  env: { account: '761576343621', region: 'us-east-1' },
});
app.synth();
