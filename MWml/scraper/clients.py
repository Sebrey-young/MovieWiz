from dotenv import load_dotenv
load_dotenv()

import os, time, requests
from datetime import date

API_KEY  = os.environ["TMDB_API_KEY"]
BASE_URL = "https://api.themoviedb.org/3"

def _get_with_retry(endpoint, params, retries=3, backoff=0.5):
    """GET with simple exponential-backoff retry logic."""
    for attempt in range(retries):
        resp = requests.get(f"{BASE_URL}{endpoint}", params=params)
        if resp.ok:
            return resp.json()
        if attempt < retries - 1:
            time.sleep(backoff * (2 ** attempt))
    resp.raise_for_status()

# Keep genre mapping intact
_genre_map = {
    g["id"]: g["name"]
    for g in _get_with_retry(
        "/genre/movie/list",
        {"api_key": API_KEY, "language": "en-US"}
    )["genres"]
}

def discover_top_by_year(year: int) -> dict:
    """
    Return the top 20 most popular movies for `year`,
    excluding any with a release_date after today.
    """
    today = date.today().isoformat()
    return _get_with_retry(
        "/discover/movie",
        {
            "api_key":                  API_KEY,
            "language":                 "en-US",
            "primary_release_year":     year,      
            "primary_release_date.lte": today,              
            "sort_by":                  "popularity.desc",
            "page":                     1          
        }
    )

def fetch_movie_details(movie_id: int) -> dict:
    """
    Fetch detailed info for one movie, including runtime.
    """
    return _get_with_retry(
        f"/movie/{movie_id}",
        {"api_key": API_KEY, "language": "en-US"}
    )