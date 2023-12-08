# import boto3
# from botocore.config import Config
# from botocore.exceptions import ClientError
# import json
# import re
#
# #!!!!!!!!!!!!!!!     importProductsFile    !!!!!!!!!!!!!!!!!!!!!
#
# def handler1(event, context):
#     # Получаем параметр 'name' из строки запроса
#     name = event.get('queryStringParameters', {}).get('name')
#
#     # Проверяем, что параметр 'name' существует и имеет расширение .csv
#     if name and re.match(r'^[\w,\s-]+\.[Cc][Ss][Vv]$', name):
#         try:
#             # Создание клиента S3 с учетными данными и конфигурацией
#             s3_client = boto3.client('s3', config=Config(region_name='us-east-1'))
#
#             # Генерация подписанного URL для доступа к объекту в течение 300 секунд (5 минут)
#             signed_url = s3_client.generate_presigned_url(
#                 ClientMethod='put_object',
#                 Params={
#                     'Bucket': 'lunaxxximportservicebacket',
#                     'Key': f'uploaded/{name}'  # Используем параметр 'name' для создания ключа объекта
#                 },
#                 ExpiresIn=300
#             )
#             headers = {
#                 "Access-Control-Allow-Origin": "*",  # Разрешает запросы с любого домена
#                 "Access-Control-Allow-Methods": "OPTIONS, GET",  # Указывает разрешенные методы
#                 "Access-Control-Allow-Headers": "Content-Type"  # Указывает разрешенные заголовки
#             }
#
#             # Возвращаем подписанный URL в теле ответа
#             return {
#                 'statusCode': 200,
#                 'headers': headers,
#                 'body': json.dumps({'url': signed_url})
#             }
#         except ClientError as e:
#             # Обработка ошибок, возникающих при работе с S3
#             return {
#                 'statusCode': 500,
#                 'body': json.dumps({'error': str(e)})
#             }
#     elif name:
#         # Если имя файла не соответствует требуемому формату (.csv), возвращаем сообщение об ошибке
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': "The 'name' parameter must be a .csv file"})
#         }
#     else:
#         # Если параметр 'name' не передан, возвращаем сообщение об ошибке
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': "Query string parameter 'name' not found"})
#         }

# /import?name=sheet.csv,


