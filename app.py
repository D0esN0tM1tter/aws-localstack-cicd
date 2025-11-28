from flask import Flask, request, jsonify
import boto3
import json
import os

app = Flask(__name__)

# connect to local aws s3 :
s3_client = boto3.client(
    "s3" , 
    endpoint_url = "http://aws-localstack:4566" , 
    aws_access_key_id = "test" , 
    aws_secret_access_key = "test" , 
    region_name = "us-east-1 "
)



# create the bucket :
BUCKET_NAME = "todos-bucket"
s3_client.create_bucket(Bucket=BUCKET_NAME)

@app.route("/todos", methods=["POST"])
def add_todo():
    data = request.get_json()
    todo_id = str(len(s3_client.list_objects(Bucket=BUCKET_NAME).get('Contents', [])) + 1)
    s3_client.put_object(Bucket=BUCKET_NAME, Key=f"{todo_id}.json", Body=json.dumps(data))
    return jsonify({"message": "Todo added", "id": todo_id})

@app.route("/todos", methods=["GET"])
def list_todos():
    objects = s3_client.list_objects(Bucket=BUCKET_NAME).get('Contents', [])
    todos = []
    for obj in objects:
        content = s3_client.get_object(Bucket=BUCKET_NAME, Key=obj['Key'])['Body'].read().decode()
        todos.append(json.loads(content))
    return jsonify(todos)



if __name__ == "__main__" :
    app.run(host="0.0.0.0" , port=5000)