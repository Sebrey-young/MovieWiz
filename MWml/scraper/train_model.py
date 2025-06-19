import os
import pandas as pd
import joblib
import shutil
from sqlalchemy import create_engine
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

from dotenv import load_dotenv
load_dotenv()

print("train_model.py running...")

# Versioning the model
# IMPORTANT: DONT FORGET TO UPDATE THE VERSION NUMBER WHEN YOU RETRAIN THE MODEL!
def save_model(pipeline):
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)

    # Save versioned model to the models directory
    version = 2
    versioned_model = f"movie_rating_model_{version}.joblib"
    versioned_model_path = os.path.join(models_dir, versioned_model)

    #Dumps the new versioned model
    joblib.dump(pipeline, versioned_model_path)
    print(f"Model saved to {versioned_model_path}")

    #Update the latest copy
    latest_model_path = os.path.join(models_dir, "movie_rating_model_latest.joblib")
    shutil.copyfile(versioned_model_path, latest_model_path)
    print(f"Updated latest model at: {latest_model_path}")


def main():
    engine = create_engine(os.getenv("DATABASE_URL"))
    df = pd.read_sql("SELECT EXTRACT (YEAR FROM release_date)::int AS year, runtime, genre_names AS genre, rating FROM movies", engine)

    x  = df[["year", "runtime", "genre"]]
    y = df["rating"]

    ct = ColumnTransformer([
        ("num", "passthrough", ["year", "runtime"]),
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["genre"])
    ])
    pipeline = Pipeline([
        ("transform", ct),
        ("model", RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42
    )
    pipeline.fit(x_train, y_train)
    print(f"Train R^2: {pipeline.score(x_train, y_train):.3f}")
    print(f"Test R^2: {pipeline.score(x_test, y_test):.3f}")

    save_model(pipeline)
    

if __name__ == "__main__":
    main()

# This script trains a machine learning model to predict movie ratings based on year, runtime, and genre.
# It uses a Random Forest Regressor and saves the trained model to a file.