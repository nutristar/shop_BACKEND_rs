# import json
#
# def getProductsList(event, context):
#     # Mock data for the products list
#     products = [
#     {"description": "Short Product Description1", "id": "1", "price": 204, "title": "Hello RS Shcool", "count": 1},
#     {"description": "Short Product Description7", "id": "2", "price": 15, "title": "ProductTitle", "count": 2},
#     {"description": "Short Product Description2", "id": "3", "price": 23, "title": "Product", "count": 3},
#     {"description": "Short Product Description4", "id": "4", "price": 15, "title": "ProductTest", "count": 4},
#     {"description": "Short Product Descriptio1", "id": "5", "price": 23, "title": "Product2", "count": 5},
#     {"description": "Short Product Description7", "id": "6", "price": 15, "title": "ProductName", "count": 6}
# ]
#
#     # The response object structure expected by API Gateway
#     response = {
#         "statusCode": 200,
#         "headers": {
#             "Content-Type": "application/json"
#         },
#         "body": json.dumps(products)
#     }
#
#     return response

import boto3
import json
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)

# Usage


def getProductsList(event, context):
    # Initialize a boto3 DynamoDB resource
    dynamodb = boto3.resource('dynamodb')

    # Reference the DynamoDB table
    # table = dynamodb.Table('products')

    # Fetch the products from the DynamoDB table
    try:
        table1 = dynamodb.Table('products')
        response1 = table1.scan()
        products1 = response1['Items']

        # Получение данных из таблицы stocks
        table2 = dynamodb.Table('stocks')
        response2 = table2.scan()
        stocks2 = response2['Items']

        # Преобразование списка товаров в словарь для удобства соединения
        products_dict = {product['id']: product for product in products1}

        # Соединение данных
        joined_data = []
        for stock in stocks2:
            product_id = stock['product_id']
            if product_id in products_dict:
                # Соединяем данные о продукте с данными о запасах
                # joined_record = {**products_dict[product_id], **stock}
                joined_record = {**products_dict[product_id], "count": stock["count"]}
                joined_data.append(joined_record)

        # Печать результата соединения в формате JSON
        # print(json.dumps(joined_data, cls=DecimalEncoder))
    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            "body": json.dumps("Error fetching products from DynamoDB")
        }

    # The response object structure expected by API Gateway
    api_response = {

        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",  # Or a specific domain
        },
        # "body": json.dumps(products)
        "body": json.dumps(joined_data, cls=DecimalEncoder)
    }

    return api_response
