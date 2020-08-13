FROM python:3.8-slim-buster

COPY ./requirements.txt ./requirements.txt

RUN pip install -r requirements.txt
RUN python -c "import nltk; nltk.download('punkt')"

ENTRYPOINT ["python", "/app/app.py"]
