
export type StockPrice = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export type StockData = {
  [date: string]: StockPrice | number;
  currentPrice: number;
};

export const stockHistory: Record<string, StockData> = {
  "NIFTY50": {
    "2025-09-20": { "open": 19800, "high": 19950, "low": 19750, "close": 19850 },
    "2025-09-21": { "open": 19850, "high": 20000, "low": 19800, "close": 19950 },
    "2025-09-22": { "open": 19950, "high": 20100, "low": 19900, "close": 20050 },
    "currentPrice": 20050
  },
  "NIFTYNext50": {
    "2025-09-20": { "open": 45000, "high": 45200, "low": 44800, "close": 45100 },
    "2025-09-21": { "open": 45100, "high": 45350, "low": 45000, "close": 45250 },
    "2025-09-22": { "open": 45250, "high": 45500, "low": 45200, "close": 45400 },
    "currentPrice": 45400
  },
  "NIFTYMidcap150": {
    "2025-09-20": { "open": 7400, "high": 7500, "low": 7350, "close": 7450 },
    "2025-09-21": { "open": 7450, "high": 7550, "low": 7420, "close": 7500 },
    "2025-09-22": { "open": 7500, "high": 7600, "low": 7480, "close": 7580 },
    "currentPrice": 7580
  },
  "NIFTYBank": {
    "2025-09-20": { "open": 43500, "high": 43800, "low": 43300, "close": 43650 },
    "2025-09-21": { "open": 43650, "high": 44000, "low": 43500, "close": 43900 },
    "2025-09-22": { "open": 43900, "high": 44200, "low": 43850, "close": 44100 },
    "currentPrice": 44100
  },
  "NIFTYIT": {
    "2025-09-20": { "open": 29200, "high": 29500, "low": 29100, "close": 29350 },
    "2025-09-21": { "open": 29350, "high": 29600, "low": 29300, "close": 29550 },
    "2025-09-22": { "open": 29550, "high": 29800, "low": 29500, "close": 29750 },
    "currentPrice": 29750
  }
};
