from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Product Service")

class Product(BaseModel):
    name: str
    price: float

products_db = [
    {"id": 1, "name": "Laptop", "price": 999.99},
    {"id": 2, "name": "Smartphone", "price": 699.99},
    {"id": 3, "name": "Headphones", "price": 199.99},
]

@app.get("/products")
async def list_products():
    return products_db

@app.get("/products/{product_id}")
async def get_product(product_id: int):
    for p in products_db:
        if p["id"] == product_id:
            return p
    return {"error": "Product not found"}

@app.post("/products")
async def create_product(product: Product):
    new_id = max(p["id"] for p in products_db) + 1 if products_db else 1
    new_product = {"id": new_id, "name": product.name, "price": product.price}
    products_db.append(new_product)
    return new_product

@app.put("/products/{product_id}")
async def update_product(product_id: int, product: Product):
    for i, p in enumerate(products_db):
        if p["id"] == product_id:
            products_db[i]["name"] = product.name
            products_db[i]["price"] = product.price
            return products_db[i]
    raise HTTPException(status_code=404, detail="Product not found")

@app.delete("/products/{product_id}")
async def delete_product(product_id: int):
    for i, p in enumerate(products_db):
        if p["id"] == product_id:
            del products_db[i]
            return {"message": "Product deleted"}
    raise HTTPException(status_code=404, detail="Product not found")
