import json
from kafka import KafkaProducer

BROKER = "localhost:9092"
TOPIC_OUT = "pdf.ocr.completed"

producer = KafkaProducer(
    bootstrap_servers=[BROKER],
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def publish_ocr_completed(user_id, file_key, pages):
    event = {
        "eventType": "pdf.ocr.completed",
        "userId": user_id,
        "fileKey": file_key,
        "pages": pages
    }
    producer.send(TOPIC_OUT, event)
    producer.flush()

    print("✅ OCR complete event published")
