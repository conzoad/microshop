import pytest
from fastapi.testclient import TestClient
from payment_service.main import app

client = TestClient(app)

def test_pay():
    resp = client.post("/pay", json={"amount": 100.0})
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
