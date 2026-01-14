/**
 * Ollama API 타입 정의
 */

// 모델 정보
export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

// /api/tags 응답
export interface OllamaTagsResponse {
  models: OllamaModel[];
}

// 채팅 메시지
export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// /api/chat 요청
export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
}

// /api/chat 스트리밍 응답 청크
export interface OllamaChatStreamChunk {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// /api/generate 요청
export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

// /api/generate 응답
export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}
