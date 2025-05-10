import { useState } from "react";
import { StockHolding } from "../types/portfolio";
import { FormErrors } from "../types/forms";
import React from "react";
import styled from "@emotion/styled"

const ErrorMessage = styled.p`
    color: red;
    margin: 0;
    font-size: 0.9em;
`;


interface EditStockFormProps {
    stockToEdit: StockHolding;
    onUpdateStock: (updatedStock: StockHolding) => void;
    onCancelEdit: () => void;
}

function EditStockForm({ stockToEdit, onUpdateStock, onCancelEdit }: EditStockFormProps) {
    const [ticker, setTicker] = useState(stockToEdit.ticker);
    const [name, setName] = useState(stockToEdit.name);
    const [quantity, setQuantity] = useState(String(stockToEdit.quantity));
    const [price, setPrice] = useState(String(stockToEdit.purchasePrice));

    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentErrors: FormErrors = {};

        const quantityNum = Number(quantity);
        const priceNum = Number(price);

        if (!ticker.trim()) {
            currentErrors.ticker = '銘柄コードを入力してください。';
        }
        if (!name.trim()) {
            currentErrors.name = '銘柄名を入力してください。';
        } else if (name.length >= 20) {
            currentErrors.name = '銘柄名は20文字以内で入力してください。';
        }
        if (isNaN(quantityNum) || quantityNum <= 0) {
            currentErrors.quantity = '有効な株数を入力してください';
        }
        if (isNaN(priceNum) || priceNum <= 0) {
            currentErrors.price = '有効な取得単価を入力してください';
        }
        // エラーがあるかどうかチェック
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        onUpdateStock({
            id: stockToEdit.id,
            ticker: ticker,
            name: name,
            quantity: quantityNum,
            purchasePrice: priceNum,
        });
        setErrors({}); // エラー stateをリセット
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof FormErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>株を編集</h2>
            <div>
                <label htmlFor="edit-ticker">銘柄コード: </label>
                <input
                    id="edit-ticker"
                    type="text"
                    value={ticker}
                    onChange={handleInputChange(setTicker, 'ticker')}
                    required
                    aria-invalid={errors.ticker ? 'true' : 'false'}
                    aria-describedby="ticker-error"
                />
                {errors.ticker && <ErrorMessage id="ticker-error" >{errors.ticker}</ErrorMessage>}
            </div>
            <div>
                <label htmlFor="edit-name">銘柄名: </label>
                <input 
                id="edit-name" 
                type="text" value={name} 
                onChange={handleInputChange(setName, 'name')} 
                required
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby="name-error"
                />
                {errors.name && <ErrorMessage id="name-error" >{errors.name}</ErrorMessage>}
            </div>
            <div>
                <label htmlFor="edit-quantity">株数: </label>
                <input id="edit-quantity" 
                type="number" value={quantity} 
                onChange={handleInputChange(setQuantity, 'quantity')} 
                required
                aria-invalid={errors.quantity ? 'true' : 'false'}
                aria-describedby="quantity-error"
                />
                {errors.quantity && <ErrorMessage id="quantity-error" >{errors.quantity}</ErrorMessage>}
            </div>
            <div>
                <label htmlFor="edit-price">取得単価: </label>
                <input id="edit-price" 
                type="number" 
                value={price} 
                onChange={handleInputChange(setPrice, 'price')} 
                required
                aria-invalid={errors.price ? 'true' : 'false'}
                aria-describedby="price-error"
                />
                {errors.price && <ErrorMessage id="price-error" >{errors.price}</ErrorMessage>}
            </div>
            <button type="submit">更新する</button>
            <button type="button" onClick={onCancelEdit}>キャンセル</button>
        </form>

    );
}

export default EditStockForm;

