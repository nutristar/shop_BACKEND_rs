#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';

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

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });

  }
}

