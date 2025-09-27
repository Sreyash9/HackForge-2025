
'use server';

import { financeChatbotAssistance } from '@/ai/flows/finance-chatbot-assistance';
import type { FinanceChatbotInput as FinanceChatbotQuery } from '@/ai/flows/finance-chatbot-assistance';
import { getScamContractAlerts, type ScamContractAlertsInput } from '@/ai/flows/scam-contract-alerts';
import { taxSavingTips, type TaxSavingTipsInput, type TaxAnalysisOutput } from '@/ai/flows/tax-saving-tips';
import { getTaxNews, type TaxNewsInput } from '@/ai/flows/tax-news-flow';
import { getScamList } from '@/ai/flows/scam-list-flow';
import { getGoalBasedSavingsPlan, type GoalBasedSavingsInput } from '@/ai/flows/goal-based-savings-flow';
import { analyzeBill, type BillAnalysisInput } from '@/ai/flows/bill-analysis-flow';
import { z } from 'zod';


// A helper function to simulate a delay, making UI states like loading more visible.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getTaxTips(input: TaxSavingTipsInput) {
  await sleep(1500); // Simulate network latency & AI processing time
  try {
    const result = await taxSavingTips(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate tax analysis." };
  }
}

export async function checkContract(input: ScamContractAlertsInput) {
    await sleep(1500);
    try {
        const result = await getScamContractAlerts(input);
        return { success: true, data: result };
    } catch(error) {
        console.error(error);
        return { success: false, error: "Failed to analyze the contract."};
    }
}

export async function getChatbotResponse(input: string) {
    await sleep(1000);
    try {
        const result = await financeChatbotAssistance(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "I'm sorry, I couldn't process that request."};
    }
}

export async function fetchTaxNews(input: TaxNewsInput) {
    await sleep(1500);
    try {
        const result = await getTaxNews(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to fetch tax news." };
    }
}

export async function fetchScamList() {
    await sleep(1500);
    try {
        const result = await getScamList();
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to fetch scam list." };
    }
}

export async function getSavingsPlan(input: GoalBasedSavingsInput) {
    await sleep(1500);
    try {
        const result = await getGoalBasedSavingsPlan(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate a savings plan." };
    }
}

export async function analyzeBillAction(input: BillAnalysisInput) {
    await sleep(2000);
    try {
        const result = await analyzeBill(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to analyze the bill." };
    }
}
