import pytest
from fastapi.testclient import TestClient
from cart_service.main import app

client = TestClient(app)

def test_add_to_cart():
    user_id = 999
    item = {"product_id": 1, "quantity": 2}
    resp = client.post(f"/cart/{user_id}/add", json=item)
    assert resp.status_code == 200
    data = resp.json()
    assert "cart" in data
    assert len(data["cart"]) == 1
    assert data["cart"][0]["product_id"] == 1

    # Get cart
    get_resp = client.get(f"/cart/{user_id}")
    assert get_resp.status_code == 200
    assert len(get_resp.json()) == 1
