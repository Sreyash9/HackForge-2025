
export type Portfolio = {
    quantity: number;
    averagePrice: number;
};

export type Transaction = {
    stockId: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    date: string;
};
