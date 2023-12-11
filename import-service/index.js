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
        const lunaxxximportservicebacket = aws_cdk_lib_2.aws_s3.Bucket.fromBucketAttributes(this, 'lunaxxximportservicebacket', { bucketArn: "arn:aws:s3:::lunaxxximportservicebacket" });
        // Определение Lambda функции1
        const importProductsFileLambda = new aws_cdk_lib_1.aws_lambda.Function(this, 'importProductsFileLambda', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./logic1_importProductsFile'), // здесь
            handler: 'lambda_function1.handler1',
            environment: {
                BUCKET: 'lunaxxximportservicebacket', //  имя  S3 бакета
            },
        });
        // Создание Lambda функции 2
        const importFileParser = new aws_cdk_lib_1.aws_lambda.Function(this, 'ImportFileParser', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./logic2_importFileParser'), //  путь к коду Lambda
            handler: 'lambda_function2.handler', // Файл и обработчик в Lambda
        });
        // Настройка Lambda для реакции на события ObjectCreated в папке 'uploaded'
        lunaxxximportservicebacket.addEventNotification(aws_cdk_lib_2.aws_s3.EventType.OBJECT_CREATED, new aws_cdk_lib_3.aws_s3_notifications.LambdaDestination(importFileParser), { prefix: 'uploaded/' } // Только для объектов в папке 'uploaded'
        );
        // Добавление разрешений для Lambda функции на чтение и запись в S3 бакет
        lunaxxximportservicebacket.grantReadWrite(importFileParser);
        // Создание новой роли и политики для Lambda, чтобы она могла взаимодействовать с S3
        const s3Policy = new aws_cdk_lib_5.aws_iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:PutObject'],
            resources: [
                `arn:aws:s3:::lunaxxximportservicebacket/*`,
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
        // Экспорт идентификатора REST API
        new cdk.CfnOutput(this, 'ApiGatewayRestApiId', {
            value: api.restApiId,
            exportName: 'ImportServiceApiId'
        });
    }
}
exports.ImportServiceStack = ImportServiceStack;
const app = new cdk.App();
new ImportServiceStack(app, 'importpart000LUNA2045', {
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBQ25DLDZDQUFtRDtBQUNuRCw2Q0FBMkM7QUFDM0MsNkNBQXdEO0FBQ3hELDZDQUEyRDtBQUMzRCw2Q0FBNkMsQ0FBQywwQkFBMEI7QUFHeEUsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEIsb0JBQW9CO1FBQ3BCLE1BQU0sMEJBQTBCLEdBQUcsb0JBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLDRCQUE0QixFQUFHLEVBQUUsU0FBUyxFQUFFLHlDQUF5QyxFQUFDLENBQUMsQ0FBQztRQUVoSyw4QkFBOEI7UUFDOUIsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUNyRixPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLEVBQUUsUUFBUTtZQUNwRSxPQUFPLEVBQUUsMkJBQTJCO1lBQ3BDLFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsNEJBQTRCLEVBQUUsa0JBQWtCO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUYsNEJBQTRCO1FBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx3QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsT0FBTyxFQUFFLHdCQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsSUFBSSxFQUFFLHdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLHNCQUFzQjtZQUNoRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsNkJBQTZCO1NBQ25FLENBQUMsQ0FBQztRQUVILDJFQUEyRTtRQUMzRSwwQkFBMEIsQ0FBQyxvQkFBb0IsQ0FDM0Msb0JBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUMzQixJQUFJLGtDQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsRUFDM0MsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMseUNBQXlDO1NBQ2hFLENBQUM7UUFFRix5RUFBeUU7UUFDN0UsMEJBQTBCLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFNUQsb0ZBQW9GO1FBQ3BGLE1BQU0sUUFBUSxHQUFHLElBQUkscUJBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdkMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQztZQUN6QyxTQUFTLEVBQUU7Z0JBQ1QsMkNBQTJDO2FBRTVDO1NBQUksQ0FBQyxDQUFDO1FBRVQsdURBQXVEO1FBQ3ZELHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUVsRCxrQ0FBa0M7UUFDbEMsTUFBTSxHQUFHLEdBQUcsSUFBSSw0QkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDM0QsV0FBVyxFQUFFLGVBQWU7WUFDNUIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQywyQkFBMkIsRUFBRTtnQkFDM0IsWUFBWSxFQUFFLDRCQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRSw0QkFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO2FBQzFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsdURBQXVEO1FBQ3ZELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELE1BQU0saUJBQWlCLEdBQUcsSUFBSSw0QkFBVSxDQUFDLGlCQUFpQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7WUFDakQsaUJBQWlCLEVBQUU7Z0JBQ2pCLGlDQUFpQyxFQUFFLElBQUk7YUFDeEM7WUFDRCxlQUFlLEVBQUU7Z0JBQ2Y7b0JBQ0UsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLGNBQWMsRUFBRTt3QkFDZCxrQkFBa0IsRUFBRSw0QkFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXO3FCQUNqRDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsa0NBQWtDO1FBQ2xDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDN0MsS0FBSyxFQUFFLEdBQUcsQ0FBQyxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxvQkFBb0I7U0FDakMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztDQUNKO0FBL0VELGdEQStFQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksa0JBQWtCLENBQUMsR0FBRyxFQUFFLHVCQUF1QixFQUFFO0lBQ2pELEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUU7Q0FDNUQsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBhd3NfbGFtYmRhIGFzIGxhbWJkYSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX3MzIGFzIHMzIH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQge2F3c19zM19ub3RpZmljYXRpb25zIGFzIHMzbn0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBhd3NfYXBpZ2F0ZXdheSBhcyBhcGlnYXRld2F5IH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBhd3NfaWFtIGFzIGlhbSB9IGZyb20gJ2F3cy1jZGstbGliJzsgLy8g0JTQvtCx0LDQstC70LXQvSDQuNC80L/QvtGA0YIg0LTQu9GPIElBTVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJbXBvcnRTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAgICAgLy9pbXBvcnQgZXhpc3RpbmcgczNcclxuICAgICAgICBjb25zdCBsdW5heHh4aW1wb3J0c2VydmljZWJhY2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyh0aGlzLCAnbHVuYXh4eGltcG9ydHNlcnZpY2ViYWNrZXQnLCAgeyBidWNrZXRBcm46IFwiYXJuOmF3czpzMzo6Omx1bmF4eHhpbXBvcnRzZXJ2aWNlYmFja2V0XCJ9KTtcclxuXHJcbiAgICAgICAgLy8g0J7Qv9GA0LXQtNC10LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40LgxXHJcbiAgICAgICAgY29uc3QgaW1wb3J0UHJvZHVjdHNGaWxlTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnaW1wb3J0UHJvZHVjdHNGaWxlTGFtYmRhJywge1xyXG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9sb2dpYzFfaW1wb3J0UHJvZHVjdHNGaWxlJyksIC8vINC30LTQtdGB0YxcclxuICAgICAgICAgIGhhbmRsZXI6ICdsYW1iZGFfZnVuY3Rpb24xLmhhbmRsZXIxJyxcclxuICAgICAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgICAgIEJVQ0tFVDogJ2x1bmF4eHhpbXBvcnRzZXJ2aWNlYmFja2V0JywgLy8gINC40LzRjyAgUzMg0LHQsNC60LXRgtCwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40LggMlxyXG4gICAgICAgIGNvbnN0IGltcG9ydEZpbGVQYXJzZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdJbXBvcnRGaWxlUGFyc2VyJywge1xyXG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9sb2dpYzJfaW1wb3J0RmlsZVBhcnNlcicpLCAvLyAg0L/Rg9GC0Ywg0Log0LrQvtC00YMgTGFtYmRhXHJcbiAgICAgICAgICBoYW5kbGVyOiAnbGFtYmRhX2Z1bmN0aW9uMi5oYW5kbGVyJywgLy8g0KTQsNC50Lsg0Lgg0L7QsdGA0LDQsdC+0YLRh9C40Log0LIgTGFtYmRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vINCd0LDRgdGC0YDQvtC50LrQsCBMYW1iZGEg0LTQu9GPINGA0LXQsNC60YbQuNC4INC90LAg0YHQvtCx0YvRgtC40Y8gT2JqZWN0Q3JlYXRlZCDQsiDQv9Cw0L/QutC1ICd1cGxvYWRlZCdcclxuICAgICAgICBsdW5heHh4aW1wb3J0c2VydmljZWJhY2tldC5hZGRFdmVudE5vdGlmaWNhdGlvbihcclxuICAgICAgICAgICAgczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVELFxyXG4gICAgICAgICAgICBuZXcgczNuLkxhbWJkYURlc3RpbmF0aW9uKGltcG9ydEZpbGVQYXJzZXIpLFxyXG4gICAgICAgICAgICB7IHByZWZpeDogJ3VwbG9hZGVkLycgfSAvLyDQotC+0LvRjNC60L4g0LTQu9GPINC+0LHRitC10LrRgtC+0LIg0LIg0L/QsNC/0LrQtSAndXBsb2FkZWQnXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDRgNCw0LfRgNC10YjQtdC90LjQuSDQtNC70Y8gTGFtYmRhINGE0YPQvdC60YbQuNC4INC90LAg0YfRgtC10L3QuNC1INC4INC30LDQv9C40YHRjCDQsiBTMyDQsdCw0LrQtdGCXHJcbiAgICAgICAgbHVuYXh4eGltcG9ydHNlcnZpY2ViYWNrZXQuZ3JhbnRSZWFkV3JpdGUoaW1wb3J0RmlsZVBhcnNlcik7XHJcblxyXG4gICAgICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L3QvtCy0L7QuSDRgNC+0LvQuCDQuCDQv9C+0LvQuNGC0LjQutC4INC00LvRjyBMYW1iZGEsINGH0YLQvtCx0Ysg0L7QvdCwINC80L7Qs9C70LAg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0L7QstCw0YLRjCDRgSBTM1xyXG4gICAgICAgIGNvbnN0IHMzUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0J10sXHJcbiAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgYGFybjphd3M6czM6OjpsdW5heHh4aW1wb3J0c2VydmljZWJhY2tldC8qYCxcclxuXHJcbiAgICAgICAgICBdLCAgfSk7XHJcblxyXG4gICAgICAgIC8vYXNzaWduIHRoaXMgcG9saWN5IHRvIGxhbWJkYSBpbXBvcnRQcm9kdWN0c0ZpbGVMYW1iZGFcclxuICAgICAgICBpbXBvcnRQcm9kdWN0c0ZpbGVMYW1iZGEuYWRkVG9Sb2xlUG9saWN5KHMzUG9saWN5KVxyXG5cclxuICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1IEFQSSBHYXRld2F5INC00LvRjyBMYW1iZGFcclxuICAgICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdJbXBvcnRTZXJ2aWNlQXBpJywge1xyXG4gICAgICAgICAgcmVzdEFwaU5hbWU6ICdJbXBvcnRTZXJ2aWNlJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQVBJIGZvciBJbXBvcnQgU2VydmljZScsXHJcbiAgICAgICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXHJcbiAgICAgICAgICAgIGFsbG93TWV0aG9kczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9NRVRIT0RTLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0L3QvtCy0L7Qs9C+INGA0LXRgdGD0YDRgdCwINC4INC80LXRgtC+0LTQsCDQtNC70Y8g0LLRi9C30L7QstCwIExhbWJkYVxyXG4gICAgICAgIGNvbnN0IGltcG9ydFJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2ltcG9ydCcpO1xyXG4gICAgICAgIGNvbnN0IGltcG9ydEludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaW1wb3J0UHJvZHVjdHNGaWxlTGFtYmRhKTtcclxuICAgICAgICBpbXBvcnRSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIGltcG9ydEludGVncmF0aW9uLCB7XHJcbiAgICAgICAgICByZXF1ZXN0UGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAnbWV0aG9kLnJlcXVlc3QucXVlcnlzdHJpbmcubmFtZSc6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgICByZXNwb25zZU1vZGVsczoge1xyXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBhcGlnYXRld2F5Lk1vZGVsLkVNUFRZX01PREVMLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDQrdC60YHQv9C+0YDRgiDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgNCwIFJFU1QgQVBJXHJcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0FwaUdhdGV3YXlSZXN0QXBpSWQnLCB7XHJcbiAgICAgICAgICB2YWx1ZTogYXBpLnJlc3RBcGlJZCxcclxuICAgICAgICAgIGV4cG9ydE5hbWU6ICdJbXBvcnRTZXJ2aWNlQXBpSWQnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5uZXcgSW1wb3J0U2VydmljZVN0YWNrKGFwcCwgJ2ltcG9ydHBhcnQwMDBMVU5BMjA0NScsIHsgICAvLyAg0L3QsNC30LLQsNC90LjQtSDRgdGC0LXQutCwICDRgdCy0Lsg0LLRg9C30LTRidC9XHJcbiAgICBlbnY6IHsgYWNjb3VudDogJzc2MTU3NjM0MzYyMScsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSwgLy9cclxufSk7XHJcbmFwcC5zeW50aCgpO1xyXG4iXX0=