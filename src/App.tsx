import Box from '@mui/material/Box';
import Dashboard from 'components/Dashboard';
import Navbar from 'components/Navbar';
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  return (
    <>
      <Navbar />
      <APIProvider apiKey={""} onLoad={() => console.log('Maps API has loaded.')}>
        <Dashboard />
      </APIProvider>
    </>
  );
}

export default App;
