import pandas as pd
import re

def clean_text(raw_text: str) -> str:
    series = pd.Series([raw_text])
    series = series.str.lower()
    series = series.str.replace(r'[^a-z0-9\s\+\#\.]', ' ', regex=True)
    series = series.str.replace(r'\s+', ' ', regex=True)
    series = series.str.strip()
    return series[0]