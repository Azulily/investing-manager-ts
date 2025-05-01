import { useState, useEffect } from 'react';
import './App.css'
import { StockHolding } from './types/portfolio';
import { v4 as uuidv4 } from 'uuid';
import AddStockForm from './components/AddStockForm';
import EditStockForm from './components/EditStockForm';

const LOCAL_STORAGE_KEY = 'portfolioApp.holdings';

function App() {
  // 1. useState で StockHolding の配列を状態として持つ！ 型も指定！
  const [holdings, setHoldings] = useState<StockHolding[]>( () => {
    const storedHoldings = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedHoldings) {
      try {
        const parsed = JSON.parse(storedHoldings);
        if (Array.isArray(parsed)) {
          return parsed;
        } 
      } catch (e) {
        console.error("LocalStorage からのデータ読み込みに失敗しました", e);
        return [];
      }
    }
    return [];
  });

  const [editingStockId, setEditingStockId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  // 追加ボタンが押されたときの処理 (handleAddStock 関数)を定義
  const handleAddStock = (newHoldingData: Omit<StockHolding, 'id'>) => {

    const newHolding: StockHolding = {
      id: uuidv4(), // UUIDを生成して一意なIDを付与
      ...newHoldingData
    };

    setHoldings([...holdings, newHolding]);
  };

  const handleUpdateStock = (updatedStock: StockHolding) => {
    const updatedHoldings = holdings.map(stock => 
      stock.id === updatedStock.id ? updatedStock : stock
    );
    setHoldings(updatedHoldings);
    setEditingStockId(null);
  };


  // 3. 削除機能の関数を定義
  const handleDeleteStock = (idToDelete: string) => {
    // holdings 配列を filter して、IdToDelete と一致しない要素だけを残して新しい配列を作る
    const updatedHoldings = holdings.filter(stock => stock.id !== idToDelete);
    // 新しい配列で state を更新
    setHoldings(updatedHoldings);
  };

  const handleStartEditStock = (idToEdit:string) => {
    setEditingStockId(idToEdit);
  };

  const handleCancelEdit = () => {
    setEditingStockId(null);
  };

  const totalAcquisitionCost = holdings.reduce((sum, stock) => {
    return sum + (stock.quantity * stock.purchasePrice);
  },0);

  return (
    <>
      <h1>ポートフォリオ</h1>

      <div>
        <p>
          合計取得金額: ¥{totalAcquisitionCost.toLocaleString()}
        </p>
      </div>

      { /* 2. holdingsの中身をリストで表示する */}
      <ul>
        {holdings.map((stock) => (
          <li key={stock.id}>
            { editingStockId === stock.id ? (
              <EditStockForm
                stockToEdit={stock}
                onUpdateStock={handleUpdateStock}
                onCancelEdit={handleCancelEdit}
              />
            ) : (
          <>
            {stock.name}({stock.ticker}): {stock.quantity}株 / 取得単価 {stock.purchasePrice}円
            { /* 4. ボタンの onclick で handleDeleteStock を呼び出し、引数に stock.id を引き渡す */}
            <button onClick= {() => handleStartEditStock(stock.id)} style={{ marginLeft: '10px' }}>
            編集
            </button>
            <button onClick={() => handleDeleteStock(stock.id)} style={{ marginLeft: '10px' }}>
              削除
            </button>
          </>
            )}
          </li>
        ))}
      </ul>
      <AddStockForm onAddStock={handleAddStock} />
    </>
  )
}

export default App;
