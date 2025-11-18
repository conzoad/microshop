import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Order Service")

PAYMENT_SERVICE_URL = "http://payment_service:8005"
NOTIFICATION_SERVICE_URL = "http://notification_service:8006"

class OrderRequest(BaseModel):
    user_id: int
    items: list
    total_amount: float

@app.post("/orders")
async def create_order(order: OrderRequest):
    # 1. Process Payment
    async with httpx.AsyncClient() as client:
        payment_resp = await client.post(f"{PAYMENT_SERVICE_URL}/pay", json={"amount": order.total_amount})
        
        if payment_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Payment failed")
        
        # 2. Send Notification
        await client.post(f"{NOTIFICATION_SERVICE_URL}/send", json={"user_id": order.user_id, "message": "Order placed successfully!"})

    return {"order_id": 12345, "status": "confirmed"}
