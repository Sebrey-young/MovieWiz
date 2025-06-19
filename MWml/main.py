from dotenv import load_dotenv
load_dotenv()

from datetime import datetime
from scraper.clients import discover_top_by_year
from scraper.parser  import converted_movies
from scraper.loader  import place_in_db

def run_yearly_top(start_year: int = 1990):
    current_year = datetime.now().year
    for year in range(start_year, current_year + 1):
        print(f"\n▶ Fetching top movies for {year}…")
        raw = discover_top_by_year(year)
        df  = converted_movies(raw)

        if df.empty:
            print(f"⚠️  No results for {year}")
            continue

        place_in_db(df, "movies")
        print(f"✅ Inserted {len(df)} movies for {year}")

if __name__ == "__main__":
    run_yearly_top(1990)
