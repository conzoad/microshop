from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Payment Service")

class PaymentRequest(BaseModel):
    amount: float

@app.post("/pay")
async def process_payment(payment: PaymentRequest):
    print(f"Processing payment of ${payment.amount}")
    return {"status": "success", "transaction_id": "tx_98765"}
