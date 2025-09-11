from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Klaviyo Campaign API")
origins = [
    "http://localhost:8080",
    "http://localhost:8000",
]
# Import after creating the app
from api.routers import campaign

# Include the router
app.include_router(campaign.router, prefix="/api", tags=["campaigns"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Welcome to Klaviyo Campaign API"}