import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalDialog from './components/common/GlobalDialog';
import GlobalSnackbar from './components/common/GlobalSnackbar';
import Layout from './components/Layout';
import TranslatePage from './pages/TranslatePage';

function MainRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<TranslatePage />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
      <GlobalDialog />
      <GlobalSnackbar />
    </BrowserRouter>
  );
}

export default App;
