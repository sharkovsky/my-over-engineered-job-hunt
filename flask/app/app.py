from flask import Flask, request
from flask.json import jsonify
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps, loads
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

with open('/run/secrets/mongodb_flask_username') as f:
    flask_username = f.readlines()[0].strip()
with open('/run/secrets/mongodb_flask_password') as f:
    flask_password = f.readlines()[0].strip()

client = MongoClient('jobs_db',
        27017,
        username=flask_username,
        password=flask_password,
        authSource='test_db')

db = client['test_db']

@app.route("/jobs", methods=['GET', 'POST'])
def handle_jobs_requests():
    if request.method == 'GET':
        minimum_schema_version = '1.0'
        get_filter = {'schema_version': {'$gte': minimum_schema_version}}
        limit = int(request.args.get('limit')) if request.args.get('limit') else 5
        response = jsonify(dumps(list(db.test_collections.find(get_filter).sort('_id', pymongo.DESCENDING).limit(limit))))
        return response
    elif request.method == 'POST':
        logging.info('Received POST request')
        new_job_data = loads(request.data)
        if 'test_app' in new_job_data['title']:
            new_job_data.update({'schema_version': '0.1'})
        else:
            new_job_data.update({'schema_version': '1.0'})
        logging.info(new_job_data)
        db.test_collections.insert_one(new_job_data)
        return request.data
    else:
        return 'Not yet supported'

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
