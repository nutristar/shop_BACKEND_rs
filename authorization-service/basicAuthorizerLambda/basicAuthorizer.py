import json
import os
import base64
from typing import Dict

def handler(event, context):
    print("Event:", json.dumps(event))

    if event["type"] != "TOKEN":
        raise Exception("Unauthorized")

    try:
        authorization_token = event['authorizationToken']
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




# print(lambda_handler(event))
# module.exports = async(event, ctx, cb) => {
#     console.log("Event:", JSON.stringify(event));
#
#     if (event["type"] !== "TOKEN") {
#         cb("Unauthorized");
#     }
#
#     try {
#         const authorizationToken = event.authorizationToken;
#         const encodedCreds = authorizationToken.split(" ")[1];
#         const buff = Buffer.from(encodedCreds, "base64");
#         const plainCreds = buff.toString("utf-8").split(":");
#         const username = plainCreds[0];
#         const password = plainCreds[1];
#
#         console.log(`username: ${username} and password: ${password}`);
#
#         const storedUserPassword = process.env[username];
#         const effect = !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";
#
#         const policy = generatePolicy(encodedCreds, event.methodArn, effect);
#
#         cb(null, policy);
#
#     } catch (e) {
#         cb(`Unauthorized: ${e.message}`);
#     }
# };
#
# const generatePolicy = (principalId, resource, effect = "Allow") => {
#     return {
#         principalId: principalId,
#         policyDocument: {
#             Version: "2012-10-17",
#             Statement: [
#                 {
#                     Action: "execute-api:Invoke",
#                     Effect: effect,
#                     Resource: resource
#                 }
#             ]
#         }
#     };
# };
#
#
# // nutristar=TEST_PASSWORD