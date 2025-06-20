FROM python:3.12-alpine

WORKDIR /worker

COPY . .

RUN apk add  build-base && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

CMD ["python", "-u", "worker.py"]