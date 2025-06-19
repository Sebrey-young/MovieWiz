import os
import pandas as pd
import joblib
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="MovieWiz Predictor")
# /health endpoint to check if the service is running
logging.basicConfig(level=logging.INFO)
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Global exception handler that logs errors and returns a 500 status code
@app.exception_handler(Exception)
def all_exception_handler(request, exc):
    logging.error(f"An error occurred: {exc}")
    return HTTPException(status_code=500, detail=str(exc))

model_file = os.path.join(os.path.dirname(__file__),
                           "models", "movie_rating_model_latest.joblib")
pipeline = joblib.load(model_file)

class PredictRequest(BaseModel):
    year: int
    runtime: float
    genre: str

class PredictResponse(BaseModel):
    predictedRating: float

@app.post("/api/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    df = pd.DataFrame([req.dict()])
    pred = pipeline.predict(df)[0]
    return PredictResponse(predictedRating=float(pred))

# This FastAPI application provides an endpoint to predict movie ratings.
# It uses a pre-trained machine learning model loaded from a file(train_model.py).