# from fastapi import FastAPI

# app = FastAPI(title="Klaviyo Campaign API")

# from app.api.routers import campaigns
# app.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
# # app.include_router(campaigns.router, prefix="/api", tags=["campaigns"])

# app/main.py
from fastapi import FastAPI

app = FastAPI(title="Klaviyo Campaign API")

# Import after creating the app
from app.api.routers import campaign

# Include the router
app.include_router(campaign.router, prefix="/campaigns", tags=["campaigns"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Klaviyo Campaign API"}