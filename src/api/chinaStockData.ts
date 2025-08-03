// 中国股市数据API服务 - 使用AllTick API（通过代理）
interface MarketDataPoint {
    timestamp: string;
    price: number;
    volume?: number;
}

interface ChinaIndexQuote {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    lastUpdate: string;
    high: number;
    low: number;
    open: number;
}

class ChinaStockDataService {
    private readonly ALLTICK_TOKEN = import.meta.env.VITE_ALLTICK_TOKEN;

    // 使用代理获取AllTick API数据
    async getAllTickIndexData(symbol: string): Promise<any> {
        try {
            console.log(`通过代理获取AllTick ${symbol} 数据...`);

            if (!this.ALLTICK_TOKEN) {
                throw new Error('缺少 AllTick API Token');
            }

            // 通过Vite代理调用AllTick API
            const response = await fetch(
                `/api/alltick/quote?token=${this.ALLTICK_TOKEN}&code=${symbol}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('AllTick API响应:', data);

            if (data.code !== 0) {
                throw new Error(`AllTick API错误: ${data.msg || '未知错误'}`);
            }

            return data.data;

        } catch (error: any) {
            console.error('AllTick API调用失败:', error);
            throw new Error(`AllTick API失败: ${error.message}`);
        }
    }

    // 获取AllTick历史K线数据（通过代理）
    async getAllTickKlineData(symbol: string, period: string): Promise<MarketDataPoint[]> {
        try {
            console.log(`通过代理获取AllTick ${symbol} K线数据，周期:${period}...`);

            // 转换周期格式
            let klineType = 1; // 日线
            let days = 5;

            switch (period) {
                case '5D': klineType = 1; days = 5; break;
                case '1M': klineType = 1; days = 30; break;
                case '6M': klineType = 1; days = 180; break;
                case '1Y': klineType = 1; days = 365; break;
                case '10Y': klineType = 1; days = 3650; break;
                default: klineType = 1; days = 5;
            }

            // 通过Vite代理调用AllTick K线API
            const response = await fetch(
                `/api/alltick/kline?token=${this.ALLTICK_TOKEN}&code=${symbol}&kline_type=${klineType}&query_kline_num=${days}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('AllTick K线响应:', data);

            if (data.code !== 0) {
                throw new Error(`AllTick K线API错误: ${data.msg || '未知错误'}`);
            }

            // 转换数据格式
            const klineData = data.data || [];
            return klineData.map((item: any) => ({
                timestamp: new Date(item.time * 1000).toISOString().slice(0, 10),
                price: parseFloat(item.close),
                volume: parseFloat(item.volume) || 0
            }));

        } catch (error: any) {
            console.error('AllTick K线API失败:', error);
            throw new Error(`AllTick K线API失败: ${error.message}`);
        }
    }

    // 获取上证指数完整数据
    async getShangzhengIndex(period: string = '5D'): Promise<{
        quote: ChinaIndexQuote;
        historicalData: MarketDataPoint[];
    }> {
        console.log('获取上证指数数据，周期:', period);

        try {
            // 上证指数在AllTick中的代码（需要确认具体格式）
            const symbol = '000001.SH'; // 或者 'SH000001'，需要根据AllTick文档确认

            // 并行获取实时数据和历史数据
            const [realtimeData, historyData] = await Promise.all([
                this.getAllTickIndexData(symbol),
                this.getAllTickKlineData(symbol, period)
            ]);

            console.log('AllTick实时数据:', realtimeData);
            console.log('AllTick历史数据点数:', historyData.length);

            // 构建报价信息
            const quote: ChinaIndexQuote = {
                symbol: symbol,
                name: '上证指数',
                price: parseFloat(realtimeData.last_px || realtimeData.price || 0),
                change: parseFloat(realtimeData.px_change || 0),
                changePercent: parseFloat(realtimeData.px_change_rate || 0),
                lastUpdate: new Date().toISOString(),
                high: parseFloat(realtimeData.high_px || 0),
                low: parseFloat(realtimeData.low_px || 0),
                open: parseFloat(realtimeData.open_px || 0)
            };

            return {
                quote,
                historicalData: historyData
            };

        } catch (error: any) {
            console.error('获取上证指数数据失败:', error);
            throw new Error(`获取上证指数失败: ${error.message}`);
        }
    }
}

export { ChinaStockDataService, type MarketDataPoint, type ChinaIndexQuote };