export interface AIStructuredRequest {
  action: string;
  payload: Record<string, unknown>;
}

export interface AIProvider {
  generateStructuredData<T>(input: AIStructuredRequest): Promise<T>;
}
