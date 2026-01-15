import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { Translate as TranslateIcon, Settings as SettingsIcon, History as HistoryIcon } from '@mui/icons-material';
import { useSettingsStore } from '../../stores/settingsStore';

interface TranslateHeaderProps {
  onHistoryClick: () => void;
}

export default function TranslateHeader({ onHistoryClick }: TranslateHeaderProps) {
  const { t } = useTranslation();
  const { openSettings } = useSettingsStore();

  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={1.5}
      sx={theme => ({
        px: 2,
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(2,6,23,0.7)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      })}
    >
      {/* 앱 로고 + 타이틀 */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(124,58,237,0.9))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <TranslateIcon sx={{ fontSize: 18, color: 'white' }} />
      </Box>
      <Typography
        variant='subtitle1'
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          flexShrink: 0,
        }}
      >
        {t('common.appName')}
      </Typography>

      {/* 스페이서 */}
      <Box sx={{ flex: 1 }} />

      {/* 히스토리 버튼 */}
      <Tooltip title={t('history.title')}>
        <IconButton onClick={onHistoryClick} size='small'>
          <HistoryIcon fontSize='small' />
        </IconButton>
      </Tooltip>

      {/* 설정 버튼 */}
      <Tooltip title={t('settings.title')}>
        <IconButton onClick={openSettings} size='small'>
          <SettingsIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
