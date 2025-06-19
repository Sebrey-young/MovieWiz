from fastapi.testclient import TestClient
import joblib
from scraper.ml_service import app

client = TestClient(app)

def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}

def test_predict():
    #mocks and uses a small pipeline
    resp  = client.post("/api/predict", json={
        "year": 2021,
        "runtime": 100,
        "genre" : "Comedy"
    })
    assert resp.status_code == 200
    body = resp.json()
    assert "predictedRating" in body
    assert isinstance(body["predictedRating"], float)