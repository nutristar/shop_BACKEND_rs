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
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./logic1'),
            handler: 'lambda_function1.handler1',
            environment: {
                BUCKET: 'lunaxxximportservicebacket', //  имя  S3 бакета
            },
        });
        // Создание Lambda функции 2
        const importFileParser = new aws_cdk_lib_1.aws_lambda.Function(this, 'ImportFileParser', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./logic2'),
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
    }
}
exports.ImportServiceStack = ImportServiceStack;
const app = new cdk.App();
new ImportServiceStack(app, 'importpart000LUNA2045', {
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBQ25DLDZDQUFtRDtBQUNuRCw2Q0FBMkM7QUFDM0MsNkNBQXdEO0FBQ3hELDZDQUEyRDtBQUMzRCw2Q0FBNkMsQ0FBQywwQkFBMEI7QUFHeEUsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEIsb0JBQW9CO1FBQ3BCLE1BQU0sMEJBQTBCLEdBQUcsb0JBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLDRCQUE0QixFQUFHLEVBQUUsU0FBUyxFQUFFLHlDQUF5QyxFQUFDLENBQUMsQ0FBQztRQUVoSyw4QkFBOEI7UUFDOUIsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUNyRixPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN2QyxPQUFPLEVBQUUsMkJBQTJCO1lBQ3BDLFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsNEJBQTRCLEVBQUUsa0JBQWtCO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUYsNEJBQTRCO1FBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx3QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsT0FBTyxFQUFFLHdCQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsSUFBSSxFQUFFLHdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDdkMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLDZCQUE2QjtTQUNuRSxDQUFDLENBQUM7UUFFSCwyRUFBMkU7UUFDM0UsMEJBQTBCLENBQUMsb0JBQW9CLENBQzNDLG9CQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFDM0IsSUFBSSxrQ0FBRyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEVBQzNDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLHlDQUF5QztTQUNoRSxDQUFDO1FBRUYseUVBQXlFO1FBQzdFLDBCQUEwQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTVELG9GQUFvRjtRQUNwRixNQUFNLFFBQVEsR0FBRyxJQUFJLHFCQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7WUFDekMsU0FBUyxFQUFFO2dCQUNULDJDQUEyQzthQUU1QztTQUFJLENBQUMsQ0FBQztRQUVULHVEQUF1RDtRQUN2RCx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFbEQsa0NBQWtDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksNEJBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzNELFdBQVcsRUFBRSxlQUFlO1lBQzVCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRSw0QkFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUN6QyxZQUFZLEVBQUUsNEJBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVzthQUMxQztTQUNGLENBQUMsQ0FBQztRQUVILHVEQUF1RDtRQUN2RCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxNQUFNLGlCQUFpQixHQUFHLElBQUksNEJBQVUsQ0FBQyxpQkFBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JGLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQ2pELGlCQUFpQixFQUFFO2dCQUNqQixpQ0FBaUMsRUFBRSxJQUFJO2FBQ3hDO1lBQ0QsZUFBZSxFQUFFO2dCQUNmO29CQUNFLFVBQVUsRUFBRSxLQUFLO29CQUNqQixjQUFjLEVBQUU7d0JBQ2Qsa0JBQWtCLEVBQUUsNEJBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVztxQkFDakQ7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUVQLENBQUM7Q0FDSjtBQXpFRCxnREF5RUM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLGtCQUFrQixDQUFDLEdBQUcsRUFBRSx1QkFBdUIsRUFBRTtJQUNqRCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO0NBQzVELENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2xhbWJkYSBhcyBsYW1iZGEgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IGF3c19zMyBhcyBzMyB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHthd3NfczNfbm90aWZpY2F0aW9ucyBhcyBzM259IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2FwaWdhdGV3YXkgYXMgYXBpZ2F0ZXdheSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2lhbSBhcyBpYW0gfSBmcm9tICdhd3MtY2RrLWxpYic7IC8vINCU0L7QsdCw0LLQu9C10L0g0LjQvNC/0L7RgNGCINC00LvRjyBJQU1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSW1wb3J0U2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vaW1wb3J0IGV4aXN0aW5nIHMzXHJcbiAgICAgICAgY29uc3QgbHVuYXh4eGltcG9ydHNlcnZpY2ViYWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXModGhpcywgJ2x1bmF4eHhpbXBvcnRzZXJ2aWNlYmFja2V0JywgIHsgYnVja2V0QXJuOiBcImFybjphd3M6czM6OjpsdW5heHh4aW1wb3J0c2VydmljZWJhY2tldFwifSk7XHJcblxyXG4gICAgICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4MVxyXG4gICAgICAgIGNvbnN0IGltcG9ydFByb2R1Y3RzRmlsZUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2ltcG9ydFByb2R1Y3RzRmlsZUxhbWJkYScsIHtcclxuICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vbG9naWMxJyksIC8vINC30LTQtdGB0YxcclxuICAgICAgICAgIGhhbmRsZXI6ICdsYW1iZGFfZnVuY3Rpb24xLmhhbmRsZXIxJyxcclxuICAgICAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgICAgIEJVQ0tFVDogJ2x1bmF4eHhpbXBvcnRzZXJ2aWNlYmFja2V0JywgLy8gINC40LzRjyAgUzMg0LHQsNC60LXRgtCwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40LggMlxyXG4gICAgICAgIGNvbnN0IGltcG9ydEZpbGVQYXJzZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdJbXBvcnRGaWxlUGFyc2VyJywge1xyXG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9sb2dpYzInKSwgLy8gINC/0YPRgtGMINC6INC60L7QtNGDIExhbWJkYVxyXG4gICAgICAgICAgaGFuZGxlcjogJ2xhbWJkYV9mdW5jdGlvbjIuaGFuZGxlcicsIC8vINCk0LDQudC7INC4INC+0LHRgNCw0LHQvtGC0YfQuNC6INCyIExhbWJkYVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDQndCw0YHRgtGA0L7QudC60LAgTGFtYmRhINC00LvRjyDRgNC10LDQutGG0LjQuCDQvdCwINGB0L7QsdGL0YLQuNGPIE9iamVjdENyZWF0ZWQg0LIg0L/QsNC/0LrQtSAndXBsb2FkZWQnXHJcbiAgICAgICAgbHVuYXh4eGltcG9ydHNlcnZpY2ViYWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oXHJcbiAgICAgICAgICAgIHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCxcclxuICAgICAgICAgICAgbmV3IHMzbi5MYW1iZGFEZXN0aW5hdGlvbihpbXBvcnRGaWxlUGFyc2VyKSxcclxuICAgICAgICAgICAgeyBwcmVmaXg6ICd1cGxvYWRlZC8nIH0gLy8g0KLQvtC70YzQutC+INC00LvRjyDQvtCx0YrQtdC60YLQvtCyINCyINC/0LDQv9C60LUgJ3VwbG9hZGVkJ1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YDQsNC30YDQtdGI0LXQvdC40Lkg0LTQu9GPIExhbWJkYSDRhNGD0L3QutGG0LjQuCDQvdCwINGH0YLQtdC90LjQtSDQuCDQt9Cw0L/QuNGB0Ywg0LIgUzMg0LHQsNC60LXRglxyXG4gICAgICAgIGx1bmF4eHhpbXBvcnRzZXJ2aWNlYmFja2V0LmdyYW50UmVhZFdyaXRlKGltcG9ydEZpbGVQYXJzZXIpO1xyXG5cclxuICAgICAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC90L7QstC+0Lkg0YDQvtC70Lgg0Lgg0L/QvtC70LjRgtC40LrQuCDQtNC70Y8gTGFtYmRhLCDRh9GC0L7QsdGLINC+0L3QsCDQvNC+0LPQu9CwINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC+0LLQsNGC0Ywg0YEgUzNcclxuICAgICAgICBjb25zdCBzM1BvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCddLFxyXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6bHVuYXh4eGltcG9ydHNlcnZpY2ViYWNrZXQvKmAsXHJcblxyXG4gICAgICAgICAgXSwgIH0pO1xyXG5cclxuICAgICAgICAvL2Fzc2lnbiB0aGlzIHBvbGljeSB0byBsYW1iZGEgaW1wb3J0UHJvZHVjdHNGaWxlTGFtYmRhXHJcbiAgICAgICAgaW1wb3J0UHJvZHVjdHNGaWxlTGFtYmRhLmFkZFRvUm9sZVBvbGljeShzM1BvbGljeSlcclxuXHJcbiAgICAgICAgLy8g0KHQvtC30LTQsNC90LjQtSBBUEkgR2F0ZXdheSDQtNC70Y8gTGFtYmRhXHJcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnSW1wb3J0U2VydmljZUFwaScsIHtcclxuICAgICAgICAgIHJlc3RBcGlOYW1lOiAnSW1wb3J0U2VydmljZScsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FQSSBmb3IgSW1wb3J0IFNlcnZpY2UnLFxyXG4gICAgICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGFsbG93T3JpZ2luczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TLFxyXG4gICAgICAgICAgICBhbGxvd01ldGhvZHM6IGFwaWdhdGV3YXkuQ29ycy5BTExfTUVUSE9EUyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC90L7QstC+0LPQviDRgNC10YHRg9GA0YHQsCDQuCDQvNC10YLQvtC00LAg0LTQu9GPINCy0YvQt9C+0LLQsCBMYW1iZGFcclxuICAgICAgICBjb25zdCBpbXBvcnRSZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdpbXBvcnQnKTtcclxuICAgICAgICBjb25zdCBpbXBvcnRJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGltcG9ydFByb2R1Y3RzRmlsZUxhbWJkYSk7XHJcbiAgICAgICAgaW1wb3J0UmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBpbXBvcnRJbnRlZ3JhdGlvbiwge1xyXG4gICAgICAgICAgcmVxdWVzdFBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgJ21ldGhvZC5yZXF1ZXN0LnF1ZXJ5c3RyaW5nLm5hbWUnOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1ldGhvZFJlc3BvbnNlczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VNb2RlbHM6IHtcclxuICAgICAgICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogYXBpZ2F0ZXdheS5Nb2RlbC5FTVBUWV9NT0RFTCxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcbm5ldyBJbXBvcnRTZXJ2aWNlU3RhY2soYXBwLCAnaW1wb3J0cGFydDAwMExVTkEyMDQ1JywgeyAgIC8vICDQvdCw0LfQstCw0L3QuNC1INGB0YLQtdC60LAgINGB0LLQuyDQstGD0LfQtNGJ0L1cclxuICAgIGVudjogeyBhY2NvdW50OiAnNzYxNTc2MzQzNjIxJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LCAvL1xyXG59KTtcclxuYXBwLnN5bnRoKCk7XHJcbiJdfQ==