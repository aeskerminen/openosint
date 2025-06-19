FROM python:3.12-slim
WORKDIR /worker
COPY . .
RUN pip install --no-cache-dir redis
CMD ["python", "worker.py"]
