import json
import pandas as pd
import numpy as np
import nltk
import re
from stop_words import get_stop_words
from collections import defaultdict

import logging

counts = None
words_to_index = None

def get_counts_and_indices_data():
    return counts, words_to_index

def clean_string(old_string):
    new_string = old_string.lower()
    new_string = re.sub(r'^https?:\/\/[^\s]*', '', new_string)
    new_string = re.sub(r'[^\w\s]', '', new_string)
    return new_string

def update_cooccurrence_matrix(collection):
    global counts
    global words_to_index

    minimum_schema_version = '1.0'
    get_filter = {'schema_version': {'$gte': minimum_schema_version}}
    data = collection.find(get_filter)

    data = data[:5]
    documents = [clean_string(x['description']) for x in data]
    tokenized_docs = [nltk.word_tokenize(x) for x in documents]

    stop_words = get_stop_words('en') + get_stop_words('fr') + get_stop_words('it') + ['will', 'etc', 'e.g']

    def remove_stopwords(list_of_tokens):
        return [x for x in list_of_tokens if x not in stop_words and len(x) >= 3]

    cleaned_docs = [remove_stopwords(x) for x in tokenized_docs]

    all_unique_words = {w for d in cleaned_docs for w in d}

    to_remove = set()
    for word in all_unique_words:
        num_appearances_in_doc = 0
        for d in cleaned_docs:
            unique_words_in_doc = set(d)
            num_appearances_in_doc += int(word in unique_words_in_doc)
        if num_appearances_in_doc <= 1:
            to_remove.add(word)
    all_unique_words = all_unique_words.difference(to_remove)
    N = len(all_unique_words)

    counts = np.zeros(shape=(N, N), dtype=int)
    words_to_index = dict(zip(list(all_unique_words), range(len(all_unique_words))))
    for word in all_unique_words:
        for d in cleaned_docs:
            unique_words_in_doc = set(d).difference(to_remove)
            partial_counts = np.zeros(shape=(1, N), dtype=int)
            if word in unique_words_in_doc:
                for w in unique_words_in_doc:
                    partial_counts[0, words_to_index[w]] += 1
            counts[words_to_index[word], :] += partial_counts[0, :]

    logging.info(f'python index: {words_to_index["python"]},\
        python counts {counts[words_to_index["python"], words_to_index["python"]]}')
    # all_words_counts = np.diag(counts)
    # sorting_indices = all_words_counts.argsort()[::-1]
    # counts = counts[sorting_indices,:]
    # counts = counts[:,sorting_indices]
    # words_to_index = dict(zip(list(all_unique_words), sorting_indices))
