import unittest
from lambda_function import getProductsById, getProductsList  # Assume your lambda functions are in the create_product.py file

class TestLambdaFunctions(unittest.TestCase):
    
    def test_getProductsById_found(self):
        # Mock event with pathParameters
        event = {
            'pathParameters': {
                'productId': '2'
            }
        }
        context = None
        response = getProductsById(event, context)
        self.assertEqual(response['statusCode'], 200)
        self.assertIn('ProductTitle', response['body'])

    def test_getProductsById_not_found(self):
        # Mock event with pathParameters for a non-existent product
        event = {
            'pathParameters': {
                'productId': '999'  # Assuming this ID does not exist
            }
        }
        context = None
        response = getProductsById(event, context)
        self.assertEqual(response['statusCode'], 404)
        self.assertIn('Product not found', response['body'])

    def test_getProductsList(self):
        event = {}  # No pathParameters needed for list
        context = None
        response = getProductsList(event, context)
        self.assertEqual(response['statusCode'], 200)
        self.assertTrue(len(json.loads(response['body'])) > 0)

if __name__ == '__main__':
    unittest.main()



# python -m unittest test_lambda_functions.py
