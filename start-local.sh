#!/bin/bash
# 本地启动 Market Watchlist

cd ~/.openclaw/workspace/market-watchlist-vercel

echo "=== 本地启动 Market Watchlist ==="
echo "访问地址: http://localhost:8080"
echo ""

# 使用 Python 启动本地服务器
python3 -m http.server 8080
