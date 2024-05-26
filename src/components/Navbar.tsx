import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Navbar() {
    return (
        <Box height="65px" sx={{ flexGrow: 1 }}>
            <AppBar sx={{height:"65px", backdropFilter: "blur(10px)"}} position="fixed">
                <Toolbar>
                    <Typography variant="h4" color="#ffff" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>

                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
