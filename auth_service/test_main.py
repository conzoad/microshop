import pytest
from fastapi.testclient import TestClient
from auth_service.main import app

client = TestClient(app)

def test_register_and_login():
    # Register
    reg_resp = client.post("/register", json={"username": "testuser", "password": "testpassword"})
    assert reg_resp.status_code == 200
    assert reg_resp.json() == {"message": "User registered successfully"}

    # Login
    login_resp = client.post("/login", json={"username": "testuser", "password": "testpassword"})
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "token" in data
    assert data["username"] == "testuser"

def test_login_invalid():
    resp = client.post("/login", json={"username": "wrong", "password": "wrong"})
    assert resp.status_code == 401
