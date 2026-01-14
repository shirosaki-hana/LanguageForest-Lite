import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Translate as TranslateIcon,
  ContentCopy as CopyIcon,
  Clear as ClearIcon,
  Stop as StopIcon,
  SwapHoriz as SwapIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslateStore } from '../stores/translateStore';
import { useSettingsStore } from '../stores/settingsStore';
import { snackbar } from '../stores/snackbarStore';

export default function TranslatePage() {
  const { t } = useTranslation();
  const { openSettings } = useSettingsStore();

  const {
    models,
    selectedModel,
    isLoadingModels,
    sourceText,
    translatedText,
    isTranslating,
    loadModels,
    setSelectedModel,
    setSourceText,
    translate,
    stopTranslation,
    clearTranslation,
  } = useTranslateStore();

  // 최초 접속 시 모델 목록 불러오기
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // 번역문 복사
  const handleCopy = async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      snackbar.success(t('translate.copySuccess'));
    } catch {
      snackbar.error(t('translate.copyError'));
    }
  };

  // 원문 복사
  const handleCopySource = async () => {
    if (!sourceText) return;

    try {
      await navigator.clipboard.writeText(sourceText);
      snackbar.success(t('translate.copySuccess'));
    } catch {
      snackbar.error(t('translate.copyError'));
    }
  };

  return (
    <Container component='main' maxWidth='lg'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: 4,
        }}
      >
        {/* 헤더 */}
        <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(124,58,237,0.9))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TranslateIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('common.appName')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('translate.subtitle')}
            </Typography>
          </Box>
          {/* 설정 버튼 */}
          <Tooltip title={t('settings.title')}>
            <IconButton onClick={openSettings} size='large'>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* 모델 선택 */}
        <Paper
          elevation={0}
          sx={theme => ({
            p: 2,
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(2,6,23,0.55)',
          })}
        >
          <FormControl fullWidth size='small'>
            <InputLabel id='model-select-label'>{t('translate.modelSelect')}</InputLabel>
            <Select
              labelId='model-select-label'
              value={selectedModel}
              label={t('translate.modelSelect')}
              onChange={e => setSelectedModel(e.target.value)}
              disabled={isLoadingModels || isTranslating}
            >
              {isLoadingModels ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  {t('translate.modelLoading')}
                </MenuItem>
              ) : models.length === 0 ? (
                <MenuItem disabled>{t('translate.noModels')}</MenuItem>
              ) : (
                models.map(model => (
                  <MenuItem key={model.name} value={model.name}>
                    {model.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Paper>

        {/* 번역 영역 */}
        <Paper
          elevation={0}
          sx={theme => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(2,6,23,0.55)',
            overflow: 'hidden',
          })}
        >
          {/* 언어 표시 바 */}
          <Stack
            direction='row'
            alignItems='center'
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant='subtitle2'
              sx={{
                flex: 1,
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {t('translate.sourceLang')}
            </Typography>
            <SwapIcon sx={{ color: 'text.disabled', mx: 2 }} />
            <Typography
              variant='subtitle2'
              sx={{
                flex: 1,
                fontWeight: 600,
                color: 'secondary.main',
                textAlign: 'right',
              }}
            >
              {t('translate.targetLang')}
            </Typography>
          </Stack>

          {/* 입력/출력 영역 */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ flex: 1, minHeight: 300 }}
            divider={<Divider orientation='vertical' flexItem />}
          >
            {/* 원문 입력 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <TextField
                multiline
                fullWidth
                placeholder={t('translate.placeholder')}
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
                disabled={isTranslating}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                    border: 'none',
                    borderRadius: 0,
                    '& fieldset': { border: 'none' },
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    overflow: 'auto !important',
                    p: 2,
                  },
                }}
              />
              {/* 원문 액션 버튼 */}
              <Stack
                direction='row'
                spacing={0.5}
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                }}
              >
                {sourceText && (
                  <>
                    <Tooltip title={t('common.copy')}>
                      <IconButton size='small' onClick={handleCopySource}>
                        <CopyIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.clear')}>
                      <IconButton size='small' onClick={clearTranslation} disabled={isTranslating}>
                        <ClearIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            </Box>

            {/* 번역문 출력 */}
            <Box
              sx={theme => ({
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
              })}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {isTranslating && !translatedText && (
                  <Stack direction='row' alignItems='center' spacing={1} sx={{ color: 'text.secondary' }}>
                    <CircularProgress size={16} />
                    <Typography variant='body2'>{t('translate.translating')}</Typography>
                  </Stack>
                )}
                {translatedText && (
                  <Typography variant='body1' sx={{ lineHeight: 1.8 }}>
                    {translatedText}
                  </Typography>
                )}
                {!isTranslating && !translatedText && (
                  <Typography variant='body1' color='text.disabled'>
                    {t('translate.resultPlaceholder')}
                  </Typography>
                )}
              </Box>
              {/* 번역문 액션 버튼 */}
              {translatedText && (
                <Stack
                  direction='row'
                  spacing={0.5}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                  }}
                >
                  <Tooltip title={t('common.copy')}>
                    <IconButton size='small' onClick={handleCopy}>
                      <CopyIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* 번역 버튼 */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {isTranslating ? (
            <Button
              variant='outlined'
              color='error'
              size='large'
              onClick={stopTranslation}
              startIcon={<StopIcon />}
              sx={{ minWidth: 200 }}
            >
              {t('translate.stopButton')}
            </Button>
          ) : (
            <Button
              variant='contained'
              size='large'
              onClick={translate}
              disabled={!sourceText.trim() || !selectedModel || isLoadingModels}
              startIcon={<TranslateIcon />}
              sx={{
                minWidth: 200,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)',
                },
                '&:disabled': {
                  background: 'none',
                },
              }}
            >
              {t('translate.translateButton')}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
