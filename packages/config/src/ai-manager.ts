import { AIProviderAdapter, AIModelProvider, AIRequest, AIResponse } from './ai-types';
import { MockAIAdapter } from './mock-ai-adapter';

export class AIModelManager {
  private providers: Map<string, AIProviderAdapter> = new Map();
  private configurations: AIModelProvider[] = [];
  private defaultProviderId: string;

  constructor() {
    this.initializeMockProvider();
  }

  private initializeMockProvider(): void {
    const mockConfig: AIModelProvider = {
      id: 'mock-default',
      name: 'Mock AI Provider',
      type: 'local',
      model: 'mock-gpt-4',
      isDefault: true,
      status: 'connected'
    };

    this.addProvider(mockConfig);
  }

  async addProvider(config: AIModelProvider): Promise<void> {
    let adapter: AIProviderAdapter;

    switch (config.type) {
      case 'local':
        adapter = new MockAIAdapter();
        break;
      case 'openai':
        // TODO: Implement OpenAI adapter
        throw new Error('OpenAI adapter not yet implemented');
      case 'google':
        // TODO: Implement Google adapter
        throw new Error('Google adapter not yet implemented');
      case 'custom':
        // TODO: Implement custom adapter
        throw new Error('Custom adapter not yet implemented');
      default:
        throw new Error(`Unsupported provider type: ${config.type}`);
    }

    await adapter.initialize(config);
    this.providers.set(config.id, adapter);
    this.configurations.push(config);

    if (config.isDefault) {
      this.defaultProviderId = config.id;
    }
  }

  async chat(request: AIRequest, providerId?: string): Promise<AIResponse> {
    const targetProviderId = providerId || this.defaultProviderId;
    const adapter = this.providers.get(targetProviderId);

    if (!adapter) {
      throw new Error(`Provider not found: ${targetProviderId}`);
    }

    try {
      return await adapter.chat(request);
    } catch (error) {
      // Try fallback provider if available
      if (providerId !== this.defaultProviderId) {
        return await this.chat(request, this.defaultProviderId);
      }
      throw error;
    }
  }

  getProviders(): AIModelProvider[] {
    return [...this.configurations];
  }

  getProvider(id: string): AIModelProvider | undefined {
    return this.configurations.find(p => p.id === id);
  }

  async updateProvider(id: string, updates: Partial<AIModelProvider>): Promise<void> {
    const index = this.configurations.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider not found: ${id}`);
    }

    const updatedConfig = { ...this.configurations[index], ...updates };
    this.configurations[index] = updatedConfig;

    // Reinitialize the adapter if it exists
    const adapter = this.providers.get(id);
    if (adapter) {
      await adapter.initialize(updatedConfig);
    }
  }

  async removeProvider(id: string): Promise<void> {
    if (id === this.defaultProviderId) {
      throw new Error('Cannot remove the default provider');
    }

    this.providers.delete(id);
    this.configurations = this.configurations.filter(p => p.id !== id);
  }

  async setDefaultProvider(id: string): Promise<void> {
    const provider = this.configurations.find(p => p.id === id);
    if (!provider) {
      throw new Error(`Provider not found: ${id}`);
    }

    // Remove default flag from current default
    this.configurations.forEach(p => p.isDefault = false);
    
    // Set new default
    provider.isDefault = true;
    this.defaultProviderId = id;
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [id, adapter] of this.providers) {
      try {
        results[id] = await adapter.isHealthy();
      } catch {
        results[id] = false;
      }
    }

    return results;
  }
}
