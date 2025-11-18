from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Cart Service")

# In-memory storage: {user_id: [items]}
carts = {}

class CartItem(BaseModel):
    product_id: int
    quantity: int

@app.get("/cart/{user_id}")
async def get_cart(user_id: int):
    return carts.get(user_id, [])

@app.post("/cart/{user_id}/add")
async def add_to_cart(user_id: int, item: CartItem):
    if user_id not in carts:
        carts[user_id] = []
    carts[user_id].append(item.dict())
    return {"message": "Item added", "cart": carts[user_id]}
