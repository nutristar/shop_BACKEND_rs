import boto3
import csv
import os
import json
# ////////////////////////////////importFileParser /////////////////
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')
# sqs_queue_url = os.environ['SQS_QUEUE_URL']  # URL очереди SQS
sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/761576343621/catalogItemsQueue'  # URL очереди SQS

def handler(event, context):
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        object_key = record['s3']['object']['key']

        # Убедиться, что файл находится в папке 'uploaded'
        if object_key.startswith('uploaded/'):
            tmp_key = object_key.replace('uploaded/', '')
            download_path = f'/tmp/{tmp_key}'
            upload_path = f'/tmp/parsed-{tmp_key}'

            # Скачивание файла во временную папку Lambda
            s3_client.download_file(bucket_name, object_key, download_path)

            with open(download_path) as file:
                reader = csv.reader(file)
                for row in reader:
                    # Отправка каждой строки CSV в очередь SQS
                    message_body = json.dumps(row)
                    sqs_client.send_message(QueueUrl=sqs_queue_url, MessageBody=message_body)

            # Перемещение файла в папку 'parsed' (копирование, затем удаление)
            s3_client.copy_object(Bucket=bucket_name,
                                  CopySource={'Bucket': bucket_name, 'Key': object_key},
                                  Key=object_key.replace('uploaded/', 'parsed/'))
            s3_client.delete_object(Bucket=bucket_name, Key=object_key)

    return {'status': 'File processed and moved to SQS successfully'}


# import boto3
# import csv
# import os
#
# s3_client = boto3.client('s3')
#
# # /////////  importFileParser  ////////////////////
#
# def handler(event, context):
#     # Получение информации об объекте из события S3
#     for record in event['Records']:
#         bucket_name = record['s3']['bucket']['name']
#         object_key = record['s3']['object']['key']
#
#         # Убедиться, что файл находится в папке 'uploaded'
#         if object_key.startswith('uploaded/'):
#             tmp_key = object_key.replace('uploaded/', '')
#             download_path = f'/tmp/{tmp_key}'
#             upload_path = f'/tmp/parsed-{tmp_key}'
#
#             # Скачивание файла во временную папку Lambda
#             s3_client.download_file(bucket_name, object_key, download_path)
#
#             # Чтение и обработка файла
#             with open(download_path) as file:
#                 reader = csv.reader(file)
#                 for row in reader:
#                     print(row)  # Логирование каждой строки в CloudWatch
#
#             # Перемещение файла в папку 'parsed' (копирование, затем удаление)
#             s3_client.copy_object(Bucket=bucket_name, CopySource={'Bucket': bucket_name, 'Key': object_key},
#                                   Key=object_key.replace('uploaded/', 'parsed/'))
#             s3_client.delete_object(Bucket=bucket_name, Key=object_key)
#
#     return {'status': 'File processed and moved successfully'}