import os
import boto3
import base64
from botocore.exceptions import ClientError



AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')


# Create a session using the credentials and region
session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)


def get_secret(secret_name):
    client = session.client('secretsmanager')

    try:
        # Fetch the secret value
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name)

        # Decrypts secret using the associated KMS key.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            secret = base64.b64decode(
                get_secret_value_response['SecretBinary'])

        return secret

    except ClientError as e:
        raise e


def get_parameter(parameter_name):
    client = session.client('ssm')

    try:
        # Fetch the parameter value
        parameter = client.get_parameter(
            Name=parameter_name, WithDecryption=True)
        return parameter['Parameter']['Value']

    except ClientError as e:
        raise e