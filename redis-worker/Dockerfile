FROM python:3.12-alpine

WORKDIR /worker

COPY . .

RUN apk add --no-cache build-base && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

CMD ["python", "-u", "worker.py"]

EXPOSE 3005
