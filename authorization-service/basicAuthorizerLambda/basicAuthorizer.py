import json
import os
import base64
from typing import Dict


def handler(event, context):
    print("Event:", json.dumps(event))

    if event["type"] != "TOKEN":
        raise Exception("Unauthorized")

    try:

        authorization_token = event["authorizationToken"]

        encoded_creds = authorization_token.split(" ")[1]
        plain_creds = base64.b64decode(encoded_creds).decode("utf-8").split(":")
        username, password = plain_creds[0], plain_creds[1]

        print(f"username: {username} and password: {password}")

        stored_user_password = os.environ.get(username)
        effect = "Allow" if stored_user_password == password else "Deny"

        policy = generate_policy(encoded_creds, event['methodArn'], effect)
        return policy

    except Exception as e:
        raise Exception(f"Unauthorized: {str(e)}")


def generate_policy(principal_id, resource, effect="Allow") -> Dict:
    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": resource
                }
            ]
        }
    }

#
# // nutristar=TEST_PASSWORD


# Basic bnV0cmlzdGFyOlRFU1RfUEFTU1dPUkQ=

#