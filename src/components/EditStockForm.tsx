import { useState } from "react";
import { StockHolding } from "../types/portfolio";
import React from "react";


interface EditStockFormProps {
    stockToEdit: StockHolding;
    onUpdateStock: (updatedStock : StockHolding) => void;
    onCancelEdit: () => void;
}

function EditStockForm( { stockToEdit, onUpdateStock, onCancelEdit }: EditStockFormProps){
    const [ticker, setTicker] = useState(stockToEdit. ticker);
    const [name, setName] = useState(stockToEdit.name);
    const [quantity, setQuantity] = useState(String(stockToEdit.quantity));
    const [price, setPrice] = useState(String(stockToEdit. purchasePrice));

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const quantityNum = Number(quantity);
        const priceNum = Number(price);

        if (
            !ticker ||
            !name ||
            isNaN(quantityNum) ||
            quantityNum <= 0 ||
            isNaN(priceNum) ||
            priceNum <= 0
        ) {
            alert('すべてのフィールドに正しい値を入力してください。');
            return;
        }

        onUpdateStock({
            id: stockToEdit.id,
            ticker: ticker,
            name: name,
            quantity: quantityNum,
            purchasePrice: priceNum,
        });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>株を編集</h2>
            <div><label>銘柄コード: </label><input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} required /></div>
            <div><label>銘柄名: </label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label>株数: </label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" /></div>
            <div><label>取得単価 (円): </label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="1" /></div>
            <button type="submit">更新する</button>
            <button type="button" onClick={onCancelEdit}>キャンセル</button>
</form>

    );}

export default EditStockForm;

