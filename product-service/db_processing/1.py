# datas = [["jacket", "good jacket  description", 100],
#          ["T-shirt",    "good t-shirt",         20],
#          ["Good",    "good new blu jeans",      50]
# ]
# # Добавление тестовых данных
# # product_id = add_product("Test Product", "This is a test product description", 100)
# # add_stock(product_id, 10)
# for each in datas:
#     print(each[0],each[1],each[2])

import requests
import json

# Эндпоинт API Gateway
url = "https://h439o1jara.execute-api.us-east-1.amazonaws.com/dev/products"

# Данные продукта для отправки
product_data = {
    "description": "BYCIKLE small green",
    "id": "2555554",
    "price": "476",
    "title": "BYCIKLE small green",
    "count": "3663"
}

# Отправляем POST запрос
response = requests.post(url, data=json.dumps(product_data), headers={"Content-Type": "application/json"})

#
print(response.text)

{
    "description": "BYCIKLE small green",
    "id": "2555554",
    "price": "476",
    "title": "BYCIKLE small green",
    "count": "3663"
}

