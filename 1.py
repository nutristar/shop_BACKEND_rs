# import base64
#
# # Ваши учетные данные
#
# username = 'nutristar'
# password = 'TEST_PASSWORD'
#
# # Создание токена
# token = base64.b64encode(f'{username}:{password}'.encode()).decode()
#
# # Пример использования токена в заголовке
# authorization_header = f'Basic {token}'
#
# print(authorization_header)
#
# # Basic bnV0cmlzdGFyOlRFU1RfUEFTU1dPUkQ=
# event = {
#     "type": "TOKEN",
#     "methodArn": "arn:aws:execute-api:us-east-1:761576343621:c3m2l80woe/prod/GET/import",
#     "authorizationToken": "Basic bnV0cmlzdGFyOlRFU1RfUEFTU1dPUkQ="
# }
# import json
# import os
# import base64
# from typing import Dict
#
# def handler(event):
#     print("Event:", json.dumps(event))
#
#     if event["type"] != "TOKEN":
#         raise Exception("Unauthorized")
#
#     try:
#         authorization_token = event['authorizationToken']
#         encoded_creds = authorization_token.split(" ")[1]
#         plain_creds = base64.b64decode(encoded_creds).decode("utf-8").split(":")
#         username, password = plain_creds[0], plain_creds[1]
#
#         print(f"username: {username} and password: {password}")
#
#         stored_user_password = os.environ.get(username)
#         effect = "Allow" if stored_user_password == password else "Deny"
#
#         policy = generate_policy(encoded_creds, event['methodArn'], effect)
#         return policy
#
#     except Exception as e:
#         raise Exception(f"Unauthorized: {str(e)}")
#
#
# def generate_policy(principal_id, resource, effect="Allow") -> Dict:
#     return {
#         "principalId": principal_id,
#         "policyDocument": {
#             "Version": "2012-10-17",
#             "Statement": [
#                 {
#                     "Action": "execute-api:Invoke",
#                     "Effect": effect,
#                     "Resource": resource
#                 }
#             ]
#         }
#     }
#
# print(handler(event))


# Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/

import boto3
from botocore.exceptions import ClientError


def get_secret():

    secret_name = "InstanceSecret478E0A47-pHbZE85usBQ2"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = get_secret_value_response['SecretString']

    print(secret)


get_secret()
import boto3

def get_rds_instance_info(db_instance_identifier):
    rds_client = boto3.client('rds')
    try:
        response = rds_client.describe_db_instances(DBInstanceIdentifier=db_instance_identifier)
        return response['DBInstances'][0]  # Возвращает информацию о первом экземпляре в списке
    except Exception as e:
        print(f"Ошибка при получении данных о RDS экземпляре: {e}")
        return None

# Использование функции
# db_instance_identifier = "mydatabasestack-instancec1063a87-koefkjpleiw7"
# db_info = get_rds_instance_info(db_instance_identifier)
# if db_info:
#     print(db_info)
#
