import { waitFor, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditStockForm from "./EditStockForm";
import { StockHolding } from "../types/portfolio";
import userEvent from "@testing-library/user-event";

const mockStockTOEdit: StockHolding = {
    id: '1',
    ticker: "AAPL",
    name: "Apple Inc.",
    quantity: 10,
    purchasePrice: 150,
};

describe('EditStockForm', () => {
    const setup = (overrideProps = {}) => { // ← setup関数、マジ便利！
        const user = userEvent.setup();
        const mockOnUpdateStock = vi.fn();
        const mockOnCancelEdit = vi.fn();
        render(
            <EditStockForm
                stockToEdit={mockStockTOEdit}
                onUpdateStock={mockOnUpdateStock}
                onCancelEdit={mockOnCancelEdit}
                {...overrideProps} // ← ここでオーバーライドされたpropsを渡す
            />
        );

        return { user, mockOnUpdateStock, mockOnCancelEdit }; // ← userとmockOnUpdateStockをセットで返す！
    };

    it('renders the form correctly with initial values', () => {
        render(
            <EditStockForm
                stockToEdit={mockStockTOEdit}
                onUpdateStock={vi.fn()}
                onCancelEdit={vi.fn()}
            />
        );

        expect(screen.getByLabelText(/銘柄コード:\s*$/)).toHaveDisplayValue(mockStockTOEdit.ticker);
        expect(screen.getByLabelText(/銘柄名:\s*$/)).toHaveDisplayValue(mockStockTOEdit.name);
        expect(screen.getByLabelText(/株数:\s*$/)).toHaveDisplayValue(String(mockStockTOEdit.quantity));
        expect(screen.getByLabelText(/取得単価:\s*$/)).toHaveDisplayValue(String(mockStockTOEdit.purchasePrice));
    });

    it('calls onUpdateStock when "更新する" button is clicked', async () => {
        const { user, mockOnUpdateStock } = setup();

        //株数を空にする
        await user.clear(screen.getByLabelText(/株数:\s*$/));

        //更新ボタンをクリック
        await user.click(screen.getByRole('button', { name: "更新する" }));

        //エラーメッセージが表示されることを確認
        await waitFor(() => {
            expect(screen.getByText(/有効な株数/)).toBeInTheDocument();
        });

        //onUpdateStockが呼ばれないことを確認
        expect(mockOnUpdateStock).not.toHaveBeenCalled()
    });

    it('calls onCancelEdit when "キャンセル" button is clicked', async () => {
        const { user, mockOnCancelEdit } = setup();
        await user.click(screen.getByRole('button', { name: "キャンセル" }));
        expect(mockOnCancelEdit).toHaveBeenCalled();
    });

    it('shows error message when ticker is empty and form is submitted', async () => {
        const { user, mockOnUpdateStock } = setup();

        //銘柄コードを空にする
        const tickerInput = screen.getByLabelText(/銘柄コード:\s*$/);
        await user.clear(tickerInput);

        //更新ボタンをクリック
        const submitButton = screen.getByRole('button', { name: "更新する" });
        await user.click(submitButton);

        //エラーメッセージが表示されることを確認
        await waitFor(() => {
            const tickerField = screen.getByLabelText(/銘柄コード:\s*$/);
            const errorElement = tickerField.closest('div')?.querySelector('p');
            expect(errorElement).toHaveTextContent(/銘柄コードを入力してください。/);
            expect(errorElement).toHaveStyle({ color: 'rgb(255,0,0)' });
        });
        //onUpdateStockが呼ばれないことを確認
        expect(mockOnUpdateStock).not.toHaveBeenCalled();
    });

    it('shows error message when name is too long and form is submitted', async () => {
        const { user, mockOnUpdateStock } = setup({
            stockToEdit: {
                ...mockStockTOEdit,
                name: 'A'.repeat(21), // 51以上の文字の名前を設定
            }
        });
        //更新ボタンをクリック
        const submitButton = screen.getByRole('button', { name: "更新する" });
        await user.click(submitButton);

        //エラーメッセージが表示されることを確認
        await waitFor(() => {
            const nameField = screen.getByLabelText(/銘柄名:\s*$/);
            const errorElement = nameField.closest('div')?.querySelector('p');
            expect(errorElement).toHaveTextContent(/銘柄名は20文字以内で入力してください。/);
            expect(errorElement).toHaveStyle({ color: 'rgb(255,0,0)' });
        
    });
        //onUpdateStockが呼ばれないことを確認
        expect(mockOnUpdateStock).not.toHaveBeenCalled();
    });

    it('shows error message when pruchase price is negative and form is submitted', async () => {
        const { user, mockOnUpdateStock } = setup({
            stockToEdit:{
                ...mockStockTOEdit,
                purchasePrice: -100, // 負の値を設定
            }
        });
        
        //更新ボタンをクリック
        const submitButton = screen.getByRole('button', { name: "更新する" });
        await user.click(submitButton);

        //エラーメッセージが表示されることを確認
        await waitFor(() => {
            const priceField = screen.getByLabelText(/取得単価:\s*$/);
            const errorElement = priceField.closest('div')?.querySelector('p');
            expect(errorElement).toHaveTextContent(/有効な取得単価を入力してください/);
            expect(errorElement).toHaveStyle({ color: 'rgb(255,0,0)' });
        });
        //onUpdateStockが呼ばれないことを確認
        expect(mockOnUpdateStock).not.toHaveBeenCalled();
    });
});