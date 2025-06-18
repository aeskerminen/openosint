import redis
import json
import subprocess
import time

r = redis.Redis(host='localhost', port=3004, decode_responses=True)

while True:
    job_data = r.blpop('ml:jobs', timeout=5)
    if job_data:
        _, raw_job = job_data
        job = json.loads(raw_job)

        job_id = job['jobID']
        input_path = job['inputPath']
        output_path = job['outputPath']

        try:
            r.set(f'status:{job_id}', 'processing')
            subprocess.run(['python3', 'dummy_inference.py', input_path, output_path], check=True)

            with open(output_path, 'r') as f:
                result = f.read()

            r.set(f'result:{job_id}', result, ex=300)
            r.set(f'status:{job_id}', 'done')
            #r.publish('ml:results', job_id)

        except Exception as e:
            r.set(f'status:{job_id}', 'error')
            r.set(f'result:{job_id}', str(e), ex=300)
