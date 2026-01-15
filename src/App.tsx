import GlobalDialog from './components/common/GlobalDialog';
import GlobalSnackbar from './components/common/GlobalSnackbar';
import Layout from './components/Layout';
import TranslatePage from './pages/TranslatePage';

function App() {
  return (
    <>
      <Layout>
        <TranslatePage />
      </Layout>
      <GlobalDialog />
      <GlobalSnackbar />
    </>
  );
}

export default App;
