from http.server import BaseHTTPRequestHandler
import json
import requests
import time
from datetime import datetime

# 完整的ETF和资产配置
ETF_CONFIG = {
    '全球市场': ['ACWI', 'VT', 'ACWX'],
    '美国市场': ['VTI', 'SPY', 'QQQ'],
    '商品ETF': ['GLD', 'SLV', 'PPLT', 'PALL', 'DBC', 'GSG', 'GCC'],
    '发达市场': ['EFA', 'EZU', 'EWU', 'EWG', 'EWQ', 'EWI', 'EWP', 'EWC', 'EWJ'],
    '新兴市场': ['EEM', 'EMXC', 'EWY', 'EWS', 'EIDO', 'EZA', 'EWM', 'INDA', 'ARGT', 'VNM', 'EWW', 'EWZ', 'EWT'],
    '中国市场': ['MCHI', 'FXI', 'KWEB', 'ASHR'],
    '贵金属现货': ['XAU', 'XAG', 'XPT', 'XPD'],
    '工业金属': ['COPPER', 'ALUMINUM'],
    '能源': ['WTI', 'BRENT', 'NATGAS'],
    '加密货币': ['BTC', 'ETH', 'SOL'],
    '宏观指标': ['VIX', 'DXY', 'US10Y', 'US02Y', 'US30Y', 'T10Y2Y', 'HY_OAS']
}

# Stooq 代码映射 - 使用正确的合约代码
STOOQ_MAP = {
    # 贵金属 - 使用主连合约
    'XAU': 'GC.F',      # 黄金期货主连
    'XAG': 'SI.F',      # 白银期货主连
    'XPT': 'PL.F',      # 铂金期货主连
    'XPD': 'PA.F',      # 钯金期货主连
    # 工业金属
    'COPPER': 'HG.F',   # 铜期货主连
    'ALUMINUM': 'ALI.F', # 铝期货主连
    # 能源 - 使用期货主连
    'WTI': 'CL.F',      # WTI原油期货主连
    'BRENT': 'BZ.F',    # 布伦特原油期货主连
    'NATGAS': 'NG.F',   # 天然气期货主连
}

# Yahoo Finance 代码映射
YAHOO_MAP = {
    # ETF
    'ACWI': 'ACWI', 'VT': 'VT', 'ACWX': 'ACWX',
    'VTI': 'VTI', 'SPY': 'SPY', 'QQQ': 'QQQ',
    'GLD': 'GLD', 'SLV': 'SLV', 'PPLT': 'PPLT', 'PALL': 'PALL',
    'DBC': 'DBC', 'GSG': 'GSG', 'GCC': 'GCC',
    'EFA': 'EFA', 'EZU': 'EZU', 'EWU': 'EWU', 'EWG': 'EWG',
    'EWQ': 'EWQ', 'EWI': 'EWI', 'EWP': 'EWP', 'EWC': 'EWC', 'EWJ': 'EWJ',
    'EEM': 'EEM', 'EMXC': 'EMXC', 'EWY': 'EWY', 'EWS': 'EWS',
    'EIDO': 'EIDO', 'EZA': 'EZA', 'EWM': 'EWM', 'INDA': 'INDA',
    'ARGT': 'ARGT', 'VNM': 'VNM', 'EWW': 'EWW', 'EWZ': 'EWZ', 'EWT': 'EWT',
    'MCHI': 'MCHI', 'FXI': 'FXI', 'KWEB': 'KWEB', 'ASHR': 'ASHR',
    # 加密货币 (Yahoo)
    'BTC': 'BTC-USD', 'ETH': 'ETH-USD', 'SOL': 'SOL-USD',
    # 宏观指标
    'VIX': '^VIX', 'DXY': 'DX-Y.NYB',
    'US10Y': '^TNX', 'US02Y': '^IRX', 'US30Y': '^TYX',
    'T10Y2Y': 'T10Y2Y', 'HY_OAS': 'BAMLH0A0HYM2'
}

# 缓存
cache = {'data': {}, 'time': None}
CACHE_DURATION = 10  # 10秒缓存（强制刷新）

