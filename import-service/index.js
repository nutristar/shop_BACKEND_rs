#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cdk_lib_2 = require("aws-cdk-lib");
const aws_cdk_lib_3 = require("aws-cdk-lib");
const aws_cdk_lib_4 = require("aws-cdk-lib");
const aws_cdk_lib_5 = require("aws-cdk-lib"); // Добавлен импорт для IAM
class ImportServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        //import existing s3
        const xxximportservicebacket = aws_cdk_lib_2.aws_s3.Bucket.fromBucketAttributes(this, 'xxximportservicebacket', { bucketArn: "arn:aws:s3:::xxximportservicebacket" });
        // Определение Lambda функции1
        const importProductsFileLambda = new aws_cdk_lib_1.aws_lambda.Function(this, 'importProductsFileLambda', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./logic1'),
            handler: 'lambda_function1.handler1',
            environment: {
                BUCKET: 'xxximportservicebacket', //  имя  S3 бакета
            },
        });
        // Создание Lambda функции 2
        const importFileParser = new aws_cdk_lib_1.aws_lambda.Function(this, 'ImportFileParser', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./logic2'),
            handler: 'lambda_function2.handler', // Файл и обработчик в Lambda
        });
        // Настройка Lambda для реакции на события ObjectCreated в папке 'uploaded'
        xxximportservicebacket.addEventNotification(aws_cdk_lib_2.aws_s3.EventType.OBJECT_CREATED, new aws_cdk_lib_3.aws_s3_notifications.LambdaDestination(importFileParser), { prefix: 'uploaded/' } // Только для объектов в папке 'uploaded'
        );
        // Добавление разрешений для Lambda функции на чтение и запись в S3 бакет
        xxximportservicebacket.grantReadWrite(importFileParser);
        // Создание новой роли и политики для Lambda, чтобы она могла взаимодействовать с S3
        const s3Policy = new aws_cdk_lib_5.aws_iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:PutObject'],
            resources: [
                `arn:aws:s3:::xxximportservicebacket/*`,
            ],
        });
        //assign this policy to lambda importProductsFileLambda
        importProductsFileLambda.addToRolePolicy(s3Policy);
        // Создание API Gateway для Lambda
        const api = new aws_cdk_lib_4.aws_apigateway.RestApi(this, 'ImportServiceApi', {
            restApiName: 'ImportService',
            description: 'API for Import Service',
            defaultCorsPreflightOptions: {
                allowOrigins: aws_cdk_lib_4.aws_apigateway.Cors.ALL_ORIGINS,
                allowMethods: aws_cdk_lib_4.aws_apigateway.Cors.ALL_METHODS,
            },
        });
        // Добавление нового ресурса и метода для вызова Lambda
        const importResource = api.root.addResource('import');
        const importIntegration = new aws_cdk_lib_4.aws_apigateway.LambdaIntegration(importProductsFileLambda);
        importResource.addMethod('GET', importIntegration, {
            requestParameters: {
                'method.request.querystring.name': true,
            },
            methodResponses: [
                {
                    statusCode: '200',
                    responseModels: {
                        'application/json': aws_cdk_lib_4.aws_apigateway.Model.EMPTY_MODEL,
                    },
                },
            ],
        });
    }
}
exports.ImportServiceStack = ImportServiceStack;
const app = new cdk.App();
new ImportServiceStack(app, 'ImportServiceStack222', {
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBQ25DLDZDQUFtRDtBQUNuRCw2Q0FBMkM7QUFDM0MsNkNBQXdEO0FBQ3hELDZDQUEyRDtBQUMzRCw2Q0FBNkMsQ0FBQywwQkFBMEI7QUFHeEUsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEIsb0JBQW9CO1FBQ3BCLE1BQU0sc0JBQXNCLEdBQUcsb0JBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFHLEVBQUUsU0FBUyxFQUFFLHFDQUFxQyxFQUFDLENBQUMsQ0FBQztRQUVwSiw4QkFBOEI7UUFDOUIsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUNyRixPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN2QyxPQUFPLEVBQUUsMkJBQTJCO1lBQ3BDLFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsa0JBQWtCO2FBQ3JEO1NBQ0YsQ0FBQyxDQUFDO1FBRUYsNEJBQTRCO1FBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx3QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsT0FBTyxFQUFFLHdCQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsSUFBSSxFQUFFLHdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDdkMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLDZCQUE2QjtTQUNuRSxDQUFDLENBQUM7UUFFSCwyRUFBMkU7UUFDM0Usc0JBQXNCLENBQUMsb0JBQW9CLENBQ3ZDLG9CQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFDM0IsSUFBSSxrQ0FBRyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEVBQzNDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLHlDQUF5QztTQUNoRSxDQUFDO1FBRUYseUVBQXlFO1FBQzdFLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXhELG9GQUFvRjtRQUNwRixNQUFNLFFBQVEsR0FBRyxJQUFJLHFCQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7WUFDekMsU0FBUyxFQUFFO2dCQUNULHVDQUF1QzthQUV4QztTQUFJLENBQUMsQ0FBQztRQUVULHVEQUF1RDtRQUN2RCx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFbEQsa0NBQWtDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksNEJBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzNELFdBQVcsRUFBRSxlQUFlO1lBQzVCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRSw0QkFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUN6QyxZQUFZLEVBQUUsNEJBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVzthQUMxQztTQUNGLENBQUMsQ0FBQztRQUVILHVEQUF1RDtRQUN2RCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxNQUFNLGlCQUFpQixHQUFHLElBQUksNEJBQVUsQ0FBQyxpQkFBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JGLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQ2pELGlCQUFpQixFQUFFO2dCQUNqQixpQ0FBaUMsRUFBRSxJQUFJO2FBQ3hDO1lBQ0QsZUFBZSxFQUFFO2dCQUNmO29CQUNFLFVBQVUsRUFBRSxLQUFLO29CQUNqQixjQUFjLEVBQUU7d0JBQ2Qsa0JBQWtCLEVBQUUsNEJBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVztxQkFDakQ7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUVQLENBQUM7Q0FDSjtBQXpFRCxnREF5RUM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLGtCQUFrQixDQUFDLEdBQUcsRUFBRSx1QkFBdUIsRUFBRTtJQUNqRCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO0NBQzVELENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2xhbWJkYSBhcyBsYW1iZGEgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IGF3c19zMyBhcyBzMyB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHthd3NfczNfbm90aWZpY2F0aW9ucyBhcyBzM259IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2FwaWdhdGV3YXkgYXMgYXBpZ2F0ZXdheSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2lhbSBhcyBpYW0gfSBmcm9tICdhd3MtY2RrLWxpYic7IC8vINCU0L7QsdCw0LLQu9C10L0g0LjQvNC/0L7RgNGCINC00LvRjyBJQU1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSW1wb3J0U2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vaW1wb3J0IGV4aXN0aW5nIHMzXHJcbiAgICAgICAgY29uc3QgeHh4aW1wb3J0c2VydmljZWJhY2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyh0aGlzLCAneHh4aW1wb3J0c2VydmljZWJhY2tldCcsICB7IGJ1Y2tldEFybjogXCJhcm46YXdzOnMzOjo6eHh4aW1wb3J0c2VydmljZWJhY2tldFwifSk7XHJcblxyXG4gICAgICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4MVxyXG4gICAgICAgIGNvbnN0IGltcG9ydFByb2R1Y3RzRmlsZUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2ltcG9ydFByb2R1Y3RzRmlsZUxhbWJkYScsIHtcclxuICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vbG9naWMxJyksIC8vINC30LTQtdGB0YxcclxuICAgICAgICAgIGhhbmRsZXI6ICdsYW1iZGFfZnVuY3Rpb24xLmhhbmRsZXIxJyxcclxuICAgICAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgICAgIEJVQ0tFVDogJ3h4eGltcG9ydHNlcnZpY2ViYWNrZXQnLCAvLyAg0LjQvNGPICBTMyDQsdCw0LrQtdGC0LBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1IExhbWJkYSDRhNGD0L3QutGG0LjQuCAyXHJcbiAgICAgICAgY29uc3QgaW1wb3J0RmlsZVBhcnNlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0ltcG9ydEZpbGVQYXJzZXInLCB7XHJcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxyXG4gICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL2xvZ2ljMicpLCAvLyAg0L/Rg9GC0Ywg0Log0LrQvtC00YMgTGFtYmRhXHJcbiAgICAgICAgICBoYW5kbGVyOiAnbGFtYmRhX2Z1bmN0aW9uMi5oYW5kbGVyJywgLy8g0KTQsNC50Lsg0Lgg0L7QsdGA0LDQsdC+0YLRh9C40Log0LIgTGFtYmRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vINCd0LDRgdGC0YDQvtC50LrQsCBMYW1iZGEg0LTQu9GPINGA0LXQsNC60YbQuNC4INC90LAg0YHQvtCx0YvRgtC40Y8gT2JqZWN0Q3JlYXRlZCDQsiDQv9Cw0L/QutC1ICd1cGxvYWRlZCdcclxuICAgICAgICB4eHhpbXBvcnRzZXJ2aWNlYmFja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKFxyXG4gICAgICAgICAgICBzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURUQsXHJcbiAgICAgICAgICAgIG5ldyBzM24uTGFtYmRhRGVzdGluYXRpb24oaW1wb3J0RmlsZVBhcnNlciksXHJcbiAgICAgICAgICAgIHsgcHJlZml4OiAndXBsb2FkZWQvJyB9IC8vINCi0L7Qu9GM0LrQviDQtNC70Y8g0L7QsdGK0LXQutGC0L7QsiDQsiDQv9Cw0L/QutC1ICd1cGxvYWRlZCdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGA0LDQt9GA0LXRiNC10L3QuNC5INC00LvRjyBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0L3QsCDRh9GC0LXQvdC40LUg0Lgg0LfQsNC/0LjRgdGMINCyIFMzINCx0LDQutC10YJcclxuICAgICAgICB4eHhpbXBvcnRzZXJ2aWNlYmFja2V0LmdyYW50UmVhZFdyaXRlKGltcG9ydEZpbGVQYXJzZXIpO1xyXG5cclxuICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC90L7QstC+0Lkg0YDQvtC70Lgg0Lgg0L/QvtC70LjRgtC40LrQuCDQtNC70Y8gTGFtYmRhLCDRh9GC0L7QsdGLINC+0L3QsCDQvNC+0LPQu9CwINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC+0LLQsNGC0Ywg0YEgUzNcclxuICAgICAgICBjb25zdCBzM1BvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCddLFxyXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6eHh4aW1wb3J0c2VydmljZWJhY2tldC8qYCxcclxuXHJcbiAgICAgICAgICBdLCAgfSk7XHJcblxyXG4gICAgICAgIC8vYXNzaWduIHRoaXMgcG9saWN5IHRvIGxhbWJkYSBpbXBvcnRQcm9kdWN0c0ZpbGVMYW1iZGFcclxuICAgICAgICBpbXBvcnRQcm9kdWN0c0ZpbGVMYW1iZGEuYWRkVG9Sb2xlUG9saWN5KHMzUG9saWN5KVxyXG5cclxuICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1IEFQSSBHYXRld2F5INC00LvRjyBMYW1iZGFcclxuICAgICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdJbXBvcnRTZXJ2aWNlQXBpJywge1xyXG4gICAgICAgICAgcmVzdEFwaU5hbWU6ICdJbXBvcnRTZXJ2aWNlJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQVBJIGZvciBJbXBvcnQgU2VydmljZScsXHJcbiAgICAgICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXHJcbiAgICAgICAgICAgIGFsbG93TWV0aG9kczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9NRVRIT0RTLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0L3QvtCy0L7Qs9C+INGA0LXRgdGD0YDRgdCwINC4INC80LXRgtC+0LTQsCDQtNC70Y8g0LLRi9C30L7QstCwIExhbWJkYVxyXG4gICAgICAgIGNvbnN0IGltcG9ydFJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2ltcG9ydCcpO1xyXG4gICAgICAgIGNvbnN0IGltcG9ydEludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaW1wb3J0UHJvZHVjdHNGaWxlTGFtYmRhKTtcclxuICAgICAgICBpbXBvcnRSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIGltcG9ydEludGVncmF0aW9uLCB7XHJcbiAgICAgICAgICByZXF1ZXN0UGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAnbWV0aG9kLnJlcXVlc3QucXVlcnlzdHJpbmcubmFtZSc6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgICByZXNwb25zZU1vZGVsczoge1xyXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBhcGlnYXRld2F5Lk1vZGVsLkVNUFRZX01PREVMLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcclxubmV3IEltcG9ydFNlcnZpY2VTdGFjayhhcHAsICdJbXBvcnRTZXJ2aWNlU3RhY2syMjInLCB7ICAgLy8gINC90LDQt9Cy0LDQvdC40LUg0YHRgtC10LrQsCAg0YHQstC7INCy0YPQt9C00YnQvVxyXG4gICAgZW52OiB7IGFjY291bnQ6ICc3NjE1NzYzNDM2MjEnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sIC8vXHJcbn0pO1xyXG5hcHAuc3ludGgoKTtcclxuIl19