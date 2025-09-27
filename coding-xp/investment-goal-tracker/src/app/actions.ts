
'use server';

import {passwordResetAssistance} from '@/ai/flows/password-reset-assistance';
import {
  getGoalSuggestion as getAIGoalSuggestionFlow,
  GoalSuggestionInput,
} from '@/ai/flows/goal-suggestion';
import {chatBot} from '@/ai/flows/chat-bot';
import {generateQuiz} from '@/ai/flows/quiz-flow';
import {generateMyth} from '@/ai/flows/myth-flow';
import {generateSpeech as generateSpeechFlow} from '@/ai/flows/tts-flow';
import {
  ref,
  set,
  push,
  serverTimestamp,
  update,
  get,
  runTransaction,
} from 'firebase/database';
import {db} from '@/lib/firebase';
import {auth} from '@/lib/firebase';
import type {QuizOutput} from '@/lib/quiz-types';
import type {MythOutput} from '@/lib/myth-types';
import {updateProfile} from 'firebase/auth';
import { runFinancialAssessment } from '@/ai/flows/financial-assessment-flow';
import type { AssessmentInput } from '@/ai/flows/financial-assessment-flow';

export async function getPasswordResetHelp(
  email: string,
  loginAttempts: number
): Promise<string> {
  if (loginAttempts < 3) {
    return 'You must have at least 3 failed login attempts to receive assistance.';
  }
  try {
    const result = await passwordResetAssistance({email, loginAttempts});
    return result.assistanceMessage;
  } catch (error) {
    console.error('Error in passwordResetAssistance flow:', error);
    return "We're sorry, but we're unable to provide AI assistance at this moment. Please check your email for a reset link or contact support directly.";
  }
}

export async function getAIGoalSuggestion(
  input: GoalSuggestionInput,
  userId: string
): Promise<string> {
  try {
    const result = await getAIGoalSuggestionFlow(input);

    const suggestionRef = ref(db, `goal_suggestion/${userId}`);
    const newSuggestionRef = push(suggestionRef);
    await set(newSuggestionRef, {
      goalName: input.name,
      suggestion: result.suggestion,
      createdAt: new Date().toISOString(),
    });

    return result.suggestion;
  } catch (error) {
    console.error('Error in getAIGoalSuggestion flow:', error);
    return "We're sorry, but we're unable to provide AI assistance at this moment. Please try again later.";
  }
}

export async function handleAiChatMessage(message: string, userName: string) {
  if (!message.startsWith('@ai')) return;

  const question = message.replace('@ai', '').trim();

  try {
    const result = await chatBot({message: question, userName});

    const messagesRef = ref(db, 'messages');
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      uid: 'ai-assistant',
      displayName: 'FinAdvisor',
      text: result.response,
      timestamp: serverTimestamp(),
      isBot: true,
    });
  } catch (error) {
    console.error('Error in chatBot flow:', error);
    // Optionally, you could post an error message back to the chat room
    const messagesRef = ref(db, 'messages');
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      uid: 'ai-assistant',
      displayName: 'FinAdvisor',
      text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      timestamp: serverTimestamp(),
      isBot: true,
    });
  }
}

export async function handleGlobalChatMessage(
  message: string,
  userName: string,
  userId: string
): Promise<void> {
  const question = message.trim();

  try {
    const result = await chatBot({message: question, userName});

    const conversationRef = ref(db, `chatbot_conversations/${userId}`);
    const newAiMessageRef = push(conversationRef);

    await set(newAiMessageRef, {
      sender: 'ai',
      text: result.response,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error in global chatBot flow:', error);
    const conversationRef = ref(db, `chatbot_conversations/${userId}`);
    const newErrorMessageRef = push(conversationRef);
    await set(newErrorMessageRef, {
      sender: 'ai',
      text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      timestamp: serverTimestamp(),
    });
  }
}

export async function generateQuizFlow(): Promise<QuizOutput> {
  try {
    return await generateQuiz();
  } catch (error) {
    console.error('Error in generateQuiz flow:', error);
    throw new Error('Failed to generate quiz.');
  }
}

export async function generateMythFlow(): Promise<MythOutput> {
  try {
    return await generateMyth();
  } catch (error) {
    console.error('Error in generateMyth flow:', error);
    throw new Error('Failed to generate myth.');
  }
}

async function initializeDynamicProgress(userId: string) {
  const progressRef = ref(db, `user_dynamic_progress/${userId}`);
  const snapshot = await get(progressRef);
  if (!snapshot.exists()) {
    await set(progressRef, {
      completedQuizzes: 0,
      bustedMyths: 0,
      updatedAt: serverTimestamp(),
    });
  }
}

export async function incrementQuizCounter(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  await initializeDynamicProgress(user.uid);
  const counterRef = ref(
    db,
    `user_dynamic_progress/${user.uid}/completedQuizzes`
  );
  await runTransaction(counterRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });
  const updatedAtRef = ref(db, `user_dynamic_progress/${user.uid}/updatedAt`);
  await set(updatedAtRef, serverTimestamp());
}

export async function incrementMythCounter(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  await initializeDynamicProgress(user.uid);
  const counterRef = ref(db, `user_dynamic_progress/${user.uid}/bustedMyths`);
  await runTransaction(counterRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });
  const updatedAtRef = ref(db, `user_dynamic_progress/${user.uid}/updatedAt`);
  await set(updatedAtRef, serverTimestamp());
}

export async function getSpeechAudio(text: string): Promise<string> {
  try {
    return await generateSpeechFlow(text);
  } catch (error) {
    console.error('Error in generateSpeech flow:', error);
    throw new Error('Failed to generate audio.');
  }
}

export async function updateUserProfile(name: string): Promise<{success: boolean; message: string}> {
  const user = auth.currentUser;
  if (!user) {
    return {success: false, message: 'You must be logged in to update your profile.'};
  }

  try {
    // Update Firebase Auth display name
    await updateProfile(user, {displayName: name});

    // Update name in Realtime Database
    const userRef = ref(db, `users/${user.uid}/name`);
    await set(userRef, name);

    return {success: true, message: 'Profile updated successfully!'};
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return {success: false, message: error.message || 'An unexpected error occurred.'};
  }
}

export async function generateFinancialAssessment(params: { userId: string; input: AssessmentInput }): Promise<{success: boolean; analysis?: string; message?: string; id?: string}> {
  const { userId, input } = params || ({} as any);
  if (!userId) {
    return { success: false, message: 'You must be logged in to generate an assessment.' };
  }

  try {
    const analysis = await runFinancialAssessment(input);
    const assessmentsRef = ref(db, `Financial_assessment_report/${userId}`);
    const newRef = push(assessmentsRef);
    await set(newRef, {
      input,
      analysis,
      createdAt: serverTimestamp(),
    });
    return { success: true, analysis, id: newRef.key ?? undefined };
  } catch (error) {
    console.error('Error generating financial assessment:', error);
    return { success: false, message: 'Failed to generate financial assessment. Please try again.' };
  }
}
