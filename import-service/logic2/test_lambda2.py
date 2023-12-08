import unittest
from unittest.mock import patch, mock_open
from moto import mock_s3
import boto3
from lambda_function2 import handler  #

class TestHandlerFunction(unittest.TestCase):
    def setUp(self):
        self.mock_s3 = mock_s3()
        self.mock_s3.start()
        self.s3_client = boto3.client('s3', region_name='us-east-1')
        self.s3_client.create_bucket(Bucket='test-bucket')

    def tearDown(self):
        self.mock_s3.stop()

    @patch('builtins.open', new_callable=mock_open, read_data='data')
    def test_handler_success(self, mock_file):
        # Подготовка тестового события S3
        event = {
            'Records': [{
                's3': {
                    'bucket': {'name': 'test-bucket'},
                    'object': {'key': 'uploaded/test.csv'}
                }
            }]
        }

        #
        self.s3_client.put_object(Bucket='test-bucket', Key='uploaded/test.csv', Body='test,data')

        # Вызов обработчика
        response = handler(event, None)

        # Проверки
        self.assertEqual(response, {'status': 'File processed and moved successfully'})
        mock_file.assert_called_with('/tmp/test.csv')  # Проверка вызова чтения файла



if __name__ == '__main__':
    unittest.main()
