from fastapi import APIRouter
from app.services.analytics import get_market_analytics

router = APIRouter()

@router.get("/market")
def market_analytics():
    return get_market_analytics()