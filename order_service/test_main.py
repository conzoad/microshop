import pytest
import respx
from httpx import Response
from fastapi.testclient import TestClient
from order_service.main import app

client = TestClient(app)

@respx.mock
def test_create_order_success():
    # Mock Payment Service
    respx.post("http://payment_service:8005/pay").mock(return_value=Response(200, json={"status": "success"}))
    
    # Mock Notification Service
    respx.post("http://notification_service:8006/send").mock(return_value=Response(200, json={"status": "sent"}))

    order_data = {
        "user_id": 1,
        "items": [{"product_id": 1, "quantity": 1}],
        "total_amount": 100.0
    }
    
    resp = client.post("/orders", json=order_data)
    assert resp.status_code == 200
    assert resp.json()["status"] == "confirmed"

@respx.mock
def test_create_order_payment_fail():
    # Mock Payment Service Failure
    respx.post("http://payment_service:8005/pay").mock(return_value=Response(400, json={"detail": "Payment failed"}))

    order_data = {
        "user_id": 1,
        "items": [{"product_id": 1, "quantity": 1}],
        "total_amount": 100.0
    }
    
    resp = client.post("/orders", json=order_data)
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Payment failed"
