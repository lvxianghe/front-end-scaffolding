// 美股数据API服务 - 纯真实数据版本
interface MarketDataPoint {
    timestamp: string;
    price: number;
    volume?: number;
}

interface SP500Quote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    lastUpdate: string;
}

class MarketDataService {
    private readonly ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

    async getSP500Data(period: string = '5D'): Promise<{
        quote: SP500Quote;
        historicalData: MarketDataPoint[];
    }> {
        console.log('获取S&P500数据，周期:', period);

        if (!this.ALPHA_VANTAGE_KEY) {
            throw new Error('缺少 Alpha Vantage API 密钥');
        }

        try {
            const response = await fetch(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${this.ALPHA_VANTAGE_KEY}&outputsize=compact`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Alpha Vantage响应:', Object.keys(data));

            // 检查是否达到API限制
            if (data.Information && data.Information.includes('daily rate limit')) {
                throw new Error('API 每日调用次数已达上限（25次），请明天再试');
            }

            // 检查是否有时间序列数据
            if (!data['Time Series (Daily)']) {
                console.error('API响应异常:', data);
                throw new Error('无法获取SPY历史数据');
            }

            const timeSeries = data['Time Series (Daily)'];
            const dates = Object.keys(timeSeries).sort().reverse();

            if (dates.length === 0) {
                throw new Error('没有可用的历史数据');
            }

            // 获取最新报价
            const latestDate = dates[0];
            const latestData = timeSeries[latestDate];
            const previousData = timeSeries[dates[1]];

            const currentPrice = parseFloat(latestData['4. close']);
            const previousPrice = parseFloat(previousData['4. close']);

            // SPY转换为S&P500指数（大约10倍关系）
            const indexPrice = currentPrice * 10;
            const indexChange = (currentPrice - previousPrice) * 10;
            const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;

            const quote: SP500Quote = {
                symbol: 'S&P 500',
                price: indexPrice,
                change: indexChange,
                changePercent: changePercent,
                lastUpdate: latestDate
            };

            // 根据周期筛选历史数据
            let dataLimit = 5;
            switch (period) {
                case '5D': dataLimit = 5; break;
                case '1M': dataLimit = 30; break;
                case '6M': dataLimit = 180; break;
                case '1Y': dataLimit = 252; break;
                default: dataLimit = 5;
            }

            const historicalData: MarketDataPoint[] = dates
                .slice(0, dataLimit)
                .reverse()
                .map(date => ({
                    timestamp: date,
                    price: parseFloat(timeSeries[date]['4. close']) * 10, // 转换为指数点数
                    volume: parseFloat(timeSeries[date]['5. volume'])
                }));

            console.log('✅ 成功获取SPY数据并转换为S&P500指数');
            console.log('- 指数点位:', indexPrice.toFixed(2));
            console.log('- 涨跌:', indexChange > 0 ? '+' : '', indexChange.toFixed(2));
            console.log('- 涨跌幅:', changePercent > 0 ? '+' : '', changePercent.toFixed(2), '%');
            console.log('- 历史数据点数:', historicalData.length);

            return {
                quote,
                historicalData
            };

        } catch (error: any) {
            console.error('Alpha Vantage API失败:', error);
            throw error;
        }
    }
}

// 同时提供命名导出和默认导出
export { MarketDataService, type MarketDataPoint, type SP500Quote };
export default new MarketDataService();