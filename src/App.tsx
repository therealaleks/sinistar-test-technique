import Box from '@mui/material/Box';
import Dashboard from 'components/Dashboard/Dashboard';
import Navbar from 'components/Navbar';
import { APIProvider } from '@vis.gl/react-google-maps';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1700,
            },
        },
    });

    return (
        <ThemeProvider theme={mainTheme}>
            <Navbar height="65px" />
            <Box
                sx={{ zIndex: 1, boxSizing: 'border-box' }}
                position="fixed"
                width="100%"
                height="calc(100% - 65px)"
            >
                <APIProvider
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}
                    onLoad={() => console.log('Maps API has loaded.')}
                >
                    <Dashboard />
                </APIProvider>
            </Box>
        </ThemeProvider>
    );
}

export default App;
