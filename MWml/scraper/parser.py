# scraper/parser.py

import pandas as pd
from scraper.clients import _genre_map
from scraper.clients import fetch_movie_details

def converted_movies(raw_json: dict) -> pd.DataFrame:
    """
    Convert the raw JSON data from TMDB into a DataFrame with:
      - tmdb_id       (int)
      - title         (str)
      - release_date  (datetime)
      - overview      (str)
      - popularity    (float)
      - rating        (float)
      - vote_count    (int)
      - runtime       (int)
    Rows with missing or unparsable release_date are dropped.
    """
    df = pd.json_normalize(raw_json.get("results", []))

    df = df[[
        "id",
        "title",
        "release_date",
        "genre_ids",
        "overview",
        "popularity",
        "vote_average",
        "vote_count"
    ]]

    df = df.rename(columns={
        "id": "tmdb_id",
        "vote_average": "rating"
    })

    df["release_date"] = pd.to_datetime(
        df["release_date"],
        format="%Y-%m-%d",
        errors="coerce"
    )

    df = df.dropna(subset=["release_date"])

    df["genre_names"] = df["genre_ids"].apply(
        lambda lst: [_genre_map.get(i, f"Unknown ({i})") for i in lst]
    )

    df["runtime"] = df["tmdb_id"].apply(
        lambda mid: fetch_movie_details(mid).get("runtime")
    )

    return df
