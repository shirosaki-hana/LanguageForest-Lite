/**
 * 딕셔너리 관리 다이얼로그
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
  Divider,
  Chip,
  Paper,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useDictionaryStore } from '../stores/dictionaryStore';
import { getPromptTemplate } from '../utils/promptBuilder';
import type { DictionaryEntry, PromptTemplate } from '../types/prompt';

interface DictionaryDialogContentProps {
  template: PromptTemplate;
  editingPairId: string;
  onClose: () => void;
}

/**
 * 다이얼로그 내부 컨텐츠 (열릴 때만 마운트됨)
 */
function DictionaryDialogContent({ template, editingPairId, onClose }: DictionaryDialogContentProps) {
  const { t } = useTranslation();
  const { getUserDictionary, setUserDictionary } = useDictionaryStore();

  // useState 초기값으로 바로 로드 - useEffect 불필요!
  const [localEntries, setLocalEntries] = useState<DictionaryEntry[]>(() => getUserDictionary(editingPairId));
  const [showDefault, setShowDefault] = useState(false);

  // 항목 추가
  const handleAddEntry = () => {
    setLocalEntries([...localEntries, { from: '', to: '' }]);
  };

  // 항목 수정
  const handleUpdateEntry = (index: number, field: 'from' | 'to', value: string) => {
    const updated = [...localEntries];
    updated[index] = { ...updated[index], [field]: value };
    setLocalEntries(updated);
  };

  // 항목 삭제
  const handleRemoveEntry = (index: number) => {
    setLocalEntries(localEntries.filter((_, i) => i !== index));
  };

  // 저장
  const handleSave = () => {
    // 빈 항목 제거 후 저장
    const filtered = localEntries.filter(entry => entry.from.trim() && entry.to.trim());
    setUserDictionary(editingPairId, filtered);
    onClose();
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography variant='h6' component='div'>
            {t('dictionary.title')}
          </Typography>
          <Chip label={template.label} size='small' color='primary' variant='outlined' />
        </Stack>
        <IconButton edge='end' color='inherit' onClick={onClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2}>
          {/* 기본 딕셔너리 (접을 수 있음) */}
          <Box>
            <Button
              size='small'
              onClick={() => setShowDefault(!showDefault)}
              startIcon={showDefault ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mb: 1, textTransform: 'none' }}
            >
              {t('dictionary.defaultDictionary')} ({template.defaultDictionary.length})
            </Button>
            <Collapse in={showDefault}>
              <Paper
                variant='outlined'
                sx={{
                  p: 1.5,
                  bgcolor: 'action.hover',
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <Stack spacing={0.5}>
                  {template.defaultDictionary.map((entry, index) => (
                    <Typography key={index} variant='body2' color='text.secondary' sx={{ fontSize: '0.8rem' }}>
                      "{entry.from}" → "{entry.to}"
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            </Collapse>
          </Box>

          <Divider />

          {/* 사용자 딕셔너리 */}
          <Box>
            <Typography variant='subtitle2' gutterBottom sx={{ fontWeight: 600 }}>
              {t('dictionary.userDictionary')}
            </Typography>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 2 }}>
              {t('dictionary.userDictionaryDescription')}
            </Typography>

            <Stack spacing={1.5}>
              {localEntries.map((entry, index) => (
                <Stack key={index} direction='row' spacing={1} alignItems='center'>
                  <TextField
                    size='small'
                    placeholder={t('dictionary.fromPlaceholder')}
                    value={entry.from}
                    onChange={e => handleUpdateEntry(index, 'from', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Typography color='text.secondary'>→</Typography>
                  <TextField
                    size='small'
                    placeholder={t('dictionary.toPlaceholder')}
                    value={entry.to}
                    onChange={e => handleUpdateEntry(index, 'to', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton size='small' onClick={() => handleRemoveEntry(index)} color='error'>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Stack>
              ))}

              {localEntries.length === 0 && (
                <Typography variant='body2' color='text.secondary' sx={{ py: 2, textAlign: 'center' }}>
                  {t('dictionary.empty')}
                </Typography>
              )}

              <Button startIcon={<AddIcon />} onClick={handleAddEntry} variant='outlined' size='small' sx={{ alignSelf: 'flex-start' }}>
                {t('dictionary.addEntry')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color='inherit'>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSave} variant='contained'>
          {t('common.save')}
        </Button>
      </DialogActions>
    </>
  );
}

export default function DictionaryDialog() {
  const { isDialogOpen, editingPairId, closeDialog } = useDictionaryStore();

  // 현재 편집 중인 언어쌍의 템플릿
  const template = editingPairId ? getPromptTemplate(editingPairId) : null;

  return (
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '80vh' },
      }}
    >
      {/* 다이얼로그가 열리고 template이 있을 때만 내부 컨텐츠 마운트 */}
      {isDialogOpen && template && editingPairId && (
        <DictionaryDialogContent template={template} editingPairId={editingPairId} onClose={closeDialog} />
      )}
    </Dialog>
  );
}
