
x={ 'pathParameters': {'productId': '1'}, 'stageVariables': None, 'requestContext': {'resourceId': 'no9h8m', 'resourcePath': '/products/{productId}', 'httpMethod': 'GET', 'extendedRequestId': 'O5mhcErUIAMENjA=', 'requestTime': '24/Nov/2023:11:09:35 +0000', 'path': '/dev/products/1', 'accountId': '761576343621', 'protocol': 'HTTP/1.1', 'stage': 'dev', 'domainPrefix': 'h439o1jara', 'requestTimeEpoch': 1700824175372, 'requestId': 'a88f4bf8-58a0-4166-8cb8-9bcd9a5ca152', 'identity': {'cognitoIdentityPoolId': None, 'accountId': None, 'cognitoIdentityId': None, 'caller': None, 'sourceIp': '89.64.21.119', 'principalOrgId': None, 'accessKey': None, 'cognitoAuthenticationType': None, 'cognitoAuthenticationProvider': None, 'userArn': None, 'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 'user': None}, 'domainName': 'h439o1jara.execute-api.us-east-1.amazonaws.com', 'apiId': 'h439o1jara'}, 'body': None, 'isBase64Encoded': False}



product_id = x['pathParameters']['productId']

# print(type(product_id))
# print(product_id)


import  boto3
import json
#
# print(event)
# # Extract 'productId' from the path parameters
# product_id = event['pathParameters']['productId']
product_id = "e00a8aae-48a8-418a-a16d-8b3c0f14f362"

# Инициализируем клиент DynamoDB
dynamodb = boto3.resource('dynamodb')

# Ссылка на таблицу DynamoDB
table = dynamodb.Table('products')


# response = table.get_item(Key={'id': str(product_id)})
# response = table.get_item(Key={'id': product_id})
response = table.query(
    IndexName='id-index',
    KeyConditionExpression='id = :id',
    ExpressionAttributeValues={':id': product_id}
)



# response = table.scan()
# stocks2 = response['Items']

# response = table.get_item(Key={'id': int(product_id)})

print(f"responce --- {response['Items'][0]}" )
# if 'Item' in response:

