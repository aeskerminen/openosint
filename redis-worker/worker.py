import redis
import json
import subprocess
import time
import requests
import os
from dotenv import load_dotenv

print("Starting Redis worker...")

r = redis.Redis(host='redis', port=3004, decode_responses=True)

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
INFERENCE_API_HOST = os.getenv('INFERENCE_API_HOST', '127.0.0.1')
INFERENCE_API_PORT = os.getenv('INFERENCE_API_PORT', '5001')

def fetchInference(input_path, filename):
    print("GOT THE JOB")
    output_path = '/data/output/' + filename
    api_url = f'http://{INFERENCE_API_HOST}:{INFERENCE_API_PORT}/run-inference'
    payload = {
        'input_path': input_path,
        'output_path': output_path
    }
    response = requests.post(api_url, json=payload, timeout=100)
    response.raise_for_status()
    result = response.json()
    print(f"Received response: {result}")
    if result.get('status') != 'success':
        raise Exception(f"Inference failed: {result.get('stderr')}")

while True:
    job_data = r.blpop('ml:jobs', timeout=5)
    if job_data:
        print(f"Received job data: {job_data}")
        _, raw_job = job_data
        job = json.loads(raw_job)

        job_id = job['jobID']
        input_path = job['inputPath']
        datapoint = job['datapoint']
        filename = datapoint['filename']

        try:
            r.set(f'status:{job_id}', 'processing')
            fetchInference(input_path, filename)
            r.set(f'status:{job_id}', 'done')
            r.publish('ml:results', job_id)
            print(f"Job {job_id} processed successfully.")
        except Exception as e:
            r.set(f'status:{job_id}', 'error')
            r.set(f'result:{job_id}', str(e), ex=300)
            print(f"Error processing job {job_id}: {e}")

