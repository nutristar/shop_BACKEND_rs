##
frontend - https://d1bsnsxz97l83a.cloudfront.net/
https://github.com/nutristar/shop_FRONTEND_rs

Task4.1
products DB creation - done
stocks DB   creation - done
script to fill tables with test datas - ./db_pocessing/testing_data_creating.py
### 
Task4.2
1 Extend your AWS CDK Stack with data about your database table and pass it to lambda’s environment variables section. - done
2 Integrate the getProductsList lambda to return via GET /products request a list of products from the database 
(joined stocks and products tables). - done  in folder BE_logic/lambda_function.py
3  One product model as a result of BE models join (product and it's stock) - done
4 Integrate the getProductsById lambda to return
via GET /products/{productId} request a single product from the database.  - done
Also you can check this function here https://d1bsnsxz97l83a.cloudfront.net/ , down of this page you can finde drop-down menu - please chooose number from 1 to 6 and press Submit button
code lockated - BE_logic2/get_product_id.py


###
Task 4.3
Done - code of function located in BE_logic3
endpoint - "https://h439o1jara.execute-api.us-east-1.amazonaws.com/dev/products"
to check how it works execute code in ./db_processing/1.py  -  and you will see that the new item apeared in db


### 
Additional (optional) tasks
POST /products lambda functions returns error 400 status code if product data is invalid - yes
All lambdas return error 500 status code on any error (DB connection, any unhandled error in code) - yes
All lambdas do console.log for each incoming requests and their arguments - yes, in python it is "print"
Transaction based creation of produc... - yes,  Atomicity implemented due to         client.transact_write_items(TransactItems=transact_items)

###
100/100