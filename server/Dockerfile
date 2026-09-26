FROM python:3.13-alpine

RUN apk add --no-cache firefox

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

ENV MOZ_HEADLESS=1

CMD ["fastapi", "run", "src/parsect/main.py", "--port", "80"]
