import './App.css';
import NavBar from './Components/NavBar';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import Summarizer from './Components/Summarizer';


function App() {
  const [theme, colorMode] = useMode();
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar></NavBar>
        <Summarizer></Summarizer>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
