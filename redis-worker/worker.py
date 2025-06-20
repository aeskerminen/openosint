import redis
import json
import subprocess
import time

print("Starting Redis worker...")

r = redis.Redis(host='redis', port=3004, decode_responses=True)

while True:
    job_data = r.blpop('ml:jobs', timeout=5)
    print("Waiting for job data...")
    if job_data:
        print(f"Received job data: {job_data}")
        _, raw_job = job_data
        job = json.loads(raw_job)

        job_id = job['jobID']
        input_path = job['inputPath']
        output_path = job['fileID']

        try:
            r.set(f'status:{job_id}', 'processing')
            subprocess.run(['python', 'dummy_inference.py', input_path, output_path], check=True)

            #with open(output_path, 'r') as f:
            #    result = f.read()

            #r.set(f'result:{job_id}', result, ex=300)
            r.set(f'status:{job_id}', 'done')
            r.publish('ml:results', job_id)

        except Exception as e:
            r.set(f'status:{job_id}', 'error')
            r.set(f'result:{job_id}', str(e), ex=300)

        print(f"Job {job_id} processed successfully.")    
