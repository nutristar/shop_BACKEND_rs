import json
import boto3
from botocore.exceptions import ClientError
import uuid

# Инициализируем клиент DynamoDB
dynamodb = boto3.resource('dynamodb')
products_table = dynamodb.Table('products')
stocks_table = dynamodb.Table('stocks')

# /////////// CatalogBatchProcess  /////////// CatalogBatchProcess  /////////// CatalogBatchProcess
client = boto3.client('dynamodb')

sns_client = boto3.client('sns')
topic_arn = 'arn:aws:sns:us-east-1:761576343621:create-product-topic'


def lambda_handler(event, context):
    print(f"this is event -------{event}")
    results = []
    for message in event['Records']:
        # Преобразуем тело сообщения из JSON

        message_list = json.loads(message["body"])  # Преобразуем строку в список
        message_body_str = message_list[0]  # Берем первый элемент списка
        message_body = json.loads(message_body_str)

        # message_body = json.loads(message["body"])
        if "id" not in message_body:
            message_body["id"] = str(uuid.uuid4())
            print("id appended")
        message["body"] = json.dumps(message_body)

        # Проверяем наличие всех необходимых полей в теле запроса
        required_fields = ['id', 'title', 'description', 'price', 'count']
        if not all(field in message_body for field in required_fields):
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields'})
            }

        # Создаем новый продукт и запись о запасе атомарно

        print(message_body)
        transact_items = [
            {
                'Put': {
                    'TableName': products_table.name,
                    'Item': {
                        'id': {'S': message_body['id']},
                        'title': {'S': message_body['title']},
                        'description': {'S': message_body['description']},
                        'price': {'S': message_body['price']}
                    }
                }
            },
            {
                'Put': {
                    'TableName': stocks_table.name,
                    'Item': {
                        'product_id': {'S': message_body['id']},
                        'count': {'N': str(message_body['count'])}
                    }
                }
            }
        ]
        try:
            client.transact_write_items(TransactItems=transact_items)
            message = {"info": "Products created", "products": message_body}  # Пример сообщения
            # sns_client.publish(TopicArn=topic_arn, Message=json.dumps(message))
            sns_client.publish(
                TopicArn=topic_arn,
                Message=json.dumps({'default': json.dumps(message)}),
                MessageAttributes={
                    'description': {
                        'DataType': 'String',
                        'StringValue': 'BYCIKLE'
                    }
                }
            )


            results.append({'message': 'Product and stock created successfully', 'product': message_body})

        except ClientError as e:
            results.append({'error': str(e)})
    return {
        'statusCode': 200,
        'body': json.dumps(results)
    }

#
#
# event={
#   "Records": [
#     {
#       "messageId": "d17e98ea-900e-4f13-b347-641b7d87fdbe",
#       "receiptHandle": "String",
#       "body": "{\n    \"description\": \"BYCIKLE small green\",\n    \"price\": \"476\",  \n    \"title\": \"BYCIKLE small green\",\n    \"count\": \"3663\"\n}",
#
#     },
#     {
#       "messageId": "b23bbd4e-123b-4c36-a456-789d7fe2b123",
#       "receiptHandle": "String",
#       "body": "{\n    \"description\": \"ANOTHER ITEM\",\n       \"price\": \"500\",\n    \"title\": \"ANOTHER ITEM TITLE\",\n    \"count\": \"100\"\n}",
#
#     }
#   ]
# }
#
#
# print(lambda_handler(event))