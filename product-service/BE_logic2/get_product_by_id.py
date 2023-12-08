import  boto3
import json
from decimal import Decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)
def getProductsById(event, context):
    print(event)
    # Extract 'productId' from the path parameters
    product_id = event['pathParameters']['productId']

    # Инициализируем клиент DynamoDB
    dynamodb = boto3.resource('dynamodb')

    # Ссылка на таблицу DynamoDB
    table = dynamodb.Table('products')



    try:
        response = table.query(
            IndexName='id-index',
            KeyConditionExpression='id = :id',
            ExpressionAttributeValues={':id': product_id}
        )
        print(f"responce --- {response}" )
        if 'Items' in response:
            # Выводим данные о продукте
            print("Product found:", response['Items'][0])
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",  # Or a specific domain
                },
                "body": json.dumps(response['Items'][0],  cls=DecimalEncoder)  # Return the found product as JSON
            }

        else:
            # Продукт с таким id не найден
            print("Product with id '{}' not found.".format(product_id))
            return {
                'statusCode': 400  ,
                "body": "Product with id '{}' not found.".format(product_id) }


    except boto3.exceptions.Boto3Error as e:
        # Обработка возможных исключений при работе с DynamoDB
        print("Error fetching product from DynamoDB:", e)
        return {
            'statusCode': 500,
            "body": ("Error fetching product from DynamoDB:", e)}
