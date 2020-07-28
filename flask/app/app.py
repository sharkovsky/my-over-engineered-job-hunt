from flask import Flask, request
from flask.json import jsonify
from bson.json_util import dumps
from bson.json_util import loads
from pymongo import MongoClient

app = Flask(__name__)

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
        return jsonify(dumps(list(db.test_collections.find({}).limit(5))))
    else:
        return 'Not yet supported'

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
