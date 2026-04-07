export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeneratedQuestion {
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface IAiProvider {
  chat(options: ChatCompletionOptions): Promise<string>;
  generateQuizQuestions(
    topic: string,
    count: number,
    difficulty?: string,
  ): Promise<GeneratedQuestion[]>;
}
