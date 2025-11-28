from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import boto3
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

# Try to create bucket with error handling
def ensure_bucket_exists():
    try:
        s3_client.create_bucket(Bucket=BUCKET_NAME)
        print(f"Bucket '{BUCKET_NAME}' created successfully")
    except Exception as e:
        print(f"Bucket creation failed or bucket already exists: {e}")

# Don't create bucket on import - do it when first needed

@app.route("/todos", methods=["POST"])
def add_todo():
    ensure_bucket_exists()  # Ensure bucket exists before using it
    data = request.get_json()
    todo_id = str(len(s3_client.list_objects(Bucket=BUCKET_NAME).get('Contents', [])) + 1)
    s3_client.put_object(Bucket=BUCKET_NAME, Key=f"{todo_id}.json", Body=json.dumps(data))
    return jsonify({"message": "Todo added", "id": todo_id})

@app.route("/todos", methods=["GET"])
def list_todos():
    ensure_bucket_exists()  # Ensure bucket exists before using it
    objects = s3_client.list_objects(Bucket=BUCKET_NAME).get('Contents', [])
    todos = []
    for obj in objects:
        content = s3_client.get_object(Bucket=BUCKET_NAME, Key=obj['Key'])['Body'].read().decode()
        todos.append(json.loads(content))
    return jsonify(todos)

@app.route("/")
def index():
    return render_template("index.html")

# Debug route to test static file serving
@app.route("/debug/css")
def debug_css():
    return app.send_static_file('style.css')

if __name__ == "__main__" :
    app.run(host="0.0.0.0" , port=5000, debug=True)