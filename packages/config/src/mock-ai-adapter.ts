import { AIProviderAdapter, AIRequest, AIResponse, AIModelProvider } from './ai-types';

export class MockAIAdapter implements AIProviderAdapter {
  name = 'Mock AI';
  type = 'local' as const;
  private config: AIModelProvider;

  async initialize(config: AIModelProvider): Promise<void> {
    this.config = config;
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    // Simulate network delay
    await this.delay(800 + Math.random() * 1200);

    // Simulate occasional errors
    if (Math.random() < 0.05) {
      throw new Error('Mock AI service temporarily unavailable');
    }

    const lastMessage = request.messages[request.messages.length - 1];
    const response = this.generateResponse(lastMessage.content, request.tools);

    return {
      content: response.content,
      toolCalls: response.toolCalls,
      usage: {
        promptTokens: this.estimateTokens(JSON.stringify(request.messages)),
        completionTokens: this.estimateTokens(response.content),
        totalTokens: 0
      },
      model: this.config.model,
      provider: this.config.name
    };
  }

  validateConfig(config: AIModelProvider): boolean {
    return !!config.id && !!config.name;
  }

  async isHealthy(): Promise<boolean> {
    return Math.random() > 0.1; // 90% uptime simulation
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateResponse(userMessage: string, tools?: any[]): { content: string; toolCalls?: any[] } {
    const responses = [
      "I understand your request. Let me help you with that.",
      "Based on the information provided, I can assist you with this task.",
      "That's an interesting question. Here's what I can do to help.",
      "I'll process this and provide you with the best possible solution.",
      "Let me analyze this and get back to you with a comprehensive response."
    ];

    const toolResponses = [
      "I'll use the available tools to gather the information you need.",
      "I can help you with that by using the integrated tools and services.",
      "Let me check the available resources and tools to assist you better."
    ];

    let content = responses[Math.floor(Math.random() * responses.length)];
    
    if (tools && tools.length > 0) {
      content = toolResponses[Math.floor(Math.random() * toolResponses.length)];
      
      // Simulate tool calls
      const toolCalls = tools.slice(0, Math.min(2, tools.length)).map((tool, index) => ({
        id: `call_${Date.now()}_${index}`,
        type: 'function',
        function: {
          name: tool.name || 'search',
          arguments: {
            query: userMessage,
            timestamp: new Date().toISOString()
          }
        }
      }));

      return { content, toolCalls };
    }

    return { content };
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
