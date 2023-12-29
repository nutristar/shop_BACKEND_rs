import psycopg2

# Параметры подключения
host = "database-2.cbfoq7ivu7m6.us-east-1.rds.amazonaws.com"
# dbname = "mydatabasestack-instancec1063a87-koefkjpleiw7"
dbname = "postgres"
user = "postgres"
password = "123123123"
port = "5432"

# SQL для создания таблиц
create_tables_sql = """
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    count INT
);

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status VARCHAR(50)
);
"""

# Подключение к базе данных
# try:
#     conn = psycopg2.connect(
#         dbname=dbname, user=user, password=password, host=host, port=port
#     )
#     cur = conn.cursor()
#     cur.execute(create_tables_sql)
#     conn.commit()
#     cur.close()
#     print("Таблицы успешно созданы")
# except Exception as e:
#     print(f"Ошибка: {e}")
# finally:
#     if conn is not None:
#         conn.close()

# SQL для заполнения таблиц
insert_data_sql = """
INSERT INTO products (title, description, price) VALUES 
('Product 1', 'Description for Product 1', 9.99),
('Product 2', 'Description for Product 2', 19.99),
('Product 3', 'Description for Product 3', 29.99);

INSERT INTO cart_items (product_id, count) VALUES 
(1, 2),
(2, 3),
(3, 1);

INSERT INTO carts (user_id, created_at, updated_at, status) VALUES 
('user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'OPEN'),
('user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'OPEN');
"""

# Подключение к базе данных и выполнение запроса
try:
    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port) as conn:
        with conn.cursor() as cur:
            cur.execute(insert_data_sql)
            conn.commit()
            print("Данные успешно вставлены")
except Exception as e:
    print(f"Ошибка: {e}")


# -- Заполнение таблицы products
# INSERT INTO products (title, description, price) VALUES
# ('Product 1', 'Description for Product 1', 9.99),
# ('Product 2', 'Description for Product 2', 19.99),
# ('Product 3', 'Description for Product 3', 29.99);
#
# -- Заполнение таблицы cart_items
# INSERT INTO cart_items (product_id, count) VALUES
# (1, 2),
# (2, 3),
# (3, 1);
#
# -- Заполнение таблицы carts
# INSERT INTO carts (user_id, created_at, updated_at, status) VALUES
# ('user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'OPEN'),
# ('user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'OPEN');
