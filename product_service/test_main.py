import pytest
from fastapi.testclient import TestClient
from product_service.main import app

client = TestClient(app)

def test_list_products():
    resp = client.get("/products")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

def test_create_and_delete_product():
    # Create
    new_prod = {"name": "Test Product", "price": 10.5}
    resp = client.post("/products", json=new_prod)
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Test Product"
    prod_id = data["id"]

    # Get
    get_resp = client.get(f"/products/{prod_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Test Product"

    # Delete
    del_resp = client.delete(f"/products/{prod_id}")
    assert del_resp.status_code == 200

    # Verify deleted
    get_resp_2 = client.get(f"/products/{prod_id}")
    assert get_resp_2.json() == {"error": "Product not found"}
