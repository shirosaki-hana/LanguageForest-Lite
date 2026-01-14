/**
 * 번역 프롬프트 빌드 레이어
 */

import type { OllamaChatMessage } from '../types/ollama';

/**
 * 한국어 -> 영어 번역을 위한 시스템 프롬프트
 */
const KOREAN_TO_ENGLISH_SYSTEM_PROMPT = `You are a professional translator. Your task is to translate Korean text to English.

Rules:
- Translate the given Korean text to natural, fluent English.
- Maintain the original tone and style (formal/informal).
- Preserve any proper nouns, brand names, or technical terms appropriately.
- Do NOT add explanations, comments, or notes.
- Output ONLY the translated English text, nothing else.`;

/**
 * 번역 요청을 위한 메시지 배열 생성
 * @param sourceText 원문 (한국어)
 * @returns Ollama 채팅 메시지 배열
 */
export function buildTranslationMessages(sourceText: string): OllamaChatMessage[] {
  return [
    {
      role: 'system',
      content: KOREAN_TO_ENGLISH_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: sourceText,
    },
  ];
}
