#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

import { Topic,  SubscriptionFilter  } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';




export class LambdaApiGatewayStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Импортируем существующие таблицы по ARN
    const productsTable = dynamodb.Table.fromTableArn(this, 'ImportedProductsTable', "arn:aws:dynamodb:us-east-1:761576343621:table/products");

    const stocksTable = dynamodb.Table.fromTableArn(this, 'ImportedStocksTable', "arn:aws:dynamodb:us-east-1:761576343621:table/stocks");



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
    productsTable.grantWriteData(createProductLambda);  //3
    // Предоставление Lambda функции прав на запись в таблицу stocks
    stocksTable.grantReadWriteData(createProductLambda)

    productsTable.grantReadWriteData(getProductsListLambda);
    stocksTable.grantReadWriteData(getProductsListLambda);

    productsTable.grantReadWriteData(getProductsByIdLambda);
    stocksTable.grantReadWriteData(getProductsByIdLambda);



    // Определение API Gateway
    const api = new apigateway.RestApi(this, 'ProductsApi', {
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
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      },
    });

    // Создание ресурса /products для API Gateway
    const productsResource = api.root.addResource('products');

    // Создание ресурса /products/{productId} для API Gateway
    const productByIdResource = productsResource.addResource('{productId}');


    // Создание метода GET, который триггерит Lambda функцию для получения продукта по ID
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda));


    // Создание метода GET, который триггерит Lambda функцию
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));

    // Создание метода POST для ресурса /products, который триггерит созданную Lambda функцию
    productsResource.addMethod('POST', new apigateway.LambdaIntegration(createProductLambda));

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
    productsTable.grantWriteData(catalogBatchProcess);  //3
    // Предоставление Lambda функции прав на запись в таблицу stocks
    stocksTable.grantReadWriteData(catalogBatchProcess)

    // Настройка триггера Lambda на события из SQS
    catalogBatchProcess.addEventSource(new lambdaEventSources.SqsEventSource(catalogItemsQueue, {
      batchSize: 5 // Количество сообщений, обрабатываемых за один раз
    }));

    ///////TASK 6.3 //////////////TASK 6.3 ///////////////  TASK 6.3
     // Создание SNS темы
    const createProductTopic = new Topic(this, 'createProductTopic', {
      topicName: 'create-product-topic',
    });

        // Добавление подписки с электронной почтой без фильтра
    createProductTopic.addSubscription(new EmailSubscription('deniszmail@gmail.com'));

    // Создание политики фильтрации для подписки
    const filterPolicy = {
      description: SubscriptionFilter.stringFilter({
        allowlist: ['BYCIKLE']
      })
    };

    // Добавление подписки с электронной почтой с фильтром
    createProductTopic.addSubscription(new EmailSubscription('korolyovakristina96@gmail.com', {
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

const app = new cdk.App();
new LambdaApiGatewayStack(app, 'GELIOS3088', {   //  название стека
    env: { account: '761576343621', region: 'us-east-1' }, //
});
app.synth();
