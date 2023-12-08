
##
link for rfontend - https://d1bsnsxz97l83a.cloudfront.net/

https://github.com/nutristar/shop_FRONTEND_rs

### 
Task 3.1
https://zwzhz3jrej.execute-api.us-east-1.amazonaws.com/prod/products/ - link for Task 3.1 api gateway

code of this lambda function getProductsList  located in folder BE_logic2


###
Task 3.2
https://zwzhz3jrej.execute-api.us-east-1.amazonaws.com/prod/products/1  - links for Task 3.2 API GATEwaY
https://zwzhz3jrej.execute-api.us-east-1.amazonaws.com/prod/products/2
https://zwzhz3jrej.execute-api.us-east-1.amazonaws.com/prod/products/{productId} - writte any number from 1 to 6 and get product information

Also you can check this function here  https://d1bsnsxz97l83a.cloudfront.net/  , down of this page
you can finde  drop-down menu - please chooose number from 1 to 6 and press Submit button

code of this lambda function getProductsById  located in folder BE_logic2

### 
Additional Tasks:

swagger -  api.yaml

UNIT tests - test_lambda_functions.py

Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase. - done (BE_logic   and   BE_logic2)

Main error scenarios are handled by API ("Product not found" error). -  implemented in getProductsList, getProductsById

###
Everything done
100/100
