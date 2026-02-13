# 📊 市场追踪看板 - Market Watchlist

完整版全球资产追踪仪表板，支持股票ETF、商品、贵金属、能源、加密货币和宏观指标。

## 🌍 覆盖资产类别

| 类别 | 数量 | 示例 |
|------|------|------|
| 🌍 **全球市场ETF** | 3 | ACWI, VT, ACWX |
| 🇺🇸 **美国市场ETF** | 3 | VTI, SPY, QQQ |
| 🏭 **商品ETF** | 7 | GLD黄金, SLV白银, DBC商品指数 |
| 🏛️ **发达市场ETF** | 9 | 欧/英/德/法/日/加等 |
| 🌏 **新兴市场ETF** | 13 | 中韩/印度/巴西/台湾等 |
| 🇨🇳 **中国市场ETF** | 4 | MCHI, FXI, KWEB, ASHR |
| 🥇 **贵金属现货** | 4 | 黄金/白银/铂金/钯金 |
| ⚙️ **工业金属** | 2 | 铜/铝期货 |
| ⛽ **能源** | 3 | WTI原油/布伦特原油/天然气 |
| ₿ **加密货币** | 3 | BTC/ETH/SOL |
| 📊 **宏观指标** | 7 | VIX/美元指数/美债收益率 |

**总计: 68个资产**

## 🚀 部署步骤

### 1. 准备工作
- 注册 [GitHub](https://github.com) 账号
- 注册 [Vercel](https://vercel.com) 账号（用 GitHub 登录）

### 2. 创建 GitHub 仓库并推送
```bash
cd market-watchlist-vercel
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/market-watchlist.git
git push -u origin main
```

或运行一键部署脚本：
```bash
./deploy.sh
```

### 3. Vercel 部署
1. 登录 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "market-watchlist" 仓库
4. 点击 "Deploy"
5. 等待部署完成，获得网址

### 4. 完成！
- 访问你的专属网址
- 手机浏览器打开，添加到主屏幕像 App 一样使用

## 📱 访问方式

- **电脑**: 直接打开网址
- **手机**: 浏览器访问，自适应布局完美显示
- **平板**: 支持横竖屏切换

## 🔄 数据源

- **Yahoo Finance**: ETF、股票、加密货币、宏观指标
- **Stooq**: 期货数据（贵金属、能源、工业金属）
- **缓存**: 5分钟服务器端缓存，平衡实时性和稳定性

## 📊 显示指标

- ✅ 实时价格
- ✅ 日涨跌 (1D%)
- ✅ 50日涨跌 (50D%)
- ✅ 相对5日表现 (REL5)
- ✅ 相对20日表现 (REL20)
- ✅ 20日迷你K线
- ✅ 年初至今 (YTD%)

## 🎨 界面特点

- 全中文界面
- 绿色=上涨，红色=下跌
- 响应式设计（手机完美适配）
- 自动刷新（1分钟）
- 手动刷新按钮

## 🔧 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JS
- **后端**: Python + Vercel Serverless Functions
- **数据源**: Yahoo Finance API + Stooq API
- **部署**: Vercel

## ©️ 免责声明

仅供学习交流，不构成投资建议。投资有风险，入市需谨慎。
