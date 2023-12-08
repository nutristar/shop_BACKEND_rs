import boto3
import uuid

# Инициализация клиента DynamoDB
dynamodb = boto3.resource('dynamodb')

# Функция для добавления записи в таблицу products
def add_product(title, description, price):
    table = dynamodb.Table('products')
    product_id = str(uuid.uuid4())
    table.put_item(
       Item={
            'id': product_id,
            'title': title,
            'description': description,
            'price': price
        }
    )
    return product_id

# Функция для добавления записи в таблицу stocks
def add_stock(product_id, count):
    table = dynamodb.Table('stocks')
    table.put_item(
       Item={
            'product_id': product_id,
            'count': count
        }
    )

datas = [
    ["Jacket", "Good jacket description", 100],
    ["T-shirt", "Good T-shirt", 20],
    ["Jeans", "Good blue jeans", 50],
    ["Sneakers", "Comfortable sneakers", 80],
    ["Scarf", "Warm scarf", 25],
    ["Gloves", "Leather gloves", 45],
    ["Cap", "Stylish cap", 15],
    ["Sunglasses", "UV protection sunglasses", 60],
    ["Belt", "Leather belt", 30],
    ["Backpack", "Durable backpack", 70],
    ["Watch", "Elegant watch", 150],
    ["Wallet", "Leather wallet", 55],
    ["Socks", "Cotton socks", 5],
    ["Hoodie", "Comfortable hoodie", 65],
    ["Shorts", "Sport shorts", 35],
    ["Swimsuit", "Men's swimsuit", 40],
    ["Tie", "Silk tie", 25],
    ["Shirt", "Formal shirt", 50],
    ["Blazer", "Men's blazer", 120],
    ["Coat", "Winter coat", 200],
    ["Sweater", "Wool sweater", 90],
    ["Dress", "Evening dress", 130],
    ["Skirt", "Leather skirt", 85],
    ["Blouse", "Silk blouse", 60],
    ["Leggings", "Yoga leggings", 30],
    ["Boots", "Winter boots", 110],
    ["Slippers", "Comfortable slippers", 20],
    ["Hat", "Summer hat", 25],
    ["Bikini", "Two-piece bikini", 45],
    ["Raincoat", "Waterproof raincoat", 75],
    ["Sandals", "Beach sandals", 35]
]




for each in datas:

    product_id = add_product(each[0],each[1],each[2])
    add_stock(product_id, 10)

print("Тестовые данные добавлены.")
