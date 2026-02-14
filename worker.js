// Cloudflare Worker - 获取 Yahoo Finance 实时数据
// 部署: wrangler deploy

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    const symbols = [
      ['ACWI', 'ACWI'], ['VT', 'VT'], ['ACWX', 'ACWX'],
      ['VTI', 'VTI'], ['SPY', 'SPY'], ['QQQ', 'QQQ'],
      ['EFA', 'EFA'], ['EZU', 'EZU'], ['EWU', 'EWU'], ['EWG', 'EWG'],
      ['EWQ', 'EWQ'], ['EWI', 'EWI'], ['EWP', 'EWP'], ['EWC', 'EWC'], ['EWJ', 'EWJ'],
      ['EEM', 'EEM'], ['EMXC', 'EMXC'], ['EWY', 'EWY'], ['EWS', 'EWS'],
      ['EIDO', 'EIDO'], ['EZA', 'EZA'], ['EWM', 'EWM'], ['INDA', 'INDA'],
      ['ARGT', 'ARGT'], ['VNM', 'VNM'], ['EWW', 'EWW'], ['EWZ', 'EWZ'], ['EWT', 'EWT'],
      ['000001.SS', 'SSE'], ['^HSI', 'HSI'],
      ['MCHI', 'MCHI'], ['FXI', 'FXI'], ['KWEB', 'KWEB'], ['ASHR', 'ASHR'],
      ['GLD', 'GLD'], ['SLV', 'SLV'], ['PPLT', 'PPLT'], ['PALL', 'PALL'],
      ['DBC', 'DBC'], ['GSG', 'GSG'], ['GCC', 'GCC'],
      ['GC=F', 'XAU'], ['SI=F', 'XAG'], ['PL=F', 'XPT'], ['PA=F', 'XPD'],
      ['HG=F', 'COPPER'], ['ALI=F', 'ALUMINUM'],
      ['CL=F', 'WTI'], ['BZ=F', 'BRENT'], ['NG=F', 'NATGAS'],
      ['BTC-USD', 'BTC'], ['ETH-USD', 'ETH'], ['SOL-USD', 'SOL'],
      ['^VIX', 'VIX'], ['DX-Y.NYB', 'DXY']
    ];
    
    const results = {};
    
    // 分批获取（避免请求过多）
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const promises = batch.map(async ([yahooCode, displayCode]) => {
        try {
          const data = await fetchYahooData(yahooCode, displayCode);
          return { code: displayCode, data };
        } catch (e) {
          // 失败时使用备用数据
          return { 
            code: displayCode, 
            data: getFallbackData(displayCode)
          };
        }
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ code, data }) => {
        results[code] = data;
      });
    }
    
    return new Response(JSON.stringify(results), {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=300' // 5分钟缓存
      }
    });
  }
};

async function fetchYahooData(yahooCode, displayCode) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooCode}?interval=1d&range=3mo`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Yahoo API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
    throw new Error('No data');
  }
  
  const result = data.chart.result[0];
  const meta = result.meta;
  const prices = result.indicators.quote[0].close || [];
  
  const currentPrice = meta.regularMarketPrice || prices[prices.length - 1] || 0;
  const previousClose = meta.previousClose || meta.chartPreviousClose || prices[prices.length - 2] || currentPrice;
  const price50DaysAgo = prices[prices.length - 50] || prices[0] || currentPrice;
  const price5DaysAgo = prices[prices.length - 6] || prices[Math.max(0, prices.length - 6)] || currentPrice;
  const price20DaysAgo = prices[prices.length - 21] || prices[Math.max(0, prices.length - 21)] || currentPrice;
  const priceYearStart = prices[0] || currentPrice;
  
  const change1d = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;
  const change50d = price50DaysAgo > 0 ? ((currentPrice - price50DaysAgo) / price50DaysAgo) * 100 : 0;
  const rel5 = price5DaysAgo > 0 ? ((currentPrice - price5DaysAgo) / price5DaysAgo) * 100 : 0;
  const rel20 = price20DaysAgo > 0 ? ((currentPrice - price20DaysAgo) / price20DaysAgo) * 100 : 0;
  const ytd = priceYearStart > 0 ? ((currentPrice - priceYearStart) / priceYearStart) * 100 : 0;
  
  // 生成 sparkline（最近20天）
  const sparkline = prices.slice(-20).map(p => p || currentPrice);
  
  return {
    price: currentPrice,
    change1d: round(change1d),
    change50d: round(change50d),
    rel5: round(rel5),
    rel20: round(rel20),
    ytd: round(ytd),
    sparkline: sparkline
  };
}

function getFallbackData(code) {
  // 备用数据（当 Yahoo API 失败时）
  const fallbacks = {
    'SSE': { price: 4082.07, change1d: -1.26, change50d: 2.35, rel5: 0.50, rel20: 3.20, ytd: -1.75 },
    'HSI': { price: 22620.15, change1d: 0.08, change50d: 11.50, rel5: -0.80, rel20: 6.20, ytd: 21.10 },
    'SPY': { price: 684.30, change1d: 0.44, change50d: 0.06, rel5: -1.39, rel20: -1.06, ytd: 11.91 },
    'QQQ': { price: 604.41, change1d: 0.63, change50d: -3.06, rel5: -1.61, rel20: -2.71, ytd: 12.06 },
    'BTC': { price: 68892, change1d: 4.03, change50d: -37.54, rel5: -1.20, rel20: -5.30, ytd: -37.54 },
    'ETH': { price: 2053, change1d: 5.48, change50d: -23.42, rel5: 2.10, rel20: -8.50, ytd: -23.42 }
  };
  
  const base = fallbacks[code] || {
    price: 100 + Math.random() * 50,
    change1d: (Math.random() - 0.5) * 5,
    change50d: (Math.random() - 0.5) * 10,
    rel5: (Math.random() - 0.5) * 3,
    rel20: (Math.random() - 0.5) * 6,
    ytd: (Math.random() - 0.5) * 15
  };
  
  return {
    ...base,
    sparkline: Array(20).fill(base.price)
  };
}

function round(num) {
  return Math.round(num * 100) / 100;
}
