front-end
https://d1bsnsxz97l83a.cloudfront.net/
https://github.com/nutristar/shop_FRONTEND_rs
##
Task 5.1
1. Create a new service called import-service -  done
2. In the AWS Console create and configure a new S3 bucket
with a folder called uploaded. -  done

### 

Task 5.2
1. Create a lambda function called importProductsFile under the Import Service which will be triggered by the HTTP GET method.
2. The requested URL should be /import.
3. Implement its logic so it will be expecting a request with a name of CSV file with products and creating a new Signed URL with the following key: uploaded/${fileName}.
4. The name will be passed in a query string as a name parameter and should be described in the AWS CDK Stack as a request parameter.
5. Update AWS CDK Stack with policies to allow lambda functions to interact with S3.
6. The response from the lambda should be the created Signed URL.
7. The lambda endpoint should be integrated with the frontend by updating import property of the API paths configuration.
100% done
  https://cq5jiivqwc.execute-api.us-east-1.amazonaws.com/prod/import?name=sheet.csv

###
Task 5.3
1. Create a lambda function called importFileParser under the Import Service which will be triggered by an S3 event.
2. The event should be s3:ObjectCreated:*
3. Configure the event to be fired only by changes in the uploaded folder in S3.
4. The lambda function should use a readable stream to get an object from S3, parse it using csv-parser package and log each record to be shown in CloudWatch.
5. At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder (move the file means that file should be copied into a new folder in the same bucket called parsed, and then deleted from uploaded folder)
 100%  done 
### 


 At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder (move the file means that file should be copied into a new folder in the same bucket called parsed, and then deleted from uploaded folder) - yes

###
100/100

uploaded/${fileName}