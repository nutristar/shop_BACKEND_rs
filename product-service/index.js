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
            code: lambda.Code.fromAsset('./BE_logic'), // здесь 
            handler: 'lambda_function.getProductsList',
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName,
                STOCKS_TABLE_NAME: stocksTable.tableName,
            }
        });
        // Определение Lambda функции для получения продукта по ID
        const getProductsByIdLambda = new lambda.Function(this, 'GetProductsByIdFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('./BE_logic2'), // Путь к коду Lambda
            handler: 'get_product_by_id.getProductsById', // файл get_product_by_id.py и функция handler в нем
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName,
                STOCKS_TABLE_NAME: stocksTable.tableName,
            }
        });
        // Lambda function for creating new products   3
        const createProductLambda = new lambda.Function(this, 'CreateProductFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('./BE_logic3'), // Путь к коду Lambda
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
            code: lambda.Code.fromAsset('./BE_logic6'), // Укажите путь к коду вашей Lambda функции
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
new LambdaApiGatewayStack(app, 'GELIOS3088', {
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBRW5DLDZDQUEyRDtBQUMzRCw2Q0FBdUQ7QUFHdkQsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQywyRUFBMkU7QUFFM0UsaURBQWtFO0FBQ2xFLDZFQUFzRTtBQUt0RSxNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2xELFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QiwwQ0FBMEM7UUFDMUMsTUFBTSxhQUFhLEdBQUcsMEJBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSx3REFBd0QsQ0FBQyxDQUFDO1FBRTNJLE1BQU0sV0FBVyxHQUFHLDBCQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsc0RBQXNELENBQUMsQ0FBQztRQUlySSx1REFBdUQ7UUFJdkQsOEJBQThCO1FBQzlCLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNqRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxTQUFTO1lBQ3BELE9BQU8sRUFBRSxpQ0FBaUM7WUFDMUMsV0FBVyxFQUFFO2dCQUNYLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxTQUFTO2dCQUM1QyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsU0FBUzthQUN6QztTQUNGLENBQUMsQ0FBQztRQUVILDBEQUEwRDtRQUMxRCxNQUFNLHFCQUFxQixHQUFHLElBQUksTUFBTSxDQUFD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a0IsQ0FBQyxlQUFlLENBQUMsSUFBSSx5Q0FBaUIsQ0FBQywrQkFBK0IsRUFBRTtZQUN4RixZQUFZO1NBQ2IsQ0FBQyxDQUFDLENBQUM7UUFHUixrREFBa0Q7UUFDbEQsK0VBQStFO1FBQy9FLDZEQUE2RDtRQUM3RCxFQUFFO1FBQ0YsNkJBQTZCO1FBQzdCLDJEQUEyRDtRQUMzRCxpQ0FBaUM7UUFDakMsV0FBVztRQUNYLFNBQVM7UUFDVCxFQUFFO1FBQ0Ysa0dBQWtHO1FBQ2xHLG1DQUFtQztRQUNuQyxXQUFXO1FBR1gsZ0NBQWdDO1FBRTVCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRztTQUNmLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQWxLRCxzREFrS0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUU7SUFDekMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtDQUM1RCxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcblxyXG5pbXBvcnQgeyBhd3NfYXBpZ2F0ZXdheSBhcyBhcGlnYXRld2F5IH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBhd3NfZHluYW1vZGIgYXMgZHluYW1vZGIgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XHJcbmltcG9ydCAqIGFzIGxhbWJkYUV2ZW50U291cmNlcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xyXG5cclxuaW1wb3J0IHsgVG9waWMsICBTdWJzY3JpcHRpb25GaWx0ZXIgIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XHJcbmltcG9ydCB7IEVtYWlsU3Vic2NyaXB0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBMYW1iZGFBcGlHYXRld2F5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAvLyDQmNC80L/QvtGA0YLQuNGA0YPQtdC8INGB0YPRidC10YHRgtCy0YPRjtGJ0LjQtSDRgtCw0LHQu9C40YbRiyDQv9C+IEFSTlxyXG4gICAgY29uc3QgcHJvZHVjdHNUYWJsZSA9IGR5bmFtb2RiLlRhYmxlLmZyb21UYWJsZUFybih0aGlzLCAnSW1wb3J0ZWRQcm9kdWN0c1RhYmxlJywgXCJhcm46YXdzOmR5bmFtb2RiOnVzLWVhc3QtMTo3NjE1NzYzNDM2MjE6dGFibGUvcHJvZHVjdHNcIik7XHJcblxyXG4gICAgY29uc3Qgc3RvY2tzVGFibGUgPSBkeW5hbW9kYi5UYWJsZS5mcm9tVGFibGVBcm4odGhpcywgJ0ltcG9ydGVkU3RvY2tzVGFibGUnLCBcImFybjphd3M6ZHluYW1vZGI6dXMtZWFzdC0xOjc2MTU3NjM0MzYyMTp0YWJsZS9zdG9ja3NcIik7XHJcblxyXG5cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1IExhbWJkYSDRhNGD0L3QutGG0LjQuDFcclxuICAgIGNvbnN0IGdldFByb2R1Y3RzTGlzdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0dldFByb2R1Y3RzTGlzdEZ1bmN0aW9uJywge1xyXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxyXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vQkVfbG9naWMnKSwgLy8g0LfQtNC10YHRjCBcclxuICAgICAgaGFuZGxlcjogJ2xhbWJkYV9mdW5jdGlvbi5nZXRQcm9kdWN0c0xpc3QnLFxyXG4gICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgIFBST0RVQ1RTX1RBQkxFX05BTUU6IHByb2R1Y3RzVGFibGUudGFibGVOYW1lLFxyXG4gICAgICAgIFNUT0NLU19UQUJMRV9OQU1FOiBzdG9ja3NUYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4INC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0L/RgNC+0LTRg9C60YLQsCDQv9C+IElEXHJcbiAgICBjb25zdCBnZXRQcm9kdWN0c0J5SWRMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdHZXRQcm9kdWN0c0J5SWRGdW5jdGlvbicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL0JFX2xvZ2ljMicpLCAvLyDQn9GD0YLRjCDQuiDQutC+0LTRgyBMYW1iZGFcclxuICAgICAgaGFuZGxlcjogJ2dldF9wcm9kdWN0X2J5X2lkLmdldFByb2R1Y3RzQnlJZCcsIC8vINGE0LDQudC7IGdldF9wcm9kdWN0X2J5X2lkLnB5INC4INGE0YPQvdC60YbQuNGPIGhhbmRsZXIg0LIg0L3QtdC8XHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgUFJPRFVDVFNfVEFCTEVfTkFNRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgICAgU1RPQ0tTX1RBQkxFX05BTUU6IHN0b2Nrc1RhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyBMYW1iZGEgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIG5ldyBwcm9kdWN0cyAgIDNcclxuICAgIGNvbnN0IGNyZWF0ZVByb2R1Y3RMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdDcmVhdGVQcm9kdWN0RnVuY3Rpb24nLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9CRV9sb2dpYzMnKSwgLy8g0J/Rg9GC0Ywg0Log0LrQvtC00YMgTGFtYmRhXHJcbiAgICAgIGhhbmRsZXI6ICdjcmVhdGVfcHJvZHVjdC5jcmVhdGUnLFxyXG4gICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgIFBST0RVQ1RTX1RBQkxFX05BTUU6IHByb2R1Y3RzVGFibGUudGFibGVOYW1lXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCf0YDQtdC00L7RgdGC0LDQstC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4INC/0YDQsNCyINC90LAg0LfQsNC/0LjRgdGMINCyINGC0LDQsdC70LjRhtGDIFByb2R1Y3RzXHJcbiAgICBwcm9kdWN0c1RhYmxlLmdyYW50V3JpdGVEYXRhKGNyZWF0ZVByb2R1Y3RMYW1iZGEpOyAgLy8zXHJcbiAgICAvLyDQn9GA0LXQtNC+0YHRgtCw0LLQu9C10L3QuNC1IExhbWJkYSDRhNGD0L3QutGG0LjQuCDQv9GA0LDQsiDQvdCwINC30LDQv9C40YHRjCDQsiDRgtCw0LHQu9C40YbRgyBzdG9ja3NcclxuICAgIHN0b2Nrc1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShjcmVhdGVQcm9kdWN0TGFtYmRhKVxyXG5cclxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGdldFByb2R1Y3RzTGlzdExhbWJkYSk7XHJcbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ2V0UHJvZHVjdHNMaXN0TGFtYmRhKTtcclxuXHJcbiAgICBwcm9kdWN0c1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShnZXRQcm9kdWN0c0J5SWRMYW1iZGEpO1xyXG4gICAgc3RvY2tzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGdldFByb2R1Y3RzQnlJZExhbWJkYSk7XHJcblxyXG5cclxuXHJcbiAgICAvLyDQntC/0YDQtdC00LXQu9C10L3QuNC1IEFQSSBHYXRld2F5XHJcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdQcm9kdWN0c0FwaScsIHtcclxuICAgICAgcmVzdEFwaU5hbWU6ICdQcm9kdWN0cyBTZXJ2aWNlJyxcclxuICAgICAgZGVwbG95T3B0aW9uczoge1xyXG4gICAgICAgIHN0YWdlTmFtZTogJ2RldicsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcclxuICAgICAgICBhbGxvd0hlYWRlcnM6IFtcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnLFxyXG4gICAgICAgICAgJ1gtQW16LURhdGUnLFxyXG4gICAgICAgICAgJ0F1dGhvcml6YXRpb24nLFxyXG4gICAgICAgICAgJ1gtQXBpLUtleScsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBhbGxvd01ldGhvZHM6IFsnT1BUSU9OUycsICdHRVQnLCAnUE9TVCddLFxyXG4gICAgICAgIGFsbG93Q3JlZGVudGlhbHM6IHRydWUsXHJcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlNcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YDQtdGB0YPRgNGB0LAgL3Byb2R1Y3RzINC00LvRjyBBUEkgR2F0ZXdheVxyXG4gICAgY29uc3QgcHJvZHVjdHNSZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwcm9kdWN0cycpO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0YDQtdGB0YPRgNGB0LAgL3Byb2R1Y3RzL3twcm9kdWN0SWR9INC00LvRjyBBUEkgR2F0ZXdheVxyXG4gICAgY29uc3QgcHJvZHVjdEJ5SWRSZXNvdXJjZSA9IHByb2R1Y3RzUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ3twcm9kdWN0SWR9Jyk7XHJcblxyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LzQtdGC0L7QtNCwIEdFVCwg0LrQvtGC0L7RgNGL0Lkg0YLRgNC40LPQs9C10YDQuNGCIExhbWJkYSDRhNGD0L3QutGG0LjRjiDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC/0YDQvtC00YPQutGC0LAg0L/QviBJRFxyXG4gICAgcHJvZHVjdEJ5SWRSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldFByb2R1Y3RzQnlJZExhbWJkYSkpO1xyXG5cclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC80LXRgtC+0LTQsCBHRVQsINC60L7RgtC+0YDRi9C5INGC0YDQuNCz0LPQtdGA0LjRgiBMYW1iZGEg0YTRg9C90LrRhtC40Y5cclxuICAgIHByb2R1Y3RzUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihnZXRQcm9kdWN0c0xpc3RMYW1iZGEpKTtcclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC80LXRgtC+0LTQsCBQT1NUINC00LvRjyDRgNC10YHRg9GA0YHQsCAvcHJvZHVjdHMsINC60L7RgtC+0YDRi9C5INGC0YDQuNCz0LPQtdGA0LjRgiDRgdC+0LfQtNCw0L3QvdGD0Y4gTGFtYmRhINGE0YPQvdC60YbQuNGOXHJcbiAgICBwcm9kdWN0c1Jlc291cmNlLmFkZE1ldGhvZCgnUE9TVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGNyZWF0ZVByb2R1Y3RMYW1iZGEpKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy9UQVNLIDYgVEFTSyA2IFRBU0sgNi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAvLyDQodC+0LfQtNCw0LXQvCDQvtGH0LXRgNC10LTRjCBTUVNcclxuICAgIGNvbnN0IGNhdGFsb2dJdGVtc1F1ZXVlID0gbmV3IHNxcy5RdWV1ZSh0aGlzLCAnY2F0YWxvZ0l0ZW1zUXVldWUnLCB7XHJcbiAgICAgIHF1ZXVlTmFtZTogJ2NhdGFsb2dJdGVtc1F1ZXVlJ1xyXG4gICAgfSk7XHJcbiAgICAgLy8g0KHQvtC30LTQsNC10Lwg0YTRg9C90LrRhtC40Y4gTGFtYmRhXHJcbiAgICBjb25zdCBjYXRhbG9nQmF0Y2hQcm9jZXNzID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnY2F0YWxvZ0JhdGNoUHJvY2VzcycsIHtcclxuICAgICAgZnVuY3Rpb25OYW1lOiAnY2F0YWxvZ0JhdGNoUHJvY2VzcycsXHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9CRV9sb2dpYzYnKSwgLy8g0KPQutCw0LbQuNGC0LUg0L/Rg9GC0Ywg0Log0LrQvtC00YMg0LLQsNGI0LXQuSBMYW1iZGEg0YTRg9C90LrRhtC40LhcclxuICAgICAgaGFuZGxlcjogJ2xhbWJkYV9mdW5jdGlvbjYubGFtYmRhX2hhbmRsZXInIC8vINC/0YDQtdC00L/QvtC70LDQs9Cw0LXRgtGB0Y8sINGH0YLQviDQstCw0Ygg0L7QsdGA0LDQsdC+0YLRh9C40Log0L3QsNGF0L7QtNC40YLRgdGPINCyIGluZGV4LmpzINC4INC90LDQt9GL0LLQsNC10YLRgdGPIGhhbmRsZXJcclxuICAgIH0pO1xyXG4gICAgICAgLy8g0J/RgNC10LTQvtGB0YLQsNCy0LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0L/RgNCw0LIg0L3QsCDQt9Cw0L/QuNGB0Ywg0LIg0YLQsNCx0LvQuNGG0YMgUHJvZHVjdHNcclxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRXcml0ZURhdGEoY2F0YWxvZ0JhdGNoUHJvY2Vzcyk7ICAvLzNcclxuICAgIC8vINCf0YDQtdC00L7RgdGC0LDQstC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4INC/0YDQsNCyINC90LAg0LfQsNC/0LjRgdGMINCyINGC0LDQsdC70LjRhtGDIHN0b2Nrc1xyXG4gICAgc3RvY2tzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGNhdGFsb2dCYXRjaFByb2Nlc3MpXHJcblxyXG4gICAgLy8g0J3QsNGB0YLRgNC+0LnQutCwINGC0YDQuNCz0LPQtdGA0LAgTGFtYmRhINC90LAg0YHQvtCx0YvRgtC40Y8g0LjQtyBTUVNcclxuICAgIGNhdGFsb2dCYXRjaFByb2Nlc3MuYWRkRXZlbnRTb3VyY2UobmV3IGxhbWJkYUV2ZW50U291cmNlcy5TcXNFdmVudFNvdXJjZShjYXRhbG9nSXRlbXNRdWV1ZSwge1xyXG4gICAgICBiYXRjaFNpemU6IDUgLy8g0JrQvtC70LjRh9C10YHRgtCy0L4g0YHQvtC+0LHRidC10L3QuNC5LCDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10LzRi9GFINC30LAg0L7QtNC40L0g0YDQsNC3XHJcbiAgICB9KSk7XHJcblxyXG4gICAgLy8vLy8vL1RBU0sgNi4zIC8vLy8vLy8vLy8vLy8vVEFTSyA2LjMgLy8vLy8vLy8vLy8vLy8vICBUQVNLIDYuM1xyXG4gICAgIC8vINCh0L7Qt9C00LDQvdC40LUgU05TINGC0LXQvNGLXHJcbiAgICBjb25zdCBjcmVhdGVQcm9kdWN0VG9waWMgPSBuZXcgVG9waWModGhpcywgJ2NyZWF0ZVByb2R1Y3RUb3BpYycsIHtcclxuICAgICAgdG9waWNOYW1lOiAnY3JlYXRlLXByb2R1Y3QtdG9waWMnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC/0L7QtNC/0LjRgdC60Lgg0YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtC+0Lkg0LHQtdC3INGE0LjQu9GM0YLRgNCwXHJcbiAgICBjcmVhdGVQcm9kdWN0VG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBFbWFpbFN1YnNjcmlwdGlvbignZGVuaXN6bWFpbEBnbWFpbC5jb20nKSk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQv9C+0LvQuNGC0LjQutC4INGE0LjQu9GM0YLRgNCw0YbQuNC4INC00LvRjyDQv9C+0LTQv9C40YHQutC4XHJcbiAgICBjb25zdCBmaWx0ZXJQb2xpY3kgPSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uOiBTdWJzY3JpcHRpb25GaWx0ZXIuc3RyaW5nRmlsdGVyKHtcclxuICAgICAgICBhbGxvd2xpc3Q6IFsnQllDSUtMRSddXHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INC/0L7QtNC/0LjRgdC60Lgg0YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtC+0Lkg0YEg0YTQuNC70YzRgtGA0L7QvFxyXG4gICAgY3JlYXRlUHJvZHVjdFRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgRW1haWxTdWJzY3JpcHRpb24oJ2tvcm9seW92YWtyaXN0aW5hOTZAZ21haWwuY29tJywge1xyXG4gICAgICBmaWx0ZXJQb2xpY3lcclxuICAgIH0pKTtcclxuXHJcblxyXG4vLyAgICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0L/QvtC00L/QuNGB0LrQuCDRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0L7QuVxyXG4vLyAgICAgY29uc3QgZW1haWxTdWJzY3JpcHRpb24gPSBuZXcgRW1haWxTdWJzY3JpcHRpb24oJ2Rlbmlzem1haWxAZ21haWwuY29tJyk7XHJcbi8vICAgICBjcmVhdGVQcm9kdWN0VG9waWMuYWRkU3Vic2NyaXB0aW9uKGVtYWlsU3Vic2NyaXB0aW9uKTtcclxuLy9cclxuLy8gICAgIGNvbnN0IGZpbHRlclBvbGljeSA9IHtcclxuLy8gICAgICAgZGVzY3JpcHRpb246IHNucy5TdWJzY3JpcHRpb25GaWx0ZXIuc3RyaW5nRmlsdGVyKHtcclxuLy8gICAgICAgICB3aGl0ZWxpc3Q6IFsnQllDSUtMRSddXHJcbi8vICAgICAgIH0pXHJcbi8vICAgICB9O1xyXG4vL1xyXG4vLyAgICAgY3JlYXRlUHJvZHVjdFRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgRW1haWxTdWJzY3JpcHRpb24oJ2tvcm9seW92YWtyaXN0aW5hOTZAZ21haWwuY29tJywge1xyXG4vLyAgICAgICBmaWx0ZXJQb2xpY3k6IGZpbHRlclBvbGljeVxyXG4vLyAgICAgfSkpO1xyXG5cclxuXHJcbi8vIGtvcm9seW92YWtyaXN0aW5hOTZAZ21haWwuY29tXHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0FwaVVybCcsIHtcclxuICAgICAgdmFsdWU6IGFwaS51cmwsXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5uZXcgTGFtYmRhQXBpR2F0ZXdheVN0YWNrKGFwcCwgJ0dFTElPUzMwODgnLCB7ICAgLy8gINC90LDQt9Cy0LDQvdC40LUg0YHRgtC10LrQsFxyXG4gICAgZW52OiB7IGFjY291bnQ6ICc3NjE1NzYzNDM2MjEnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sIC8vXHJcbn0pO1xyXG5hcHAuc3ludGgoKTtcclxuIl19