/**
 * 사용자 딕셔너리 관리를 위한 Zustand 스토어
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DictionaryEntry } from '../types/prompt';

interface DictionaryState {
  /** 언어쌍별 사용자 딕셔너리 */
  userDictionaries: Record<string, DictionaryEntry[]>;

  /** 딕셔너리 다이얼로그 상태 */
  isDialogOpen: boolean;
  /** 현재 편집 중인 언어쌍 ID */
  editingPairId: string | null;

  /** 다이얼로그 열기 */
  openDialog: (pairId: string) => void;
  /** 다이얼로그 닫기 */
  closeDialog: () => void;

  /** 특정 언어쌍의 사용자 딕셔너리 조회 */
  getUserDictionary: (pairId: string) => DictionaryEntry[];
  /** 딕셔너리 항목 추가 */
  addEntry: (pairId: string, entry: DictionaryEntry) => void;
  /** 딕셔너리 항목 수정 */
  updateEntry: (pairId: string, index: number, entry: DictionaryEntry) => void;
  /** 딕셔너리 항목 삭제 */
  removeEntry: (pairId: string, index: number) => void;
  /** 특정 언어쌍의 사용자 딕셔너리 전체 교체 */
  setUserDictionary: (pairId: string, entries: DictionaryEntry[]) => void;
  /** 특정 언어쌍의 사용자 딕셔너리 초기화 */
  clearUserDictionary: (pairId: string) => void;
}

export const useDictionaryStore = create<DictionaryState>()(
  persist(
    (set, get) => ({
      userDictionaries: {},
      isDialogOpen: false,
      editingPairId: null,

      openDialog: (pairId: string) => {
        set({ isDialogOpen: true, editingPairId: pairId });
      },

      closeDialog: () => {
        set({ isDialogOpen: false, editingPairId: null });
      },

      getUserDictionary: (pairId: string) => {
        return get().userDictionaries[pairId] ?? [];
      },

      addEntry: (pairId: string, entry: DictionaryEntry) => {
        set(state => ({
          userDictionaries: {
            ...state.userDictionaries,
            [pairId]: [...(state.userDictionaries[pairId] ?? []), entry],
          },
        }));
      },

      updateEntry: (pairId: string, index: number, entry: DictionaryEntry) => {
        set(state => {
          const current = state.userDictionaries[pairId] ?? [];
          const updated = [...current];
          updated[index] = entry;
          return {
            userDictionaries: {
              ...state.userDictionaries,
              [pairId]: updated,
            },
          };
        });
      },

      removeEntry: (pairId: string, index: number) => {
        set(state => {
          const current = state.userDictionaries[pairId] ?? [];
          return {
            userDictionaries: {
              ...state.userDictionaries,
              [pairId]: current.filter((_, i) => i !== index),
            },
          };
        });
      },

      setUserDictionary: (pairId: string, entries: DictionaryEntry[]) => {
        set(state => ({
          userDictionaries: {
            ...state.userDictionaries,
            [pairId]: entries,
          },
        }));
      },

      clearUserDictionary: (pairId: string) => {
        set(state => ({
          userDictionaries: {
            ...state.userDictionaries,
            [pairId]: [],
          },
        }));
      },
    }),
    {
      name: 'dictionary-storage',
      // 다이얼로그 상태는 저장하지 않음
      partialize: state => ({ userDictionaries: state.userDictionaries }),
    }
  )
);
