#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaApiGatewayStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cdk_lib_2 = require("aws-cdk-lib");
const aws_cdk_lib_3 = require("aws-cdk-lib");
class LambdaApiGatewayStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Импортируем существующие таблицы по ARN
        const productsTable = aws_cdk_lib_3.aws_dynamodb.Table.fromTableArn(this, 'ImportedProductsTable', "arn:aws:dynamodb:us-east-1:761576343621:table/products");
        const stocksTable = aws_cdk_lib_3.aws_dynamodb.Table.fromTableArn(this, 'ImportedStocksTable', "arn:aws:dynamodb:us-east-1:761576343621:table/stocks");
        ///////////////////////////////////////////////////////
        // Определение Lambda функции1
        const getProductsListLambda = new aws_cdk_lib_1.aws_lambda.Function(this, 'GetProductsListFunction', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./BE_logic'),
            handler: 'lambda_function.getProductsList',
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName,
                STOCKS_TABLE_NAME: stocksTable.tableName,
            }
        });
        // Определение Lambda функции для получения продукта по ID
        const getProductsByIdLambda = new aws_cdk_lib_1.aws_lambda.Function(this, 'GetProductsByIdFunction', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./BE_logic2'),
            handler: 'get_product_by_id.getProductsById',
            environment: {
                PRODUCTS_TABLE_NAME: productsTable.tableName,
                STOCKS_TABLE_NAME: stocksTable.tableName,
            }
        });
        // Lambda function for creating new products   3
        const createProductLambda = new aws_cdk_lib_1.aws_lambda.Function(this, 'CreateProductFunction', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_8,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('./BE_logic3'),
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
        const api = new aws_cdk_lib_2.aws_apigateway.RestApi(this, 'ProductsApi', {
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
                allowOrigins: aws_cdk_lib_2.aws_apigateway.Cors.ALL_ORIGINS
            },
        });
        // Создание ресурса /products для API Gateway
        const productsResource = api.root.addResource('products');
        // Создание ресурса /products/{productId} для API Gateway
        const productByIdResource = productsResource.addResource('{productId}');
        // Создание метода GET, который триггерит Lambda функцию для получения продукта по ID
        productByIdResource.addMethod('GET', new aws_cdk_lib_2.aws_apigateway.LambdaIntegration(getProductsByIdLambda));
        // Создание метода GET, который триггерит Lambda функцию
        productsResource.addMethod('GET', new aws_cdk_lib_2.aws_apigateway.LambdaIntegration(getProductsListLambda));
        // Создание метода POST для ресурса /products, который триггерит созданную Lambda функцию
        productsResource.addMethod('POST', new aws_cdk_lib_2.aws_apigateway.LambdaIntegration(createProductLambda));
        new cdk.CfnOutput(this, 'ApiUrl', {
            value: api.url,
        });
    }
}
exports.LambdaApiGatewayStack = LambdaApiGatewayStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBQ25DLDZDQUFtRDtBQUNuRCw2Q0FBMkQ7QUFDM0QsNkNBQXVEO0FBRXZELE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDBDQUEwQztRQUMxQyxNQUFNLGFBQWEsR0FBRywwQkFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFLHdEQUF3RCxDQUFDLENBQUM7UUFFM0ksTUFBTSxXQUFXLEdBQUcsMEJBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO1FBSXJJLHVEQUF1RDtRQUl2RCw4QkFBOEI7UUFDOUIsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNqRixPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUN6QyxPQUFPLEVBQUUsaUNBQWlDO1lBQzFDLFdBQVcsRUFBRTtnQkFDWCxtQkFBbUIsRUFBRSxhQUFhLENBQUMsU0FBUztnQkFDNUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLFNBQVM7YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCwwREFBMEQ7UUFDMUQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNqRixPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUMxQyxPQUFPLEVBQUUsbUNBQW1DO1lBQzVDLFdBQVcsRUFBRTtnQkFDWCxtQkFBbUIsRUFBRSxhQUFhLENBQUMsU0FBUztnQkFDNUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLFNBQVM7YUFDekM7U0FDRixDQUFDLENBQUM7UUFDSCxnREFBZ0Q7UUFDaEQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUM3RSxPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUMxQyxPQUFPLEVBQUUsdUJBQXVCO1lBQ2hDLFdBQVcsRUFBRTtnQkFDWCxtQkFBbUIsRUFBRSxhQUFhLENBQUMsU0FBUzthQUM3QztTQUNGLENBQUMsQ0FBQztRQUVILGtFQUFrRTtRQUNsRSxhQUFhLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBRSxHQUFHO1FBQ3ZELGdFQUFnRTtRQUNoRSxXQUFXLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUVuRCxhQUFhLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN4RCxXQUFXLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUV0RCxhQUFhLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN4RCxXQUFXLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUl0RCwwQkFBMEI7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSw0QkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3RELFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1lBRUQsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRTtvQkFDWixjQUFjO29CQUNkLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixXQUFXO2lCQUNaO2dCQUNELFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO2dCQUN4QyxnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixZQUFZLEVBQUUsNEJBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVzthQUMxQztTQUNGLENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTFELHlEQUF5RDtRQUN6RCxNQUFNLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUd4RSxxRkFBcUY7UUFDckYsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBRzlGLHdEQUF3RDtRQUN4RCxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksNEJBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFFM0YseUZBQXlGO1FBQ3pGLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSw0QkFBVSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUUxRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUFyR0Qsc0RBcUdDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBhd3NfbGFtYmRhIGFzIGxhbWJkYSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2FwaWdhdGV3YXkgYXMgYXBpZ2F0ZXdheSB9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgYXdzX2R5bmFtb2RiIGFzIGR5bmFtb2RiIH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5cclxuZXhwb3J0IGNsYXNzIExhbWJkYUFwaUdhdGV3YXlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8vINCY0LzQv9C+0YDRgtC40YDRg9C10Lwg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNC1INGC0LDQsdC70LjRhtGLINC/0L4gQVJOXHJcbiAgICBjb25zdCBwcm9kdWN0c1RhYmxlID0gZHluYW1vZGIuVGFibGUuZnJvbVRhYmxlQXJuKHRoaXMsICdJbXBvcnRlZFByb2R1Y3RzVGFibGUnLCBcImFybjphd3M6ZHluYW1vZGI6dXMtZWFzdC0xOjc2MTU3NjM0MzYyMTp0YWJsZS9wcm9kdWN0c1wiKTtcclxuXHJcbiAgICBjb25zdCBzdG9ja3NUYWJsZSA9IGR5bmFtb2RiLlRhYmxlLmZyb21UYWJsZUFybih0aGlzLCAnSW1wb3J0ZWRTdG9ja3NUYWJsZScsIFwiYXJuOmF3czpkeW5hbW9kYjp1cy1lYXN0LTE6NzYxNTc2MzQzNjIxOnRhYmxlL3N0b2Nrc1wiKTtcclxuXHJcblxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4MVxyXG4gICAgY29uc3QgZ2V0UHJvZHVjdHNMaXN0TGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnR2V0UHJvZHVjdHNMaXN0RnVuY3Rpb24nLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9CRV9sb2dpYycpLCAvLyDQt9C00LXRgdGMIFxyXG4gICAgICBoYW5kbGVyOiAnbGFtYmRhX2Z1bmN0aW9uLmdldFByb2R1Y3RzTGlzdCcsXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgUFJPRFVDVFNfVEFCTEVfTkFNRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgICAgU1RPQ0tTX1RBQkxFX05BTUU6IHN0b2Nrc1RhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J7Qv9GA0LXQtNC10LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0LTQu9GPINC/0L7Qu9GD0YfQtdC90LjRjyDQv9GA0L7QtNGD0LrRgtCwINC/0L4gSURcclxuICAgIGNvbnN0IGdldFByb2R1Y3RzQnlJZExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0dldFByb2R1Y3RzQnlJZEZ1bmN0aW9uJywge1xyXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxyXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vQkVfbG9naWMyJyksIC8vINCf0YPRgtGMINC6INC60L7QtNGDIExhbWJkYVxyXG4gICAgICBoYW5kbGVyOiAnZ2V0X3Byb2R1Y3RfYnlfaWQuZ2V0UHJvZHVjdHNCeUlkJywgLy8g0YTQsNC50LsgZ2V0X3Byb2R1Y3RfYnlfaWQucHkg0Lgg0YTRg9C90LrRhtC40Y8gaGFuZGxlciDQsiDQvdC10LxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBQUk9EVUNUU19UQUJMRV9OQU1FOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgICBTVE9DS1NfVEFCTEVfTkFNRTogc3RvY2tzVGFibGUudGFibGVOYW1lLFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIExhbWJkYSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgbmV3IHByb2R1Y3RzICAgM1xyXG4gICAgY29uc3QgY3JlYXRlUHJvZHVjdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZVByb2R1Y3RGdW5jdGlvbicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL0JFX2xvZ2ljMycpLCAvLyDQn9GD0YLRjCDQuiDQutC+0LTRgyBMYW1iZGFcclxuICAgICAgaGFuZGxlcjogJ2NyZWF0ZV9wcm9kdWN0LmNyZWF0ZScsXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgUFJPRFVDVFNfVEFCTEVfTkFNRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWVcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J/RgNC10LTQvtGB0YLQsNCy0LvQtdC90LjQtSBMYW1iZGEg0YTRg9C90LrRhtC40Lgg0L/RgNCw0LIg0L3QsCDQt9Cw0L/QuNGB0Ywg0LIg0YLQsNCx0LvQuNGG0YMgUHJvZHVjdHNcclxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRXcml0ZURhdGEoY3JlYXRlUHJvZHVjdExhbWJkYSk7ICAvLzNcclxuICAgIC8vINCf0YDQtdC00L7RgdGC0LDQstC70LXQvdC40LUgTGFtYmRhINGE0YPQvdC60YbQuNC4INC/0YDQsNCyINC90LAg0LfQsNC/0LjRgdGMINCyINGC0LDQsdC70LjRhtGDIHN0b2Nrc1xyXG4gICAgc3RvY2tzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGNyZWF0ZVByb2R1Y3RMYW1iZGEpXHJcblxyXG4gICAgcHJvZHVjdHNUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ2V0UHJvZHVjdHNMaXN0TGFtYmRhKTtcclxuICAgIHN0b2Nrc1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShnZXRQcm9kdWN0c0xpc3RMYW1iZGEpO1xyXG5cclxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGdldFByb2R1Y3RzQnlJZExhbWJkYSk7XHJcbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ2V0UHJvZHVjdHNCeUlkTGFtYmRhKTtcclxuXHJcblxyXG5cclxuICAgIC8vINCe0L/RgNC10LTQtdC70LXQvdC40LUgQVBJIEdhdGV3YXlcclxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ1Byb2R1Y3RzQXBpJywge1xyXG4gICAgICByZXN0QXBpTmFtZTogJ1Byb2R1Y3RzIFNlcnZpY2UnLFxyXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XHJcbiAgICAgICAgc3RhZ2VOYW1lOiAnZGV2JyxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xyXG4gICAgICAgIGFsbG93SGVhZGVyczogW1xyXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZScsXHJcbiAgICAgICAgICAnWC1BbXotRGF0ZScsXHJcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbicsXHJcbiAgICAgICAgICAnWC1BcGktS2V5JyxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGFsbG93TWV0aG9kczogWydPUFRJT05TJywgJ0dFVCcsICdQT1NUJ10sXHJcbiAgICAgICAgYWxsb3dDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOU1xyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRgNC10YHRg9GA0YHQsCAvcHJvZHVjdHMg0LTQu9GPIEFQSSBHYXRld2F5XHJcbiAgICBjb25zdCBwcm9kdWN0c1Jlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Byb2R1Y3RzJyk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDRgNC10YHRg9GA0YHQsCAvcHJvZHVjdHMve3Byb2R1Y3RJZH0g0LTQu9GPIEFQSSBHYXRld2F5XHJcbiAgICBjb25zdCBwcm9kdWN0QnlJZFJlc291cmNlID0gcHJvZHVjdHNSZXNvdXJjZS5hZGRSZXNvdXJjZSgne3Byb2R1Y3RJZH0nKTtcclxuXHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQvNC10YLQvtC00LAgR0VULCDQutC+0YLQvtGA0YvQuSDRgtGA0LjQs9Cz0LXRgNC40YIgTGFtYmRhINGE0YPQvdC60YbQuNGOINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0L/RgNC+0LTRg9C60YLQsCDQv9C+IElEXHJcbiAgICBwcm9kdWN0QnlJZFJlc291cmNlLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZ2V0UHJvZHVjdHNCeUlkTGFtYmRhKSk7XHJcblxyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LzQtdGC0L7QtNCwIEdFVCwg0LrQvtGC0L7RgNGL0Lkg0YLRgNC40LPQs9C10YDQuNGCIExhbWJkYSDRhNGD0L3QutGG0LjRjlxyXG4gICAgcHJvZHVjdHNSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldFByb2R1Y3RzTGlzdExhbWJkYSkpO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0LzQtdGC0L7QtNCwIFBPU1Qg0LTQu9GPINGA0LXRgdGD0YDRgdCwIC9wcm9kdWN0cywg0LrQvtGC0L7RgNGL0Lkg0YLRgNC40LPQs9C10YDQuNGCINGB0L7Qt9C00LDQvdC90YPRjiBMYW1iZGEg0YTRg9C90LrRhtC40Y5cclxuICAgIHByb2R1Y3RzUmVzb3VyY2UuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oY3JlYXRlUHJvZHVjdExhbWJkYSkpO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBcGlVcmwnLCB7XHJcbiAgICAgIHZhbHVlOiBhcGkudXJsLFxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5cclxuIl19