import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Navbar() {
    return (
        <Box height="65px" sx={{ flexGrow: 1 }}>
            <AppBar sx={{height:"65px"}} position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
