from flask import Flask, request, abort
from flask.json import jsonify
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps, loads
from threading import Lock
import logging
import numpy as np
from operator import itemgetter

from analysis_tools.cooccurrence import update_cooccurrence_matrix, get_counts_and_indices_data

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)
lock = Lock()

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
default_collection = db.checco_saved_jobs
latest_recorded_document = None

@app.errorhandler(404)
def page_not_found(e):
    print('Error Handler')
    print(e)
    if not e:
        return '404 Not Found'
    else:
        return jsonify(error=str(e)), 404

@app.route("/api/jobs", methods=['GET', 'POST'])
def handle_jobs_requests():
    if request.method == 'GET':
        minimum_schema_version = '1.0'
        get_filter = {'schema_version': {'$gte': minimum_schema_version}}
        limit = request.args.get('limit')
        if limit:
            response = jsonify(
                dumps(
                    list(
                        default_collection.find(get_filter).sort('_id', pymongo.DESCENDING).limit(int(limit))
                    )))
        else:
            response = jsonify(
                dumps(
                    list(
                        default_collection.find(get_filter).sort('_id', pymongo.DESCENDING)
                    )))
        return response
    elif request.method == 'POST':
        logging.info('Received POST request')
        new_job_data = loads(request.data)
        if 'test_app' in new_job_data['title']:
            new_job_data.update({'schema_version': '0.1'})
        else:
            new_job_data.update({'schema_version': '1.0'})
        logging.info(new_job_data)
        default_collection.insert_one(new_job_data)

        lock.acquire()
        update_cooccurrence_matrix(default_collection)
        lock.release()

        return request.data
    else:
        return 'Not yet supported'

@app.route("/resources/test")
def get_cooccurences_with_a_word():
    # 0. sanity-check query
    # 0a. a seed word must be specified.
    word = request.args.get('word')
    if not word:
        return abort(404, description='word is a required query argument.')

    counts, words_to_index = get_counts_and_indices_data()
    if counts is None or words_to_index is None:
        logging.info('counts was None type')
        lock.acquire()
        update_cooccurrence_matrix(default_collection)
        lock.release()
        counts, words_to_index = get_counts_and_indices_data()

    row = counts[words_to_index[word]]
    top_ten_word_indices = row.argsort()[-20:]
    logging.info(top_ten_word_indices.shape)
    array = np.array(list(words_to_index.keys()))
    list_of_words = array[top_ten_word_indices]
    return ' '.join([ str(x) + ':' + str(y) for x,y in zip(list_of_words[::-1], row[top_ten_word_indices[::-1]])])



if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
