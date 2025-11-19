import json
from kafka import KafkaConsumer
from ocr_engine import process_pdf
from kafka_producer import publish_ocr_completed

BROKER = "localhost:9092"
TOPIC_IN = "pdf.uploaded"

def start_consumer():
    print("📥 Listening to pdf.uploaded events...")

    consumer = KafkaConsumer(
        TOPIC_IN,
        bootstrap_servers=[BROKER],
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest",
        group_id="ocr-service"
    )

    for msg in consumer:
        data = msg.value
        print("📄 PDF Upload Event:", data)

        user_id = data["userId"]
        file_key = data["fileKey"]

        pages_text = process_pdf(file_key)

        publish_ocr_completed(user_id, file_key, pages_text)
