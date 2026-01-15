import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import SettingsDialog from './SettingsDialog';
import DictionaryDialog from './DictionaryDialog';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>
      <SettingsDialog />
      <DictionaryDialog />
    </Box>
  );
}
