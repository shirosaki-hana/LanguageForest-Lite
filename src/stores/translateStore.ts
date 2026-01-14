/**
 * 번역 기능을 위한 Zustand 스토어
 */

import { create } from 'zustand';
import i18n from '../i18n';
import type { OllamaModel } from '../types/ollama';
import { fetchModels, streamChat } from '../api/ollamaApi';
import { buildTranslationMessages } from '../utils/promptBuilder';
import { snackbar } from './snackbarStore';

interface TranslateState {
  // 모델 관련
  models: OllamaModel[];
  selectedModel: string;
  isLoadingModels: boolean;

  // 번역 관련
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;

  // 스트리밍 중단을 위한 AbortController
  abortController: AbortController | null;

  // 액션
  loadModels: () => Promise<void>;
  setSelectedModel: (model: string) => void;
  setSourceText: (text: string) => void;
  translate: () => Promise<void>;
  stopTranslation: () => void;
  clearTranslation: () => void;
}

export const useTranslateStore = create<TranslateState>((set, get) => ({
  // 초기 상태
  models: [],
  selectedModel: '',
  isLoadingModels: false,

  sourceText: '',
  translatedText: '',
  isTranslating: false,

  abortController: null,

  // 모델 목록 불러오기
  loadModels: async () => {
    set({ isLoadingModels: true });

    try {
      const response = await fetchModels();
      const models = response.models || [];

      set({
        models,
        // 모델이 있고 선택된 모델이 없으면 첫 번째 모델 선택
        selectedModel: models.length > 0 ? models[0].name : '',
      });

      if (models.length === 0) {
        snackbar.warning(i18n.t('translate.noModelsWarning'));
      }
    } catch {
      snackbar.error(i18n.t('translate.loadModelsError'));
    } finally {
      set({ isLoadingModels: false });
    }
  },

  // 모델 선택
  setSelectedModel: (model: string) => {
    set({ selectedModel: model });
  },

  // 원문 입력
  setSourceText: (text: string) => {
    set({ sourceText: text });
  },

  // 번역 실행
  translate: async () => {
    const { sourceText, selectedModel, isTranslating } = get();

    // 유효성 검사
    if (!sourceText.trim()) {
      snackbar.warning(i18n.t('translate.noTextWarning'));
      return;
    }

    if (!selectedModel) {
      snackbar.warning(i18n.t('translate.noModelWarning'));
      return;
    }

    if (isTranslating) {
      return;
    }

    // AbortController 생성
    const abortController = new AbortController();

    set({
      isTranslating: true,
      translatedText: '',
      abortController,
    });

    try {
      const messages = buildTranslationMessages(sourceText);

      await streamChat(
        {
          model: selectedModel,
          messages,
          stream: true,
        },
        chunk => {
          // 스트리밍으로 받은 텍스트를 누적
          if (chunk.message?.content) {
            set(state => ({
              translatedText: state.translatedText + chunk.message.content,
            }));
          }
        },
        abortController.signal,
      );
    } catch (error) {
      // 사용자가 중단한 경우
      if (error instanceof Error && error.name === 'AbortError') {
        snackbar.info(i18n.t('translate.translateStopped'));
        return;
      }
      snackbar.error(i18n.t('translate.translateError'));
    } finally {
      set({
        isTranslating: false,
        abortController: null,
      });
    }
  },

  // 번역 중단
  stopTranslation: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
  },

  // 번역 초기화
  clearTranslation: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }

    set({
      sourceText: '',
      translatedText: '',
      isTranslating: false,
      abortController: null,
    });
  },
}));
