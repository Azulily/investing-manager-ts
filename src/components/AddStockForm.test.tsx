import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest'; // vitest の場合 (jestなら jest から import)
import AddStockForm from './AddStockForm';

// テストスイートを定義
describe('AddStockForm', () => {
    // 1. レンダリングテスト
    it('renders the form correctly', () => {
        // モック関数を作成
        const mockOnAddStock = vi.fn();
        render(<AddStockForm onAddStock={mockOnAddStock} />);

        // 各要素が存在するか確認 (ラベルテキストで取得)
        expect(screen.getByLabelText(/銘柄コード:\s*$/)).toBeInTheDocument();
        expect(screen.getByLabelText(/銘柄名:\s*$/)).toBeInTheDocument();
        expect(screen.getByLabelText(/株数:\s*$/)).toBeInTheDocument();
        expect(screen.getByLabelText(/取得単価 \(円\):\s*$/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '追加する' })).toBeInTheDocument();
    });

    // 2. 入力テスト (user-event を使うのが推奨)
    it('allows users to input data', async () => {
        const user = userEvent.setup();
        const mockOnAddStock = vi.fn();
        render(<AddStockForm onAddStock={mockOnAddStock} />);

        const tickerInput = screen.getByLabelText(/銘柄コード:\s*$/) as HTMLInputElement;
        const nameInput = screen.getByLabelText(/銘柄名:\s*$/) as HTMLInputElement;
        const quantityInput = screen.getByLabelText(/株数:\s*$/) as HTMLInputElement;
        const priceInput = screen.getByLabelText(/取得単価 \(円\):\s*$/) as HTMLInputElement;

        await user.type(tickerInput, 'AAPL');
        await user.type(nameInput, 'Apple Inc.');
        await user.type(quantityInput, '10');
        await user.type(priceInput, '150');

        expect(tickerInput.value).toBe('AAPL');
        expect(nameInput.value).toBe('Apple Inc.');
        expect(quantityInput.value).toBe('10');
        expect(priceInput.value).toBe('150');
    });

    // 3. バリデーションエラーテスト
    it('shows validation errors when submitting empty required fields', async () => {
        const user = userEvent.setup();
        const mockOnAddStock = vi.fn();
        render(<AddStockForm onAddStock={mockOnAddStock} />);

        const submitButton = screen.getByRole('button', { name: '追加する' });
        await user.click(submitButton);
        // エラーメッセージが表示されることを確認
        const tickerInput = screen.getByLabelText(/銘柄コード:\s*$/) as HTMLInputElement;
        const nameInput = screen.getByLabelText(/銘柄名:\s*$/) as HTMLInputElement;
        const quantityInput = screen.getByLabelText(/株数:\s*$/) as HTMLInputElement;
        const priceInput = screen.getByLabelText(/取得単価 \(円\):\s*$/) as HTMLInputElement;

        expect(tickerInput.validity.valueMissing).toBe(true);
        expect(nameInput.validity.valueMissing).toBe(true);
        expect(quantityInput.validity.valueMissing).toBe(true);
        expect(priceInput.validity.valueMissing).toBe(true);

        // onAddStock が呼ばれていないことを確認
        expect(mockOnAddStock).not.toHaveBeenCalled();
    });

    // 4. 正常な送信テスト
    it('calls onAddStock with correct data and resets form on valid submission', async () => {
        const user = userEvent.setup();
        const mockOnAddStock = vi.fn();
        render(<AddStockForm onAddStock={mockOnAddStock} />);

        // 有効なデータを入力
        await user.type(screen.getByLabelText(/銘柄コード:\s*$/), 'MSFT');
        await user.type(screen.getByLabelText(/銘柄名:\s*$/), 'Microsoft');
        await user.type(screen.getByLabelText(/株数:\s*$/), '5');
        await user.type(screen.getByLabelText(/取得単価 \(円\):\s*$/), '300');

        // 送信
        await user.click(screen.getByRole('button', { name: '追加する' }));

        // onAddStock が正しい引数で呼ばれたか確認
        expect(mockOnAddStock).toHaveBeenCalledTimes(1);
        expect(mockOnAddStock).toHaveBeenCalledWith({
            ticker: 'MSFT',
            name: 'Microsoft',
            quantity: 5,
            purchasePrice: 300,
        });

        // フォームがリセットされたか確認 (入力フィールドが空になっているか)
        expect((screen.getByLabelText(/銘柄コード:\s*$/) as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText(/銘柄名:\s*$/) as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText(/株数:\s*$/) as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText(/取得単価 \(円\):\s*$/) as HTMLInputElement).value).toBe('');

        // エラーメッセージが表示されていないことを確認
        expect(screen.queryByText(/銘柄コードを入力してください。/)).not.toBeInTheDocument();
    });
});