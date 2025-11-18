import pytest
from fastapi.testclient import TestClient
from notification_service.main import app

client = TestClient(app)

def test_send_notification():
    resp = client.post("/send", json={"user_id": 1, "message": "Hello"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "sent"