from dotenv import load_dotenv
load_dotenv()

import os
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
import pandas as pd

DB_URL = os.environ["DATABASE_URL"]
# single, non-pooling connection to avoid connection issues
engine = create_engine(DB_URL, poolclass=NullPool)

def place_in_db(df: pd.DataFrame, table_name: str) -> None:
    """
    Place the DataFrame into the database using SQLAlchemy & Pandas.
    """
    df.to_sql(table_name, engine, 
              if_exists='append', 
              index=False,
              method='multi')