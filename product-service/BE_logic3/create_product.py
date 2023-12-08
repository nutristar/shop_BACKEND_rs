import json
import boto3
from botocore.exceptions import ClientError

# Инициализируем клиент DynamoDB
dynamodb = boto3.resource('dynamodb')
client = boto3.client('dynamodb')

def create(event, context):
    # Получаем таблицы из переменных окружения
    products_table = dynamodb.Table('products')
    stocks_table = dynamodb.Table('stocks')

    # Парсим тело запроса
    try:
        body = json.loads(event['body'])
    except json.JSONDecodeError as e:
        # Возвращаем ошибку, если тело запроса не в формате JSON
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }

    # Проверяем наличие всех необходимых полей в теле запроса
    required_fields = ['id', 'title', 'description', 'price', 'count']
    if not all(field in body for field in required_fields):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing required fields'})
        }

    # Создаем новый продукт и запись о запасе атомарно
    try:
        transact_items = [
            {
                'Put': {
                    'TableName': products_table.name,
                    'Item': {
                        'id': {'S': body['id']},
                        'title': {'S': body['title']},
                        'description': {'S': body['description']},
                        'price': {'S': body['price']}
                    }
                }
            },
            {
                'Put': {
                    'TableName': stocks_table.name,
                    'Item': {
                        'product_id': {'S': body['id']},
                        'count': {'N': str(body['count'])}
                    }
                }
            }
        ]
        client.transact_write_items(TransactItems=transact_items)

        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'Product and stock created successfully', 'product': body})
        }
    except ClientError as e:
        # Обрабатываем возможные ошибки во время транзакционной записи в таблицы
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


# import json
# import boto3
# from botocore.exceptions import ClientError
#
# # Инициализируем клиент DynamoDB
# dynamodb = boto3.resource('dynamodb')
#
# def create(event, context):
#     # Получаем таблицу из переменных окружения
#     # table_name = os.environ['products']
#     table = dynamodb.Table('products')
#     table2 = dynamodb.Table('stocks')
#
#     # Парсим тело запроса
#     try:
#         body = json.loads(event['body'])
#     except json.JSONDecodeError as e:
#         # Возвращаем ошибку, если тело запроса не в формате JSON
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': str(e)})
#         }
#
#     # Проверяем наличие всех необходимых полей в теле запроса
#     if 'id' not in body or 'title' not in body or 'description' not in body or 'price' not in body:
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': 'Missing required fields'})
#         }
#
#     # Создаем новый продукт
#     try:
#         response = table.put_item(Item={
#             'id': body['id'],
#             'title': body['title'],
#             'description': body['description'],
#             'price': body['price']
#         })
#         response2 = table2.put_item(Item={
#             'product_id': body['id'],
#             'count': body['count'],
#
#         })
#         return {
#             'statusCode': 201,
#             'body': json.dumps({'message': 'Product created successfully', 'product': body})
#         }
#     except ClientError as e:
#         # Обрабатываем возможные ошибки во время записи в таблицу
#         return {
#             'statusCode': 500,
#             'body': json.dumps({'error': str(e)})
#         }
#
#
