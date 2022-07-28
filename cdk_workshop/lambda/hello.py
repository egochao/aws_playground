import json


def handler(event, context):
    print("request: {}".format(json.dumps(event)))
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "text/plain"},
        "body": "Good Afternoon Bac. You build your first cdk app {}\n".format(event["path"]),
    }
