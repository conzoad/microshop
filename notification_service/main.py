from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Notification Service")

class NotificationRequest(BaseModel):
    user_id: int
    message: str

@app.post("/send")
async def send_notification(notif: NotificationRequest):
    print(f"SENDING EMAIL TO USER {notif.user_id}: {notif.message}")
    return {"status": "sent"}
