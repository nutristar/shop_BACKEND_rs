#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import {aws_s3_notifications as s3n} from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib'; // Добавлен импорт для IAM


export class ImportServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        //import existing s3
        const xxximportservicebacket = s3.Bucket.fromBucketAttributes(this, 'xxximportservicebacket',  { bucketArn: "arn:aws:s3:::xxximportservicebacket"});

        // Определение Lambda функции1
        const importProductsFileLambda = new lambda.Function(this, 'importProductsFileLambda', {
          runtime: lambda.Runtime.PYTHON_3_8,
          code: lambda.Code.fromAsset('./logic1'), // здесь
          handler: 'lambda_function1.handler1',
          environment: {
            BUCKET: 'xxximportservicebacket', //  имя  S3 бакета
          },
        });

         // Создание Lambda функции 2
        const importFileParser = new lambda.Function(this, 'ImportFileParser', {
          runtime: lambda.Runtime.PYTHON_3_8,
          code: lambda.Code.fromAsset('./logic2'), //  путь к коду Lambda
          handler: 'lambda_function2.handler', // Файл и обработчик в Lambda
        });

        // Настройка Lambda для реакции на события ObjectCreated в папке 'uploaded'
        xxximportservicebacket.addEventNotification(
            s3.EventType.OBJECT_CREATED,
            new s3n.LambdaDestination(importFileParser),
            { prefix: 'uploaded/' } // Только для объектов в папке 'uploaded'
            );

            // Добавление разрешений для Lambda функции на чтение и запись в S3 бакет
        xxximportservicebacket.grantReadWrite(importFileParser);

        // Создание новой роли и политики для Lambda, чтобы она могла взаимодействовать с S3
        const s3Policy = new iam.PolicyStatement({
          actions: ['s3:GetObject', 's3:PutObject'],
          resources: [
            `arn:aws:s3:::xxximportservicebacket/*`,

          ],  });

        //assign this policy to lambda importProductsFileLambda
        importProductsFileLambda.addToRolePolicy(s3Policy)

        // Создание API Gateway для Lambda
        const api = new apigateway.RestApi(this, 'ImportServiceApi', {
          restApiName: 'ImportService',
          description: 'API for Import Service',
          defaultCorsPreflightOptions: {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
          },
        });

        // Добавление нового ресурса и метода для вызова Lambda
        const importResource = api.root.addResource('import');
        const importIntegration = new apigateway.LambdaIntegration(importProductsFileLambda);
        importResource.addMethod('GET', importIntegration, {
          requestParameters: {
            'method.request.querystring.name': true,
          },
          methodResponses: [
            {
              statusCode: '200',
              responseModels: {
                'application/json': apigateway.Model.EMPTY_MODEL,
              },
            },
          ],
        });

    }
}

const app = new cdk.App();
new ImportServiceStack(app, 'ImportServiceStack222', {   //  название стека  свл вуздщн
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
