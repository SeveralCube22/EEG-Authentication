FROM amazon/aws-lambda-python:3.9

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ .

CMD [ "preprocess.handler" ]