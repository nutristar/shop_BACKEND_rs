#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaApiGatewayStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cdk_lib_2 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const sqs = require("aws-cdk-lib/aws-sqs");
const lambdaEventSources = require("aws-cdk-lib/aws-lambda-event-sources");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const aws_sns_subscriptions_1 = require("aws-cdk-lib/aws-sns-subscriptions");
class LambdaApiGatewayStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Импортируем существующие таблицы по ARN
        const productsTable = aws_cdk_lib_2.aws_dynamodb.Table.fromTableArn(this, 'ImportedProductsTable', "arn:aws:dynamodb:us-east-1:761576343621:table/products");
        const stocksTable = aws_cdk_lib_2.aws_dynamodb.Table.fromTableArn(this, 'ImportedStocksTable', "arn:aws:dynamodb:us-east-1:761576343621:table/stocks");
        ///////////////////////////////////////////////////////
        // Определение Lambda функции1
        const getProductsListLambda = new lambda.Function(this, 'GetProductsListFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('./BE_logic'),
            handler: 'lambda_function.getProductsList',
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName,
                STOCKS_TABLE_NAME: stocksTable.tableName,
            }
        });
        // Определение Lambda функции для получения продукта по ID
        const getProductsByIdLambda = new lambda.Function(this, 'GetProductsByIdFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('./BE_logic2'),
            handler: 'get_product_by_id.getProductsById',
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName,
                STOCKS_TABLE_NAME: stocksTable.tableName,
            }
        });
        // Lambda function for creating new products   3
        const createProductLambda = new lambda.Function(this, 'CreateProductFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('./BE_logic3'),
            handler: 'create_product.create',
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName
            }
        });
        // Предоставление Lambda функции прав на запись в таблицу Products
        productsTable.grantWriteData(createProductLambda); //3
        // Предоставление Lambda функции прав на запись в таблицу stocks
        stocksTable.grantReadWriteData(createProductLambda);
        productsTable.grantReadWriteData(getProductsListLambda);
        stocksTable.grantReadWriteData(getProductsListLambda);
        productsTable.grantReadWriteData(getProductsByIdLambda);
        stocksTable.grantReadWriteData(getProductsByIdLambda);
        // Определение API Gateway
        const api = new aws_cdk_lib_1.aws_apigateway.RestApi(this, 'ProductsApi', {
            restApiName: 'Products Service',
            deployOptions: {
                stageName: 'dev',
            },
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: ['OPTIONS', 'GET', 'POST'],
                allowCredentials: true,
                allowOrigins: aws_cdk_lib_1.aws_apigateway.Cors.ALL_ORIGINS
            },
        });
        // Создание ресурса /products для API Gateway
        const productsResource = api.root.addResource('products');
        // Создание ресурса /products/{productId} для API Gateway
        const productByIdResource = productsResource.addResource('{productId}');
        // Создание метода GET, который триггерит Lambda функцию для получения продукта по ID
        productByIdResource.addMethod('GET', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(getProductsByIdLambda));
        // Создание метода GET, который триггерит Lambda функцию
        productsResource.addMethod('GET', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(getProductsListLambda));
        // Создание метода POST для ресурса /products, который триггерит созданную Lambda функцию
        productsResource.addMethod('POST', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(createProductLambda));
        ////////////////TASK 6 TASK 6 TASK 6////////////////////////////////////////////////////////////////////////////
        // Создаем очередь SQS
        const catalogItemsQueue = new sqs.Queue(this, 'catalogItemsQueue', {
            queueName: 'catalogItemsQueue'
        });
        // Создаем функцию Lambda
        const catalogBatchProcess = new lambda.Function(this, 'catalogBatchProcess', {
            functionName: 'catalogBatchProcess',
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('./BE_logic6'),
            handler: 'lambda_function6.lambda_handler' // предполагается, что ваш обработчик находится в index.js и называется handler
        });
        // Предоставление Lambda функции прав на запись в таблицу Products
        productsTable.grantWriteData(catalogBatchProcess); //3
        // Предоставление Lambda функции прав на запись в таблицу stocks
        stocksTable.grantReadWriteData(catalogBatchProcess);
        // Настройка триггера Lambda на события из SQS
        catalogBatchProcess.addEventSource(new lambdaEventSources.SqsEventSource(catalogItemsQueue, {
            batchSize: 5 // Количество сообщений, обрабатываемых за один раз
        }));
        ///////TASK 6.3 //////////////TASK 6.3 ///////////////  TASK 6.3
        // Создание SNS темы
        const createProductTopic = new aws_sns_1.Topic(this, 'createProductTopic', {
            topicName: 'create-product-topic',
        });
        // Добавление подписки с электронной почтой без фильтра
        createProductTopic.addSubscription(new aws_sns_subscriptions_1.EmailSubscription('deniszmail@gmail.com'));
        // Создание политики фильтрации для подписки
        const filterPolicy = {
            description: aws_sns_1.SubscriptionFilter.stringFilter({
                allowlist: ['BYCIKLE']
            })
        };
        // Добавление подписки с электронной почтой с фильтром
        createProductTopic.addSubscription(new aws_sns_subscriptions_1.EmailSubscription('korolyovakristina96@gmail.com', {
            filterPolicy
        }));
        //     // Добавление подписки с электронной почтой
        //     const emailSubscription = new EmailSubscription('deniszmail@gmail.com');
        //     createProductTopic.addSubscription(emailSubscription);
        //
        //     const filterPolicy = {
        //       description: sns.SubscriptionFilter.stringFilter({
        //         whitelist: ['BYCIKLE']
        //       })
        //     };
        //
        //     createProductTopic.addSubscription(new EmailSubscription('korolyovakristina96@gmail.com', {
        //       filterPolicy: filterPolicy
        //     }));
        // korolyovakristina96@gmail.com
        new cdk.CfnOutput(this, 'ApiUrl', {
            value: api.url,
        });
    }
}
exports.LambdaApiGatewayStack = LambdaApiGatewayStack;
const app = new cdk.App();
new LambdaApiGatewayStack(app, 'LUNA2045', {
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBRW5DLDZDQUEyRDtBQUMzRCw2Q0FBdUQ7QUFHdkQsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQywyRUFBMkU7QUFFM0UsaURBQWtFO0FBQ2xFLDZFQUFzRTtBQUt0RSxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2xELFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QiwwQ0FBMEM7UUFDMUMsTUFBTSxhQUFhLEdBQUcsMEJBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSx3REFBd0QsQ0FBQyxDQUFDO1FBRTNJLE1BQU0sV0FBVyxHQUFHLDBCQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsc0RBQXNELENBQUMsQ0FBQztRQUlySSx1REFBdUQ7UUFJdkQsOEJBQThCO1FBQzlCLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNqRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7WUFDekMsT0FBTyxFQUFFLGlDQUFpQztZQUMxQyxXQUFXLEVBQUU7Z0JBQ1gsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLFNBQVM7Z0JBQzVDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxTQUFTO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsMERBQTBEO1FBQzFELE1BQU0scUJBQXFCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNqRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDMUMsT0FBTyxFQUFFLG1DQUFtQztZQUM1QyxXQUFXLEVBQUU7Z0JBQ1gsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLFNBQVM7Z0JBQzVDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxTQUFTO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsZ0RBQWdEO1FBQ2hELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUM3RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDMUMsT0FBTyxFQUFFLHVCQUF1QjtZQUNoQyxXQUFXLEVBQUU7Z0JBQ1gsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLFNBQVM7YUFDN0M7U0FDRixDQUFDLENBQUM7UUFFSCxrRUFBa0U7UUFDbEUsYUFBYSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUUsR0FBRztRQUN2RCxnRUFBZ0U7UUFDaEUsV0FBVyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFFbkQsYUFBYSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDeEQsV0FBVyxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFdEQsYUFBYSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDeEQsV0FBVyxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFJdEQsMEJBQTBCO1FBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksNEJBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN0RCxXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsS0FBSzthQUNqQjtZQUVELDJCQUEyQixFQUFFO2dCQUMzQixZQUFZLEVBQUU7b0JBQ1osY0FBYztvQkFDZCxZQUFZO29CQUNaLGVBQWU7b0JBQ2YsV0FBVztpQkFDWjtnQkFDRCxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztnQkFDeEMsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsWUFBWSxFQUFFLDRCQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7YUFDMUM7U0FDRixDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxRCx5REFBeUQ7UUFDekQsTUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFHeEUscUZBQXFGO1FBQ3JGLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSw0QkFBVSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUc5Rix3REFBd0Q7UUFDeEQsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBRTNGLHlGQUF5RjtRQUN6RixnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksNEJBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFFOUYsZ0hBQWdIO1FBQzNHLHNCQUFzQjtRQUN2QixNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDakUsU0FBUyxFQUFFLG1CQUFtQjtTQUMvQixDQUFDLENBQUM7UUFDRix5QkFBeUI7UUFDMUIsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzNFLFlBQVksRUFBRSxxQkFBcUI7WUFDbkMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1lBQzFDLE9BQU8sRUFBRSxpQ0FBaUMsQ0FBQywrRUFBK0U7U0FDM0gsQ0FBQyxDQUFDO1FBQ0Esa0VBQWtFO1FBQ3JFLGFBQWEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFFLEdBQUc7UUFDdkQsZ0VBQWdFO1FBQ2hFLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBRW5ELDhDQUE4QztRQUM5QyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUU7WUFDMUYsU0FBUyxFQUFFLENBQUMsQ0FBQyxtREFBbUQ7U0FDakUsQ0FBQyxDQUFDLENBQUM7UUFFSixnRUFBZ0U7UUFDL0Qsb0JBQW9CO1FBQ3JCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQy9ELFNBQVMsRUFBRSxzQkFBc0I7U0FDbEMsQ0FBQyxDQUFDO1FBRUMsdURBQXVEO1FBQzNELGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLHlDQUFpQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztRQUVsRiw0Q0FBNEM7UUFDNUMsTUFBTSxZQUFZLEdBQUc7WUFDbkIsV0FBVyxFQUFFLDRCQUFrQixDQUFDLFlBQVksQ0FBQztnQkFDM0MsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO2FBQ3ZCLENBQUM7U0FDSCxDQUFDO1FBRUYsc0RBQXNEO1FBQ3RELGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLHlDQUFpQixDQUFDLCtCQUErQixFQUFFO1lBQ3hGLFlBQVk7U0FDYixDQUFDLENBQUMsQ0FBQztRQUdSLGtEQUFrRDtRQUNsRCwrRUFBK0U7UUFDL0UsNkRBQTZEO1FBQzdELEVBQUU7UUFDRiw2QkFBNkI7UUFDN0IsMkRBQTJEO1FBQzNELGlDQUFpQztRQUNqQyxXQUFXO1FBQ1gsU0FBUztRQUNULEVBQUU7UUFDRixrR0FBa0c7UUFDbEcsbUNBQW1DO1FBQ25DLFdBQVc7UUFHWCxnQ0FBZ0M7UUFFNUIsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDaEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1NBQ2YsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBbEtELHNEQWtLQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUkscUJBQXFCLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUN2QyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO0NBQzVELENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuXHJcbmltcG9ydCB7IGF3c19hcGlnYXRld2F5IGFzIGFwaWdhdGV3YXkgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IGF3c19keW5hbW9kYiBhcyBkeW5hbW9kYiB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcclxuaW1wb3J0ICogYXMgbGFtYmRhRXZlbnRTb3VyY2VzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XHJcblxyXG5pbXBvcnQgeyBUb3BpYywgIFN1YnNjcmlwdGlvbkZpbHRlciAgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcclxuaW1wb3J0IHsgRW1haWxTdWJzY3JpcHRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExhbWJkYUFwaUdhdGV3YXlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8vINCY0LzQv9C+0YDRgtC40YDRg9C10Lwg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNC1INGC0LDQsdC70LjRhtGLINC/0L4gQVJOXHJcbiAgICBjb25zdCBwcm9kdWN0c1RhYmxlID0gZHluYW1vZGIuVGFibGUuZnJvbVRhYmxlQXJuKHRoaXMsICdJbXBvcnRlZFByb2R1Y3RzVGFibGUnLCBcImFybjphd3M6ZHluYW1vZGI6dXMtZWFzdC0xOjc2MTU3NjM0MzYyMTp0YWJsZS9wcm9kdWN0c1wiKTtcclxuXHJcbiAgICBjb25zdCBzdG9ja3NUYWJsZSA9IGR5bmFtb2RiLlRhYmxlLmZyb21UYWJsZUFybih0aGlzLCAnSW1wb3J0ZWRTdG9ja3NUYWJsZScsIFwiYXJuOmF3czpkeW5hbW9kYjp1cy1lYXN0LTE6NzYxNTc2MzQzNjIxOnRhYmxlL3N0b2Nrc1wiKTtcclxuXHJcblxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4MVxyXG4gICAgY29uc3QgZ2V0UHJvZHVjdHNMaXN0TGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnR2V0UHJvZHVjdHNMaXN0RnVuY3Rpb24nLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9CRV9sb2dpYycpLCAvLyDQt9C00LXRgdGMIFxyXG4gICAgICBoYW5kbGVyOiAnbGFtYmRhX2Z1bmN0aW9uLmdldFByb2R1Y3RzTGlzdCcsXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgUFJPRFVDVFNfVEFCTEVfTkFNRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgICAgU1RPQ0tTX1RBQkxFX05BTUU6IHN0b2Nrc1RhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J7Qv9GA0LXQtNC10LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0LTQu9GPINC/0L7Qu9GD0YfQtdC90LjRjyDQv9GA0L7QtNGD0LrRgtCwINC/0L4gSURcclxuICAgIGNvbnN0IGdldFByb2R1Y3RzQnlJZExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0dldFByb2R1Y3RzQnlJZEZ1bmN0aW9uJywge1xyXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxyXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vQkVfbG9naWMyJyksIC8vINCf0YPRgtGMINC6INC60L7QtNGDIExhbWJkYVxyXG4gICAgICBoYW5kbGVyOiAnZ2V0X3Byb2R1Y3RfYnlfaWQuZ2V0UHJvZHVjdHNCeUlkJywgLy8g0YTQsNC50LsgZ2V0X3Byb2R1Y3RfYnlfaWQucHkg0Lgg0YTRg9C90LrRhtC40Y8gaGFuZGxlciDQsiDQvdC10LxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBQUk9EVUNUU19UQUJMRV9OQU1FOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgICBTVE9DS1NfVEFCTEVfTkFNRTogc3RvY2tzVGFibGUudGFibGVOYW1lLFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIExhbWJkYSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgbmV3IHByb2R1Y3RzICAgM1xyXG4gICAgY29uc3QgY3JlYXRlUHJvZHVjdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZVByb2R1Y3RGdW5jdGlvbicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL0JFX2xvZ2ljMycpLCAvLyDQn9GD0YLRjCDQuiDQutC+0LTRgyBMYW1iZGFcclxuICAgICAgaGFuZGxlcjogJ2NyZWF0ZV9wcm9kdWN0LmNyZWF0ZScsXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgUFJPRFVDVFNfVEFCTEVfTkFNRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWVcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J/RgNC10LTQvtGB0YLQsNCy0LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0L/RgNCw0LIg0L3QsCDQt9Cw0L/QuNGB0Ywg0LIg0YLQsNCx0LvQuNGG0YMgUHJvZHVjdHNcclxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRXcml0ZURhdGEoY3JlYXRlUHJvZHVjdExhbWJkYSk7ICAvLzNcclxuICAgIC8vINCf0YDQtdC00L7RgdGC0LDQstC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4INC/0YDQsNCyINC90LAg0LfQsNC/0LjRgdGMINCyINGC0LDQsdC70LjRhtGDIHN0b2Nrc1xyXG4gICAgc3RvY2tzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGNyZWF0ZVByb2R1Y3RMYW1iZGEpXHJcblxyXG4gICAgcHJvZHVjdHNUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ2V0UHJvZHVjdHNMaXN0TGFtYmRhKTtcclxuICAgIHN0b2Nrc1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShnZXRQcm9kdWN0c0xpc3RMYW1iZGEpO1xyXG5cclxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGdldFByb2R1Y3RzQnlJZExhbWJkYSk7XHJcbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ2V0UHJvZHVjdHNCeUlkTGFtYmRhKTtcclxuXHJcblxyXG5cclxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgQVBJIEdhdGV3YXlcclxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ1Byb2R1Y3RzQXBpJywge1xyXG4gICAgICByZXN0QXBpTmFtZTogJ1Byb2R1Y3RzIFNlcnZpY2UnLFxyXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XHJcbiAgICAgICAgc3RhZ2VOYW1lOiAnZGV2JyxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xyXG4gICAgICAgIGFsbG93SGVhZGVyczogW1xyXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZScsXHJcbiAgICAgICAgICAnWC1BbXotRGF0ZScsXHJcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbicsXHJcbiAgICAgICAgICAnWC1BcGktS2V5JyxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGFsbG93TWV0aG9kczogWydPUFRJT05TJywgJ0dFVCcsICdQT1NUJ10sXHJcbiAgICAgICAgYWxsb3dDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOU1xyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRgNC10YHRg9GA0YHQsCAvcHJvZHVjdHMg0LTQu9GPIEFQSSBHYXRld2F5XHJcbiAgICBjb25zdCBwcm9kdWN0c1Jlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Byb2R1Y3RzJyk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRgNC10YHRg9GA0YHQsCAvcHJvZHVjdHMve3Byb2R1Y3RJZH0g0LTQu9GPIEFQSSBHYXRld2F5XHJcbiAgICBjb25zdCBwcm9kdWN0QnlJZFJlc291cmNlID0gcHJvZHVjdHNSZXNvdXJjZS5hZGRSZXNvdXJjZSgne3Byb2R1Y3RJZH0nKTtcclxuXHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQvNC10YLQvtC00LAgR0VULCDQutC+0YLQvtGA0YvQuSDRgtGA0LjQs9Cz0LXRgNC40YIgTGFtYmRhINGE0YPQvdC60YbQuNGOINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0L/RgNC+0LTRg9C60YLQsCDQv9C+IElEXHJcbiAgICBwcm9kdWN0QnlJZFJlc291cmNlLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZ2V0UHJvZHVjdHNCeUlkTGFtYmRhKSk7XHJcblxyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LzQtdGC0L7QtNCwIEdFVCwg0LrQvtGC0L7RgNGL0Lkg0YLRgNC40LPQs9C10YDQuNGCIExhbWJkYSDRhNGD0L3QutGG0LjRjlxyXG4gICAgcHJvZHVjdHNSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldFByb2R1Y3RzTGlzdExhbWJkYSkpO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LzQtdGC0L7QtNCwIFBPU1Qg0LTQu9GPINGA0LXRgdGD0YDRgdCwIC9wcm9kdWN0cywg0LrQvtGC0L7RgNGL0Lkg0YLRgNC40LPQs9C10YDQuNGCINGB0L7Qt9C00LDQvdC90YPRjiBMYW1iZGEg0YTRg9C90LrRhtC40Y5cclxuICAgIHByb2R1Y3RzUmVzb3VyY2UuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oY3JlYXRlUHJvZHVjdExhbWJkYSkpO1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vL1RBU0sgNiBUQVNLIDYgVEFTSyA2Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgIC8vINCh0L7Qt9C00LDQtdC8INC+0YfQtdGA0LXQtNGMIFNRU1xyXG4gICAgY29uc3QgY2F0YWxvZ0l0ZW1zUXVldWUgPSBuZXcgc3FzLlF1ZXVlKHRoaXMsICdjYXRhbG9nSXRlbXNRdWV1ZScsIHtcclxuICAgICAgcXVldWVOYW1lOiAnY2F0YWxvZ0l0ZW1zUXVldWUnXHJcbiAgICB9KTtcclxuICAgICAvLyDQodC+0LfQtNCw0LXQvCDRhNGD0L3QutGG0LjRjiBMYW1iZGFcclxuICAgIGNvbnN0IGNhdGFsb2dCYXRjaFByb2Nlc3MgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdjYXRhbG9nQmF0Y2hQcm9jZXNzJywge1xyXG4gICAgICBmdW5jdGlvbk5hbWU6ICdjYXRhbG9nQmF0Y2hQcm9jZXNzJyxcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL0JFX2xvZ2ljNicpLCAvLyDQo9C60LDQttC40YLQtSDQv9GD0YLRjCDQuiDQutC+0LTRgyDQstCw0YjQtdC5IExhbWJkYSDRhNGD0L3QutGG0LjQuFxyXG4gICAgICBoYW5kbGVyOiAnbGFtYmRhX2Z1bmN0aW9uNi5sYW1iZGFfaGFuZGxlcicgLy8g0L/RgNC10LTQv9C+0LvQsNCz0LDQtdGC0YHRjywg0YfRgtC+INCy0LDRiCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDQvdCw0YXQvtC00LjRgtGB0Y8g0LIgaW5kZXguanMg0Lgg0L3QsNC30YvQstCw0LXRgtGB0Y8gaGFuZGxlclxyXG4gICAgfSk7XHJcbiAgICAgICAvLyDQn9GA0LXQtNC+0YHRgtCw0LLQu9C10L3QuNC1IExhbWJkYSDRhNGD0L3QutGG0LjQuCDQv9GA0LDQsiDQvdCwINC30LDQv9C40YHRjCDQsiDRgtCw0LHQu9C40YbRgyBQcm9kdWN0c1xyXG4gICAgcHJvZHVjdHNUYWJsZS5ncmFudFdyaXRlRGF0YShjYXRhbG9nQmF0Y2hQcm9jZXNzKTsgIC8vM1xyXG4gICAgLy8g0J/RgNC10LTQvtGB0YLQsNCy0LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0L/RgNCw0LIg0L3QsCDQt9Cw0L/QuNGB0Ywg0LIg0YLQsNCx0LvQuNGG0YMgc3RvY2tzXHJcbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoY2F0YWxvZ0JhdGNoUHJvY2VzcylcclxuXHJcbiAgICAvLyDQndCw0YHRgtGA0L7QudC60LAg0YLRgNC40LPQs9C10YDQsCBMYW1iZGEg0L3QsCDRgdC+0LHRi9GC0LjRjyDQuNC3IFNRU1xyXG4gICAgY2F0YWxvZ0JhdGNoUHJvY2Vzcy5hZGRFdmVudFNvdXJjZShuZXcgbGFtYmRhRXZlbnRTb3VyY2VzLlNxc0V2ZW50U291cmNlKGNhdGFsb2dJdGVtc1F1ZXVlLCB7XHJcbiAgICAgIGJhdGNoU2l6ZTogNSAvLyDQmtC+0LvQuNGH0LXRgdGC0LLQviDRgdC+0L7QsdGJ0LXQvdC40LksINC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvNGL0YUg0LfQsCDQvtC00LjQvSDRgNCw0LdcclxuICAgIH0pKTtcclxuXHJcbiAgICAvLy8vLy8vVEFTSyA2LjMgLy8vLy8vLy8vLy8vLy9UQVNLIDYuMyAvLy8vLy8vLy8vLy8vLy8gIFRBU0sgNi4zXHJcbiAgICAgLy8g0KHQvtC30LTQsNC90LjQtSBTTlMg0YLQtdC80YtcclxuICAgIGNvbnN0IGNyZWF0ZVByb2R1Y3RUb3BpYyA9IG5ldyBUb3BpYyh0aGlzLCAnY3JlYXRlUHJvZHVjdFRvcGljJywge1xyXG4gICAgICB0b3BpY05hbWU6ICdjcmVhdGUtcHJvZHVjdC10b3BpYycsXHJcbiAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0L/QvtC00L/QuNGB0LrQuCDRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0L7QuSDQsdC10Lcg0YTQuNC70YzRgtGA0LBcclxuICAgIGNyZWF0ZVByb2R1Y3RUb3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IEVtYWlsU3Vic2NyaXB0aW9uKCdkZW5pc3ptYWlsQGdtYWlsLmNvbScpKTtcclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC/0L7Qu9C40YLQuNC60Lgg0YTQuNC70YzRgtGA0LDRhtC40Lgg0LTQu9GPINC/0L7QtNC/0LjRgdC60LhcclxuICAgIGNvbnN0IGZpbHRlclBvbGljeSA9IHtcclxuICAgICAgZGVzY3JpcHRpb246IFN1YnNjcmlwdGlvbkZpbHRlci5zdHJpbmdGaWx0ZXIoe1xyXG4gICAgICAgIGFsbG93bGlzdDogWydCWUNJS0xFJ11cclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0L/QvtC00L/QuNGB0LrQuCDRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0L7QuSDRgSDRhNC40LvRjNGC0YDQvtC8XHJcbiAgICBjcmVhdGVQcm9kdWN0VG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBFbWFpbFN1YnNjcmlwdGlvbigna29yb2x5b3Zha3Jpc3RpbmE5NkBnbWFpbC5jb20nLCB7XHJcbiAgICAgIGZpbHRlclBvbGljeVxyXG4gICAgfSkpO1xyXG5cclxuXHJcbi8vICAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQv9C+0LTQv9C40YHQutC4INGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLQvtC5XHJcbi8vICAgICBjb25zdCBlbWFpbFN1YnNjcmlwdGlvbiA9IG5ldyBFbWFpbFN1YnNjcmlwdGlvbignZGVuaXN6bWFpbEBnbWFpbC5jb20nKTtcclxuLy8gICAgIGNyZWF0ZVByb2R1Y3RUb3BpYy5hZGRTdWJzY3JpcHRpb24oZW1haWxTdWJzY3JpcHRpb24pO1xyXG4vL1xyXG4vLyAgICAgY29uc3QgZmlsdGVyUG9saWN5ID0ge1xyXG4vLyAgICAgICBkZXNjcmlwdGlvbjogc25zLlN1YnNjcmlwdGlvbkZpbHRlci5zdHJpbmdGaWx0ZXIoe1xyXG4vLyAgICAgICAgIHdoaXRlbGlzdDogWydCWUNJS0xFJ11cclxuLy8gICAgICAgfSlcclxuLy8gICAgIH07XHJcbi8vXHJcbi8vICAgICBjcmVhdGVQcm9kdWN0VG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBFbWFpbFN1YnNjcmlwdGlvbigna29yb2x5b3Zha3Jpc3RpbmE5NkBnbWFpbC5jb20nLCB7XHJcbi8vICAgICAgIGZpbHRlclBvbGljeTogZmlsdGVyUG9saWN5XHJcbi8vICAgICB9KSk7XHJcblxyXG5cclxuLy8ga29yb2x5b3Zha3Jpc3RpbmE5NkBnbWFpbC5jb21cclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQXBpVXJsJywge1xyXG4gICAgICB2YWx1ZTogYXBpLnVybCxcclxuICAgIH0pO1xyXG5cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcbm5ldyBMYW1iZGFBcGlHYXRld2F5U3RhY2soYXBwLCAnTFVOQTIwNDUnLCB7ICAgLy8gINC90LDQt9Cy0LDQvdC40LUg0YHRgtC10LrQsFxyXG4gICAgZW52OiB7IGFjY291bnQ6ICc3NjE1NzYzNDM2MjEnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sIC8vXHJcbn0pO1xyXG5hcHAuc3ludGgoKTtcclxuIl19