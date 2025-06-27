import redis
import json
import subprocess
import time

print("Starting Redis worker...")

r = redis.Redis(host='redis', port=3004, decode_responses=True)

def fetchInference():
    otput_path = '/data/output/' + filename
    subprocess.run(['python', 'dummy_inference.py', input_path, otput_path], check=True)

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
        except Exception as e:
            r.set(f'status:{job_id}', 'error')
            r.set(f'result:{job_id}', str(e), ex=300)

        print(f"Job {job_id} processed successfully.")
