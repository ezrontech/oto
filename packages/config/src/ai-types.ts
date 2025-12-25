export interface AIModelProvider {
  id: string;
  name: string;
  type: 'openai' | 'google' | 'local' | 'custom';
  apiKey?: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  isDefault?: boolean;
  status: 'connected' | 'disconnected' | 'error';
}

export interface AIRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  tools?: ToolCall[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface AIResponse {
  content: string;
  toolCalls?: ToolCall[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

export interface AIProviderAdapter {
  name: string;
  type: AIModelProvider['type'];
  initialize(config: AIModelProvider): Promise<void>;
  chat(request: AIRequest): Promise<AIResponse>;
  validateConfig(config: AIModelProvider): boolean;
  isHealthy(): Promise<boolean>;
}

export interface MockAIConfig {
  responseDelay: number;
  errorRate: number;
  toolSimulationEnabled: boolean;
  realisticResponses: boolean;
}

export interface ModelConfiguration {
  providers: AIModelProvider[];
  defaultProvider: string;
  fallbackProvider?: string;
  mockConfig: MockAIConfig;
}
