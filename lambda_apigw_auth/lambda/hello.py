import json
import os

import boto3

ddb = boto3.resource("dynamodb")
table = ddb.Table(os.environ["HITS_TABLE_NAME"])


def handler(event, context):
    print("request: {}".format(json.dumps(event)))
    table.update_item(
        Key={"path": event["path"]}, UpdateExpression="ADD hits :incr", ExpressionAttributeValues={":incr": 1}
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "text/plain"},
        "body": "Good Afternoon Bac. You send path {} to dynamodb \n".format(event["path"]),
    }
