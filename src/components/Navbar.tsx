import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface NavbarProps {
    height: string,
}

function Navbar({height}: NavbarProps) {
    return (
        <Box height={height} sx={{ flexGrow: 1 }}>
            <AppBar sx={{height:{height}, backdropFilter: "blur(10px)"}} position="fixed">
                <Toolbar>
                <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sinistar Test Technique
          </Typography>
            <div>

            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
