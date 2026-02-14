#!/bin/bash
# 部署 Market Watchlist 到 Cloudflare Pages

echo "=== 部署到 Cloudflare Pages ==="

# 1. 安装 Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "安装 Wrangler..."
    npm install -g wrangler
fi

# 2. 登录 Cloudflare
# wrangler login

# 3. 创建 wrangler.toml
cat > wrangler.toml << 'EOF'
name = "market-watchlist"
main = "api/data.py"
compatibility_date = "2024-01-01"

[site]
bucket = "./"
EOF

# 4. 部署
echo "部署中..."
wrangler pages deploy . --project-name=market-watchlist

echo "完成！访问地址: https://market-watchlist.pages.dev"
