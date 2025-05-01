import { useState } from "react";
import { StockHolding } from "../types/portfolio";
import React from "react";

interface AddStockFormProps {
    onAddStock: (newHoldingData: Omit<StockHolding, 'id'>) => void;
}

function AddStockForm({ onAddStock }: AddStockFormProps) {
    // 入力フォーム用のstateを定義
    const [tickerInput, setTickerInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');
    const [priceInput, setPriceInput] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quantityNum = Number(quantityInput);
    const priceNum = Number(priceInput);

    if (
        !tickerInput ||
        !nameInput ||
        isNaN(quantityNum) ||
        quantityNum <= 0 ||
        isNaN(priceNum) ||
        priceNum <= 0
    ) {
        alert('すべてのフィールドに正しい値を入力してください。');
        return;
    }

    onAddStock({
        ticker: tickerInput,
        name: nameInput,
        quantity: quantityNum,
        purchasePrice: priceNum,
    });

    setTickerInput('');
    setNameInput('');
    setQuantityInput('');
    setPriceInput('');
};

return (
    <form onSubmit={handleSubmit}>
        <h2>新しい株を追加</h2>
        <div>
            <label>銘柄コード: </label>
            <input type="text" value={tickerInput} onChange={(e) => setTickerInput(e.target.value)} required/>
        </div>
        <div>
            <label>銘柄名: </label>
            <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required/>
        </div>
        <div>
            <label>株数: </label>
            {/* type="number" にすると入力が楽になるかも */}
            <input type="number" value={quantityInput} onChange={(e) => setQuantityInput(e.target.value)} required min="1"/>
        </div>
        <div>
            <label>取得単価 (円): </label>
            <input type="number" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} required min="1"/>
        </div>
        <button type="submit">追加する</button>
    </form>
);
}

export default AddStockForm;    