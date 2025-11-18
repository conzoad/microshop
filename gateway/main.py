import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs (mapped via Docker Compose service names)
AUTH_SERVICE_URL = "http://auth_service:8001"
PRODUCT_SERVICE_URL = "http://product_service:8002"
CART_SERVICE_URL = "http://cart_service:8003"
ORDER_SERVICE_URL = "http://order_service:8004"

async def proxy_request(url: str, method: str, data: dict = None, headers: dict = None):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(method, url, json=data, headers=headers)
            return response.json(), response.status_code
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Service unavailable")

@app.get("/")
async def root():
    return {"message": "Welcome to MicroShop API Gateway"}

# --- Auth Routes ---
@app.post("/auth/login")
async def login(request: Request):
    data = await request.json()
    resp, status = await proxy_request(f"{AUTH_SERVICE_URL}/login", "POST", data)
    return JSONResponse(content=resp, status_code=status)

@app.post("/auth/register")
async def register(request: Request):
    data = await request.json()
    resp, status = await proxy_request(f"{AUTH_SERVICE_URL}/register", "POST", data)
    return JSONResponse(content=resp, status_code=status)

# --- Product Routes ---
@app.get("/products")
async def get_products():
    resp, status = await proxy_request(f"{PRODUCT_SERVICE_URL}/products", "GET")
    return JSONResponse(content=resp, status_code=status)

@app.post("/admin/products")
async def create_product(request: Request):
    data = await request.json()
    resp, status = await proxy_request(f"{PRODUCT_SERVICE_URL}/products", "POST", data)
    return JSONResponse(content=resp, status_code=status)

@app.put("/admin/products/{product_id}")
async def update_product(product_id: int, request: Request):
    data = await request.json()
    resp, status = await proxy_request(f"{PRODUCT_SERVICE_URL}/products/{product_id}", "PUT", data)
    return JSONResponse(content=resp, status_code=status)

@app.delete("/admin/products/{product_id}")
async def delete_product(product_id: int):
    resp, status = await proxy_request(f"{PRODUCT_SERVICE_URL}/products/{product_id}", "DELETE")
    return JSONResponse(content=resp, status_code=status)

# --- Cart Routes ---
@app.get("/cart/{user_id}")
async def get_cart(user_id: int):
    resp, status = await proxy_request(f"{CART_SERVICE_URL}/cart/{user_id}", "GET")
    return JSONResponse(content=resp, status_code=status)

@app.post("/cart/{user_id}/add")
async def add_to_cart(user_id: int, request: Request):
    data = await request.json()
    resp, status = await proxy_request(f"{CART_SERVICE_URL}/cart/{user_id}/add", "POST", data)
    return JSONResponse(content=resp, status_code=status)

# --- Order Routes ---
@app.post("/orders")
async def create_order(request: Request):
    data = await request.json()
    resp, status = await proxy_request(f"{ORDER_SERVICE_URL}/orders", "POST", data)
    return JSONResponse(content=resp, status_code=status)
