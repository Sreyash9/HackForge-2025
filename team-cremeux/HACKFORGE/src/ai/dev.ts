'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/finance-chatbot-assistance.ts';
import '@/ai/flows/tax-saving-tips.ts';
import '@/ai/flows/scam-contract-alerts.ts';
import '@/ai/flows/tax-news-flow.ts';
import '@/ai/flows/scam-list-flow.ts';
import '@/ai/flows/goal-based-savings-flow.ts';
import '@/ai/flows/bill-analysis-flow.ts';
