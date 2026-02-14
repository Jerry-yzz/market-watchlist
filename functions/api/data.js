// Cloudflare Pages Function - 返回所有资产数据（已清理重复字段）
export async function onRequest() {
  const data = {
    // 全球市场 (3)
    ACWI: { price: 146.26, change1d: 0.42, change50d: 3.23, rel5: -0.78, rel20: 0.87, ytd: 17.83, sparkline: genSpark(145, 5) },
    VT: { price: 146.63, change1d: 0.46, change50d: 3.95, rel5: -0.70, rel20: 1.17, ytd: 18.28, sparkline: genSpark(145, 5) },
    ACWX: { price: 73.21, change1d: 0.29, change50d: 9.91, rel5: 0.36, rel20: 4.75, ytd: 29.97, sparkline: genSpark(70, 3) },
    
    // 美国市场 (3)
    VTI: { price: 337.99, change1d: 0.59, change50d: 0.43, rel5: -1.36, rel20: -1.13, ytd: 11.66, sparkline: genSpark(340, 5) },
    SPY: { price: 684.30, change1d: 0.44, change50d: 0.06, rel5: -1.39, rel20: -1.06, ytd: 11.91, sparkline: genSpark(680, 8) },
    QQQ: { price: 604.41, change1d: 0.63, change50d: -3.06, rel5: -1.61, rel20: -2.71, ytd: 12.06, sparkline: genSpark(610, 10) },
    
    // 贵金属ETF (7)
    GLD: { price: 461.45, change1d: 2.23, change50d: 19.39, rel5: 1.5, rel20: 8.2, ytd: 70.47, sparkline: genSpark(450, 15) },
    SLV: { price: 70.29, change1d: 3.78, change50d: 32.45, rel5: 2.8, rel20: 15.3, ytd: 135.05, sparkline: genSpark(65, 8) },
    PPLT: { price: 189.55, change1d: 3.07, change50d: 24.35, rel5: 1.2, rel20: 9.5, ytd: 109.46, sparkline: genSpark(180, 15) },
    PALL: { price: 151.69, change1d: 3.19, change50d: 13.65, rel5: 1.0, rel20: 7.8, ytd: 68.25, sparkline: genSpark(145, 12) },
    DBC: { price: 23.92, change1d: -0.70, change50d: 3.81, rel5: -1.5, rel20: 3.2, ytd: 4.95, sparkline: genSpark(24, 2) },
    GSG: { price: 24.76, change1d: -0.10, change50d: -0.24, rel5: -1.4, rel20: 4.0, ytd: -7.63, sparkline: genSpark(25, 2) },
    GCC: { price: 22.14, change1d: -1.07, change50d: 5.76, rel5: -2.2, rel20: -0.9, ytd: 10.50, sparkline: genSpark(22, 3) },
    
    // 发达市场 (9)
    EFA: { price: 84.03, change1d: 0.20, change50d: 5.35, rel5: -0.30, rel20: 2.28, ytd: 9.15, sparkline: genSpark(83, 3) },
    EZU: { price: 52.52, change1d: 0.48, change50d: 7.91, rel5: 0.15, rel20: 3.45, ytd: 8.25, sparkline: genSpark(52, 2) },
    EWU: { price: 26.87, change1d: 0.38, change50d: 3.73, rel5: -0.22, rel20: 1.92, ytd: 4.36, sparkline: genSpark(27, 2) },
    EWG: { price: 43.84, change1d: 0.91, change50d: 8.18, rel5: 0.23, rel20: -0.24, ytd: 11.35, sparkline: genSpark(43, 3) },
    EWQ: { price: 56.51, change1d: 0.67, change50d: 6.29, rel5: -0.39, rel20: 1.03, ytd: 7.45, sparkline: genSpark(56, 2) },
    EWI: { price: 46.76, change1d: 0.30, change50d: 4.69, rel5: 0.22, rel20: 2.47, ytd: 4.00, sparkline: genSpark(47, 2) },
    EWP: { price: 50.91, change1d: 0.75, change50d: 5.89, rel5: 0.12, rel20: 1.81, ytd: 3.98, sparkline: genSpark(51, 2) },
    EWC: { price: 45.55, change1d: -1.79, change50d: 5.37, rel5: -0.85, rel20: -0.28, ytd: 3.00, sparkline: genSpark(46, 2) },
    EWJ: { price: 53.41, change1d: 0.66, change50d: 4.75, rel5: -0.96, rel20: 1.50, ytd: 2.80, sparkline: genSpark(53, 2) },
    
    // 新兴市场 (13)
    EEM: { price: 50.96, change1d: 0.70, change50d: 12.20, rel5: 1.06, rel20: 4.42, ytd: 11.37, sparkline: genSpark(50, 3) },
    EMXC: { price: 31.01, change1d: 3.05, change50d: 15.05, rel5: 3.22, rel20: 6.15, ytd: 15.46, sparkline: genSpark(30, 3) },
    EWY: { price: 56.03, change1d: 4.64, change50d: 5.76, rel5: -2.6, rel20: -8.91, ytd: 4.20, sparkline: genSpark(56, 4) },
    EWS: { price: 22.08, change1d: -0.92, change50d: 2.10, rel5: -2.39, rel20: -3.08, ytd: 3.04, sparkline: genSpark(22, 1) },
    EIDO: { price: 17.91, change1d: 1.08, change50d: -4.90, rel5: 0.29, rel20: -2.55, ytd: -4.27, sparkline: genSpark(18, 1) },
    EZA: { price: 12.78, change1d: -1.16, change50d: 7.11, rel5: 3.35, rel20: 4.63, ytd: 8.71, sparkline: genSpark(13, 1) },
    EWM: { price: 20.75, change1d: 1.76, change50d: 1.57, rel5: -0.05, rel20: 0.74, ytd: 3.03, sparkline: genSpark(21, 1) },
    INDA: { price: 55.32, change1d: 3.09, change50d: -2.67, rel5: -0.67, rel20: -3.86, ytd: -1.56, sparkline: genSpark(55, 3) },
    ARGT: { price: 23.22, change1d: 1.22, change50d: -0.88, rel5: 0.22, rel20: -2.96, ytd: 1.30, sparkline: genSpark(23, 1) },
    VNM: { price: 16.57, change1d: -1.08, change50d: 1.14, rel5: 0.72, rel20: -2.54, ytd: -1.24, sparkline: genSpark(17, 1) },
    EWW: { price: 60.60, change1d: 2.79, change50d: 17.24, rel5: 3.25, rel20: 0.16, ytd: 8.80, sparkline: genSpark(60, 4) },
    EWZ: { price: 30.80, change1d: 1.45, change50d: 4.77, rel5: -1.25, rel20: -2.42, ytd: 2.63, sparkline: genSpark(31, 2) },
    EWT: { price: 67.18, change1d: 3.65, change50d: 8.68, rel5: 0.58, rel20: 2.42, ytd: 7.65, sparkline: genSpark(67, 4) },
    
    // 中国市场 (6)
    SSE: { price: 3347.32, change1d: 0.22, change50d: -1.34, rel5: 0.8, rel20: -0.5, ytd: -1.75, sparkline: genSpark(3350, 100) },
    HSI: { price: 22601.55, change1d: 0.22, change50d: 11.16, rel5: -1.0, rel20: 5.8, ytd: 20.83, sparkline: genSpark(22000, 800) },
    MCHI: { price: 68.45, change1d: -0.44, change50d: -3.84, rel5: -4.59, rel20: -0.66, ytd: 0.66, sparkline: genSpark(69, 3) },
    FXI: { price: 33.02, change1d: -0.99, change50d: -2.44, rel5: -5.25, rel20: -0.44, ytd: 3.81, sparkline: genSpark(33, 2) },
    KWEB: { price: 32.82, change1d: -0.79, change50d: -1.29, rel5: -2.60, rel20: 3.40, ytd: 3.79, sparkline: genSpark(33, 2) },
    ASHR: { price: 33.84, change1d: -0.34, change50d: 3.09, rel5: -3.14, rel20: 0.48, ytd: 4.98, sparkline: genSpark(34, 2) },
    
    // 贵金属现货 (4)
    XAU: { price: 5040.80, change1d: 2.38, change50d: 15.2, rel5: 2.1, rel20: 9.5, ytd: 72.67, sparkline: genSpark(4900, 200) },
    XAG: { price: 88.03, change1d: 2.44, change50d: 32.22, rel5: 3.6, rel20: 15.1, ytd: 131.50, sparkline: genSpark(75, 15) },
    XPT: { price: 1277.00, change1d: -13.77, change50d: 20.59, rel5: 2.5, rel20: -4.7, ytd: 21.76, sparkline: genSpark(1400, 150) },
    XPD: { price: 1377.00, change1d: -1.99, change50d: 16.52, rel5: 3.9, rel20: -6.4, ytd: 1.80, sparkline: genSpark(1350, 100) },
    
    // 工业金属 (2)
    COPPER: { price: 5.96, change1d: 7.01, change50d: 6.20, rel5: 1.2, rel20: 4.44, ytd: 0.40, sparkline: genSpark(5.5, 0.8) },
    ALUMINUM: { price: 3084.00, change1d: 0.57, change50d: 7.02, rel5: 2.5, rel20: 4.35, ytd: 6.37, sparkline: genSpark(3000, 150) },
    
    // 能源 (3)
    WTI: { price: 64.95, change1d: 0.68, change50d: 6.61, rel5: 1.2, rel20: 4.5, ytd: 2.13, sparkline: genSpark(64, 4) },
    BRENT: { price: 69.19, change1d: 1.17, change50d: 7.41, rel5: 1.5, rel20: 5.1, ytd: 2.55, sparkline: genSpark(68, 4) },
    NATGAS: { price: 3.75, change1d: -1.70, change50d: 1.36, rel5: -0.5, rel20: -7.4, ytd: 12.75, sparkline: genSpark(3.8, 0.4) },
    
    // 加密货币 (3)
    BTC: { price: 68892, change1d: 4.03, change50d: -37.54, rel5: -1.2, rel20: -5.3, ytd: -37.54, sparkline: genSpark(70000, 2500) },
    ETH: { price: 2053, change1d: 5.48, change50d: -23.42, rel5: 2.1, rel20: -8.5, ytd: -23.42, sparkline: genSpark(2100, 100) },
    SOL: { price: 84.36, change1d: 7.67, change50d: -30.91, rel5: 2.2, rel20: -27.2, ytd: -47.63, sparkline: genSpark(90, 10) },
    
    // 宏观指标 (7)
    VIX: { price: 19.21, change1d: -7.73, change50d: 25.15, rel5: -5.2, rel20: 12.3, ytd: 25.15, sparkline: genSpark(21, 3) },
    DXY: { price: 96.84, change1d: -0.10, change50d: -9.64, rel5: -0.5, rel20: -2.1, ytd: -9.64, sparkline: genSpark(98, 2) },
    US10Y: { price: 4.96, change1d: -0.12, change50d: 4.64, rel5: 0.8, rel20: 0.7, ytd: -5.65, sparkline: genSpark(5.0, 0.3) },
    US02Y: { price: 3.59, change1d: 0.56, change50d: 5.28, rel5: 1.5, rel20: 3.2, ytd: -5.63, sparkline: genSpark(3.5, 0.3) },
    US30Y: { price: 5.01, change1d: -0.40, change50d: 3.73, rel5: 0.9, rel20: 0.8, ytd: -4.98, sparkline: genSpark(5.0, 0.3) },
    T10Y2Y: { price: 1004.00, change1d: 2.03, change50d: 6.26, rel5: -5.2, rel20: -0.66, ytd: 4.95, sparkline: genSpark(1000, 50) },
    HY_OAS: { price: 633.00, change1d: -1.70, change50d: -1.80, rel5: -1.7, rel20: -1.95, ytd: 3.30, sparkline: genSpark(640, 30) }
  };
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

// 生成模拟 sparkline 数据
function genSpark(base, range) {
  return Array(20).fill(0).map((_, i) => {
    const random = (Math.random() - 0.5) * range;
    return Math.round((base + random) * 100) / 100;
  });
}
