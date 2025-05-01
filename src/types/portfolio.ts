export interface StockHolding {
    id: string; // 一意なID (UUIDなどが良いかも)
    ticker: string; // 銘柄コード (例: 'AAPL')
    name: string; // 銘柄名 (例: 'Apple Inc.')
    quantity: number; // 保有株数
    purchasePrice: number; // 取得単価
}