def fetch_stooq_data(symbol):
    """从 Stooq 获取数据（主要用于期货）"""
    try:
        stooq_symbol = STOOQ_MAP.get(symbol, symbol)
        # Stooq CSV API
        url = f"https://stooq.com/q/l/?s={stooq_symbol}&f=sd2t2ohlcv&h&e=csv"
        response = requests.get(url, timeout=15)
        
        if response.status_code == 200:
            lines = response.text.strip().split('\n')
            if len(lines) >= 2:
                # 解析CSV - 表头: Symbol,Date,Time,Open,High,Low,Close,Volume
                data_lines = lines[1:]  # 跳过表头
                prices = []
                for line in data_lines[:100]:  # 取最近100天
                    parts = line.split(',')
                    if len(parts) >= 7:  # 确保有足够的列
                        try:
                            # 处理 \r 字符并检查 N/D (无数据)
                            close_str = parts[6].strip().replace('\r', '')
                            if close_str in ['N/D', '', 'null', 'None']:
                                continue
                            close = float(close_str)  # Close 在索引 6
                            if close > 0:  # 确保价格有效
                                prices.append(close)
                        except (ValueError, IndexError):
                            continue
                
                if len(prices) >= 2:
                    current = prices[0]
                    prev = prices[1]
                    price_50 = prices[49] if len(prices) >= 50 else prices[-1]
                    price_5 = prices[4] if len(prices) >= 5 else prices[-1]
                    price_20 = prices[19] if len(prices) >= 20 else prices[-1]
                    ytd = prices[-1] if len(prices) >= 100 else prices[-1]
                    
                    return {
                        'price': current,
                        'change1d': ((current - prev) / prev) * 100,
                        'change50d': ((current - price_50) / price_50) * 100,
                        'rel5': ((current - price_5) / price_5) * 100,
                        'rel20': ((current - price_20) / price_20) * 100,
                        'ytd': ((current - ytd) / ytd) * 100,
                        'sparkline': list(reversed(prices[:20]))
                    }
        return None
    except Exception as e:
        print(f"Stooq error for {symbol}: {e}")
        return None

def fetch_yahoo_data(symbol):
    """从 Yahoo Finance 获取数据"""
    try:
        yahoo_symbol = YAHOO_MAP.get(symbol, symbol)
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{yahoo_symbol}"
        params = {'interval': '1d', 'range': '1y'}
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        data = response.json()
        
        if 'chart' not in data or 'result' not in data['chart'] or not data['chart']['result']:
            return None
        
        result = data['chart']['result'][0]
        prices = result['indicators']['quote'][0]['close']
        prices = [p for p in prices if p is not None]
        
        if len(prices) < 2:
            return None
        
        current_price = prices[-1]
        prev_price = prices[-2]
        price_50d = prices[-50] if len(prices) >= 50 else prices[0]
        price_5d = prices[-5] if len(prices) >= 5 else prices[0]
        price_20d = prices[-20] if len(prices) >= 20 else prices[0]
        ytd_price = prices[-250] if len(prices) >= 250 else prices[0]
        
        return {
            'price': current_price,
            'change1d': ((current_price - prev_price) / prev_price) * 100,
            'change50d': ((current_price - price_50d) / price_50d) * 100,
            'rel5': ((current_price - price_5d) / price_5d) * 100,
            'rel20': ((current_price - price_20d) / price_20d) * 100,
            'ytd': ((current_price - ytd_price) / ytd_price) * 100,
            'sparkline': prices[-20:]
        }
    except Exception as e:
        print(f"Yahoo error for {symbol}: {e}")
        return None

def fetch_mock_data(symbol):
    """生成模拟数据"""
    import hashlib
    h = int(hashlib.md5(symbol.encode()).hexdigest(), 16)
    base_price = 100 + (h % 2000)
    if symbol in ['XAU', 'GC.F']:
        base_price = 2000 + (h % 500)
    elif symbol in ['XAG', 'SI.F']:
        base_price = 20 + (h % 10)
    elif symbol in ['BTC', 'BTC-USD']:
        base_price = 60000 + (h % 20000)
    elif symbol in ['ETH', 'ETH-USD']:
        base_price = 3000 + (h % 1000)
    
    return {
        'price': base_price,
        'change1d': ((h % 100) - 50) / 10,
        'change50d': ((h % 100) - 50) / 5,
        'rel5': ((h % 60) - 30) / 10,
        'rel20': ((h % 160) - 80) / 10,
        'ytd': ((h % 400) - 100) / 10,
        'sparkline': [base_price + ((h + i) % 20 - 10) for i in range(20)]
    }

def fetch_symbol_data(symbol):
    """获取单个symbol的数据，优先尝试多个数据源"""
    # 1. 尝试 Stooq（主要用于期货和贵金属）
    if symbol in STOOQ_MAP:
        data = fetch_stooq_data(symbol)
        if data:
            return data
    
    # 2. 尝试 Yahoo Finance
    data = fetch_yahoo_data(symbol)
    if data:
        return data
    
    # 3. 使用模拟数据
    return fetch_mock_data(symbol)

def get_all_data():
    """获取所有数据"""
    global cache
    
    # 检查缓存
    if cache['time'] and (datetime.now() - cache['time']).seconds < CACHE_DURATION:
        return cache['data']
    
    all_tickers = [ticker for tickers in ETF_CONFIG.values() for ticker in tickers]
    data = {}
    
    print(f"Fetching data for {len(all_tickers)} symbols...")
    for i, ticker in enumerate(all_tickers):
        print(f"[{i+1}/{len(all_tickers)}] {ticker}...", end=' ')
        result = fetch_symbol_data(ticker)
        if result:
            data[ticker] = result
            print(f"✓ ${result['price']:.2f}")
        else:
            # 使用模拟数据
            data[ticker] = fetch_mock_data(ticker)
            print(f"✗ (mock)")
        time.sleep(0.3)  # 避免请求过快
    
    # 更新缓存
    cache['data'] = data
    cache['time'] = datetime.now()
    
    return data

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            data = get_all_data()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
