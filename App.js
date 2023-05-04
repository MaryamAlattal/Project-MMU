import ContextProvider from './ContextProvider';
import Main from './Main';

function App() {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
}

export default App;
