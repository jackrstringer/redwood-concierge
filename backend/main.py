from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Klaviyo Campaign API")
origins = [
    "http://localhost:8080",
    "http://localhost:8000",
    "http://ec2-13-53-199-145.eu-north-1.compute.amazonaws.com:8080"
]
# Import after creating the app
from api.routers import campaign, flow, jobs, kpi

# Include the routers
app.include_router(campaign.router, prefix="/api", tags=["campaigns"])
app.include_router(flow.router, prefix="/api", tags=["flows"])
app.include_router(jobs.router, prefix="/api", tags=["jobs"])
app.include_router(kpi.router, prefix="/api", tags=["kpi"])
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