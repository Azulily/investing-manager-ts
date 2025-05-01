import { useState } from "react";
import { StockHolding } from "../types/portfolio";
import React from "react";

interface FormErrors {
    ticker?: string;
    name?: string;
    quantity?: string;
    price?: string;
}

interface AddStockFormProps {
    onAddStock: (newHoldingData: Omit<StockHolding, 'id'>) => void;
}

function AddStockForm({ onAddStock }: AddStockFormProps) {
    // 入力フォーム用のstateを定義
    const [tickerInput, setTickerInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentErrors: FormErrors = {};
    
    //各フィールドのバリデーション
    if (!tickerInput.trim()) {
        currentErrors.ticker = '銘柄コードを入力してください。';
    }
    if (!nameInput.trim()) {
        currentErrors.name = '銘柄名を入力してください。';
    }


    const quantityNum = Number(quantityInput);
    if (isNaN(quantityNum) || quantityNum <= 0) {
        currentErrors.quantity = '有効な株数を入力してください';
    }

    const priceNum = Number(priceInput);
    if (isNaN(priceNum) || priceNum <= 0) {
        currentErrors.price = '有効な取得単価を入力してください';
    }

    // エラーがあるかどうかチェック
    if (Object.keys(currentErrors).length > 0) {
        setErrors(currentErrors);
        return;
    }
    // エラーがなければ、親コンポーネントに関数を呼び出す
    onAddStock({
        ticker: tickerInput.trim(),
        name: nameInput.trim(),
        quantity: quantityNum,
        purchasePrice: priceNum,
    });

    setTickerInput('');
    setNameInput('');
    setQuantityInput('');
    setPriceInput('');
    setErrors({}); // エラー stateをリセット

};

const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof FormErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {setter(e.target.value);
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }
};

return (
    <form onSubmit={handleSubmit}>
        <h2 style={{ marginTop: '30px'}}>新しい株を追加</h2>
        <div>
            <label>銘柄コード: </label>
            <input type="text" value={tickerInput} onChange={handleInputChange(setTickerInput, 'ticker')} required/>
            {errors.ticker && <p style={{ color: 'red', margin: '0', fontSize: '0.9em' }}>{errors.ticker}</p>}
        </div>
        <div>
            <label>銘柄名: </label>
            <input type="text" value={nameInput} onChange={handleInputChange(setNameInput, 'name')} required/>
            {errors.name && <p style={{ color: 'red', margin: '0', fontSize: '0.9em' }}>{errors.name}</p>}
        </div>
        <div>
            <label>株数: </label>
            {/* type="number" にすると入力が楽になるかも */}
            <input type="number" value={quantityInput} onChange={handleInputChange(setQuantityInput, 'quantity')} required min="1"/>
        </div>
        <div>
            <label>取得単価 (円): </label>
            <input type="number" value={priceInput} onChange={handleInputChange(setPriceInput, 'price')} required min="1"/>
            {errors.price && <p style={{ color: 'red', margin: '0', fontSize: '0.9em' }}>{errors.price}</p>}
        </div>
        <button type="submit">追加する</button>
    </form>
);
}

export default AddStockForm;    