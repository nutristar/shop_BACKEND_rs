import unittest
from unittest.mock import patch
from moto import mock_s3
from botocore.exceptions import ClientError

import json
import boto3

# Теперь можно импортировать handler1
from lambda_function1 import handler1


class TestHandler1(unittest.TestCase):

    def setUp(self):
        # Настройка мока для S3
        self.mock_s3 = mock_s3()
        self.mock_s3.start()

        # Настройка тестового клиента S3 и создание тестового бакета
        self.s3_client = boto3.client('s3', region_name='us-east-1')
        self.s3_client.create_bucket(Bucket='xxximportservicebacket')

    def tearDown(self):
        # Остановка мока после каждого теста
        self.mock_s3.stop()
# ///////////////////////////////////////
    def test_handler_with_valid_csv_name(self):
        event = {
            'queryStringParameters': {'name': 'testfile.csv'}
        }
        response = handler1(event, None)
        self.assertEqual(response['statusCode'], 200)
        self.assertIn('url', json.loads(response['body']))

    def test_handler_with_invalid_file_name(self):
        event = {
            'queryStringParameters': {'name': 'testfile.txt'}
        }
        response = handler1(event, None)
        self.assertEqual(response['statusCode'], 400)
        self.assertIn('error', json.loads(response['body']))

    def test_handler_without_name_parameter(self):
        event = {
            'queryStringParameters': {}
        }
        response = handler1(event, None)
        self.assertEqual(response['statusCode'], 400)
        self.assertIn('error', json.loads(response['body']))

    @patch('lambda_function1.boto3.client')  # Мок boto3.client
    def test_handler_s3_error(self, mock_client):
        # Настройка мока для вызова исключения
        mock_client.return_value.generate_presigned_url.side_effect = ClientError(
            error_response={'Error': {'Message': 'Test Error'}},
            operation_name='get_object'
        )

        event = {
            'queryStringParameters': {'name': 'testfile.csv'}
        }
        response = handler1(event, None)
        self.assertEqual(response['statusCode'], 500)
        self.assertIn('error', json.loads(response['body']))

if __name__ == '__main__':
    unittest.main()
#