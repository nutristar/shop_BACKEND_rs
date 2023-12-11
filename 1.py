import csv
import json

# Убедитесь, что имя файла указано как строка
# with open('products-2.csv', newline='') as file:
with open('sheet.csv', newline='') as file:
    reader = csv.reader(file)
    for row in reader:
        # message_body = json.dumps(row)
        message_body = row
        print(type(message_body))
        print((message_body))

# import csv
# import json
#
# with open('products-2.csv', newline='') as file:
#     reader = csv.reader(file)
#
#     # Пропуск первой строки (заголовки)
#     next(reader)
#
#     for row in reader:
#         # Преобразуем строку в JSON, если это необходимо
#         # message_body = json.dumps(row)
#
#         message_body = row
#         print(type(message_body))
#         print(message_body)
