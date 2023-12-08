#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';

export class LambdaApiGatewayStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //////////////task4///////////////////////////////
    // Создание таблицы Products
    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'products',
      
    });

    // Создание таблицы Stocks
    const stocksTable = new dynamodb.Table(this, 'StocksTable', {
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      tableName: 'stocks',
      
    });


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
    productsTable.grantReadWriteData(getProductsListLambda);
    stocksTable.grantReadWriteData(getProductsListLambda);

    productsTable.grantReadWriteData(getProductsByIdLambda);
    stocksTable.grantReadWriteData(getProductsByIdLambda);



    // Определение API Gateway
    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
    });

    // Создание ресурса /products для API Gateway
    const productsResource = api.root.addResource('products');

    // Создание ресурса /products/{productId} для API Gateway
    const productByIdResource = productsResource.addResource('{productId}');


    // Создание метода GET, который триггерит Lambda функцию для получения продукта по ID
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda));


    // Создание метода GET, который триггерит Lambda функцию
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));

     

  }
}


const app = new cdk.App();
new LambdaApiGatewayStack(app, 'MyLAMBDA01XXX', {   //  название стека  свл вуздщн
    env: { account: '761576343621', region: 'us-east-1' }, // 
});
app.synth();

