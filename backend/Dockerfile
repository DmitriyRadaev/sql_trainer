FROM python:3.9-slim

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn flask-cors

COPY . .


CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]