# pip install pytest moto boto3

import json
import pytest
from moto import mock_dynamodb, mock_sns
from lambda_function6 import lambda_handler  # Импортируйте вашу функцию
import boto3

# Мокируем сервисы DynamoDB и SNS
@mock_dynamodb
@mock_sns
def setup_mocks():
    # Инициализация клиента DynamoDB
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

    # Создание моковой таблицы Products
    products_table = dynamodb.create_table(
        TableName='products',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )

    # Создание моковой таблицы Stocks
    stocks_table = dynamodb.create_table(
        TableName='stocks',
        KeySchema=[
            {
                'AttributeName': 'product_id',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'product_id',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )

    # Ждем, пока таблицы будут созданы
    products_table.meta.client.get_waiter('table_exists').wait(TableName='products')
    stocks_table.meta.client.get_waiter('table_exists').wait(TableName='stocks')

    # Инициализация клиента SNS
    sns_client = boto3.client('sns', region_name='us-east-1')
    # Создание моковой темы SNS
    response = sns_client.create_topic(Name='create-product-topic')
    topic_arn = response['TopicArn']  # Сохраняем ARN созданной темы для использования в тестах


def test_lambda_handler_success():
    setup_mocks()

    event = {
      "Records": [
        {
          "messageId": "d17e98ea-900e-4f13-b347-641b7d87fdbe",
          "body": json.dumps({
            "description": "BYCIKLE small green",
            "price": "476",
            "title": "BYCIKLE small green",
            "count": "3663"
          })
        },
        {
          "messageId": "b23bbd4e-123b-4c36-a456-789d7fe2b123",
          "body": json.dumps({
            "description": "ANOTHER ITEM",
            "price": "500",
            "title": "ANOTHER ITEM TITLE",
            "count": "100"
          })
        }
      ]
    }

    response = lambda_handler(event, None)
    assert response['statusCode'] == 200
    # Дополнительные проверки на содержание ответа

def test_lambda_handler_missing_fields():
    setup_mocks()

    event = {
      "Records": [
        {
          "messageId": "12345",
          "body": json.dumps({
            "title": "Missing other fields"
          })
        }
      ]
    }

    response = lambda_handler(event, None)
    assert response['statusCode'] == 400
    # Дополнительные проверки на сообщение об ошибке


# pytest test_lambda.py
