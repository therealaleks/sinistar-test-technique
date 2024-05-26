import Box from '@mui/material/Box';
import Dashboard from 'components/Dashboard';
import Navbar from 'components/Navbar';
import { APIProvider } from '@vis.gl/react-google-maps';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, orange } from '@mui/material/colors';

function App() {

  const mainTheme = createTheme({
    palette: {
      primary: {
        main: '#ff9800',
        light: '#12819c',
      },
      secondary: {
        main: '#f50057',
      },
      warning: {
        main: '#ff9800',
      },
      background: {
        paper: 'rgba(255,255,255,0.80)',
      },
    },
  });


  return (
    <ThemeProvider theme={mainTheme}>
      <Navbar />
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string} onLoad={() => console.log('Maps API has loaded.')}>
        <Dashboard />
      </APIProvider>
    </ThemeProvider>
  );
}

export default App;
