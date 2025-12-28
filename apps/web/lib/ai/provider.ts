/**
 * AI Provider Interface for Oto Spaces
 * Abstraction layer to support multiple LLM providers (OpenAI, Anthropic, local, custom)
 * This ensures no hard dependency on any single LLM provider
 */

export interface AIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AIContext {
    spaceId?: string;
    spaceType?: 'Team' | 'Community' | 'Room';
    userId?: string;
    conversationHistory?: AIMessage[];
    metadata?: Record<string, any>;
}

export interface ModerationResult {
    flagged: boolean;
    reason?: string;
    categories?: string[];
    severity?: 'low' | 'medium' | 'high';
}

export interface TaskSuggestion {
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
}

/**
 * Base interface that all AI providers must implement
 */
export interface AIProvider {
    name: string;
    type: 'openai' | 'anthropic' | 'local' | 'custom' | 'hosted';

    /**
     * Generate a response based on a prompt and context
     */
    generateResponse(prompt: string, context?: AIContext): Promise<string>;

    /**
     * Moderate content for policy violations
     */
    moderate(content: string): Promise<ModerationResult>;

    /**
     * Summarize long-form content
     */
    summarize(content: string, maxLength?: number): Promise<string>;

    /**
     * Extract actionable tasks from conversation or content
     */
    extractTasks(conversation: string): Promise<TaskSuggestion[]>;

    /**
     * Check if the provider is available and configured
     */
    isAvailable(): Promise<boolean>;
}

/**
 * Registry to manage multiple AI providers
 */
export class AIProviderRegistry {
    private providers: Map<string, AIProvider> = new Map();
    private defaultProvider?: string;

    /**
     * Register a new AI provider
     */
    register(name: string, provider: AIProvider): void {
        this.providers.set(name, provider);
        console.log(`✅ Registered AI provider: ${name} (${provider.type})`);
    }

    /**
     * Get a specific provider by name
     */
    get(name: string): AIProvider | undefined {
        return this.providers.get(name);
    }

    /**
     * Get all registered providers
     */
    getAll(): AIProvider[] {
        return Array.from(this.providers.values());
    }

    /**
     * Set the default provider
     */
    setDefault(name: string): void {
        if (!this.providers.has(name)) {
            throw new Error(`Provider "${name}" not found`);
        }
        this.defaultProvider = name;
        console.log(`✅ Set default AI provider: ${name}`);
    }

    /**
     * Get the default provider (or first available if none set)
     */
    getDefault(): AIProvider {
        if (this.defaultProvider && this.providers.has(this.defaultProvider)) {
            return this.providers.get(this.defaultProvider)!;
        }

        // Return first available provider
        const first = Array.from(this.providers.values())[0];
        if (!first) {
            throw new Error('No AI providers registered');
        }

        return first;
    }

    /**
     * Check if any providers are registered
     */
    hasProviders(): boolean {
        return this.providers.size > 0;
    }
}

/**
 * Global registry instance
 */
export const aiRegistry = new AIProviderRegistry();

/**
 * Mock AI Provider for testing (no real LLM required)
 */
export class MockAIProvider implements AIProvider {
    name = 'mock';
    type: 'custom' = 'custom';

    async generateResponse(prompt: string, context?: AIContext): Promise<string> {
        return `Mock response to: "${prompt.substring(0, 50)}..."`;
    }

    async moderate(content: string): Promise<ModerationResult> {
        // Simple keyword-based moderation for testing
        const flaggedWords = ['spam', 'abuse', 'inappropriate'];
        const flagged = flaggedWords.some(word => content.toLowerCase().includes(word));

        return {
            flagged,
            reason: flagged ? 'Contains flagged keywords' : undefined,
            severity: flagged ? 'medium' : undefined
        };
    }

    async summarize(content: string, maxLength = 100): Promise<string> {
        return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }

    async extractTasks(conversation: string): Promise<TaskSuggestion[]> {
        // Simple task extraction based on keywords
        const tasks: TaskSuggestion[] = [];
        const lines = conversation.split('\n');

        lines.forEach(line => {
            if (line.toLowerCase().includes('todo') || line.toLowerCase().includes('task')) {
                tasks.push({
                    title: line.trim(),
                    description: 'Extracted from conversation',
                    priority: 'medium'
                });
            }
        });

        return tasks;
    }

    async isAvailable(): Promise<boolean> {
        return true;
    }
}

// Register mock provider by default for testing
aiRegistry.register('mock', new MockAIProvider());
aiRegistry.setDefault('mock');
