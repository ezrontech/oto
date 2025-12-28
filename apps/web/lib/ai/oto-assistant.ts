/**
 * Oto AI Assistant
 * Handles @Oto mentions and AI-powered assistance across all space types
 * Uses the AI provider abstraction to support multiple LLMs
 */

import { AIProvider, AIContext, aiRegistry } from './provider';

export class OtoAssistant {
    private provider: AIProvider;

    constructor(provider?: AIProvider) {
        this.provider = provider || aiRegistry.getDefault();
    }

    /**
     * Handle @Oto mention in a message
     */
    async handleMention(message: string, spaceContext: AIContext): Promise<string> {
        const prompt = this.buildPrompt(message, spaceContext);
        return this.provider.generateResponse(prompt, spaceContext);
    }

    /**
     * Moderate content for policy violations
     */
    async moderateContent(content: string): Promise<{ approved: boolean; reason?: string }> {
        const result = await this.provider.moderate(content);
        return {
            approved: !result.flagged,
            reason: result.reason
        };
    }

    /**
     * Suggest tasks based on conversation
     */
    async suggestTasks(conversation: string): Promise<any[]> {
        return this.provider.extractTasks(conversation);
    }

    /**
     * Summarize long content
     */
    async summarize(content: string): Promise<string> {
        return this.provider.summarize(content);
    }

    /**
     * Build context-aware prompt based on space type
     */
    private buildPrompt(message: string, context: AIContext): string {
        let systemPrompt = 'You are Oto, a helpful AI assistant.';

        switch (context.spaceType) {
            case 'Team':
                systemPrompt += ' You help teams collaborate, manage tasks, and stay organized.';
                break;
            case 'Community':
                systemPrompt += ' You help creators engage with their community and moderate content.';
                break;
            case 'Room':
                systemPrompt += ' You help small groups plan, coordinate, and stay connected.';
                break;
        }

        return `${systemPrompt}\n\nUser message: ${message}`;
    }

    /**
     * Check if Oto is mentioned in a message
     */
    static isMentioned(message: string): boolean {
        return message.toLowerCase().includes('@oto');
    }

    /**
     * Extract the actual message without the @Oto mention
     */
    static extractMessage(message: string): string {
        return message.replace(/@oto/gi, '').trim();
    }
}

/**
 * Global Oto instance
 */
export const oto = new OtoAssistant();
