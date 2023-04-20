import boto3
import json
import os
import sys
import joblib
import pickle
import tarfile
import sagemaker
from sagemaker.estimator import Estimator
import time
from time import gmtime, strftime
import subprocess
import argparse

def parse_aws_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--access_id', '-id', help="Your AWS Client Id", type= str)
    parser.add_argument('--secret_key', '-key', help="Your AWS Secret Key", type=str)
    parser.add_argument('--arn', '-arn', help="Sagemaker ARN role", type=str)
    parser.add_argument('--region', '-r', help="Your AWS Region", type=str)
    args = parser.parse_args()

    return args.access_id, args.secret_key, args.arn, args.region\

def init_session(region, aws_access_key_id, aws_secret_access_key):
    return boto3.session.Session(region_name=region, aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

def upload_model(boto_session):
    s3 = boto_session.resource('s3')

    bashCommand = "tar -cvpzf model.tar.gz MODEL/model.joblib MODEL/inference.py -C MODEL ."
    process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()

    bucket_name = 'eeg-model'

    model_artifacts = f"s3://{bucket_name}/model.tar.gz"
    response = s3.meta.client.upload_file('model.tar.gz', bucket_name, 'model.tar.gz')

    return model_artifacts

def retrieve_image(region):
    return sagemaker.image_uris.retrieve(
        framework="sklearn",
        region=region,
        version="0.23-1",
        py_version="py3",
        instance_type="ml.t3.medium"
    )

def create_sagemaker_model(client, image_uri, model_artifacts, role, model_name):
    create_model_response = client.create_model(
        ModelName=model_name,
        Containers=[
            {
                "Image": image_uri,
                "Mode": "SingleModel",
                "ModelDataUrl": model_artifacts,
                "Environment": {'SAGEMAKER_SUBMIT_DIRECTORY': model_artifacts,
                                'SAGEMAKER_PROGRAM': 'inference.py'}
            }
        ],
        ExecutionRoleArn=role,
    )
    print("Model Arn: " + create_model_response["ModelArn"])

def create_sagemaker_endpoint(client, model_name, epc_name, ep_name):
    endpoint_config_response = client.create_endpoint_config(
        EndpointConfigName=epc_name,
        ProductionVariants=[
            {
                "VariantName": "sklearnvariant",
                "ModelName": model_name,
                "InstanceType": "ml.c5.large",
                "InitialInstanceCount": 1
            },
        ],
    )

    print("Endpoint Configuration Arn: " + endpoint_config_response["EndpointConfigArn"])

    create_endpoint_response = client.create_endpoint(
        EndpointName=ep_name,
        EndpointConfigName=epc_name,
    )
    print("Endpoint Arn: " + create_endpoint_response["EndpointArn"])

    #Monitor creation
    describe_endpoint_response = client.describe_endpoint(EndpointName=ep_name)
    while describe_endpoint_response["EndpointStatus"] == "Creating":
        describe_endpoint_response = client.describe_endpoint(EndpointName=ep_name)
        print(describe_endpoint_response["EndpointStatus"])
        time.sleep(15)
    print(describe_endpoint_response)

def main():
    aws_access_key_id, aws_secret_access_key, arn, region = parse_aws_args()

    boto_session = init_session(region, aws_access_key_id, aws_secret_access_key)

    model_artifacts = upload_model(boto_session)

    client = boto3.client(service_name="sagemaker", region_name=region, aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
    runtime = boto3.client(service_name="sagemaker-runtime", region_name=region)
    sagemaker_session = sagemaker.Session(boto_session)

    model_name = 'eeg-model'
    epc_name = 'eeg-epc'
    ep_name = 'eeg-ep'

    image_uri = retrieve_image(region)
    create_sagemaker_model(client, image_uri, model_artifacts, arn, model_name)
    create_sagemaker_endpoint(client, model_name, epc_name, ep_name)


if __name__ == '__main__':
    main()