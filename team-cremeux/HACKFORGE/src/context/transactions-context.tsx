
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction } from '@/components/dashboard/recent-transactions';
import { initialTransactions } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type TransactionInput = Omit<Transaction, 'id' | 'date' | 'avatar'>;

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => void;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.sort((a, b) => b.date.getTime() - a.date.getTime()));

  const addTransaction = (transaction: TransactionInput) => {
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: new Date(),
      avatar: PlaceHolderImages.find(p => p.id === 'avatar-2'), // placeholder avatar
      ...transaction,
    };
    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
