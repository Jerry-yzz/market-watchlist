#!/bin/bash
# 部署 Market Watchlist 到 Vercel

echo "=========================================="
echo "📊 Market Watchlist Vercel 部署助手"
echo "=========================================="
echo ""

# 检查 git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

cd "$(dirname "$0")"

# 初始化 git
echo "📝 初始化 Git 仓库..."
git init
git add .
git commit -m "Initial commit: Market Watchlist Dashboard"

echo ""
echo "=========================================="
echo "✅ 本地准备完成！"
echo "=========================================="
echo ""
echo "下一步操作:"
echo ""
echo "1. 创建 GitHub 仓库:"
echo "   访问 https://github.com/new"
echo "   仓库名: market-watchlist"
echo "   设置为 Public"
echo ""
echo "2. 推送代码到 GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/market-watchlist.git"
echo "   git push -u origin main"
echo ""
echo "3. 部署到 Vercel:"
echo "   访问 https://vercel.com/new"
echo "   选择你的 GitHub 仓库"
echo "   点击 Deploy"
echo ""
echo "4. 获得专属网址，手机电脑都能访问！"
echo ""
echo "=========================================="
