import { Snackbar, Alert } from '@mui/material';

interface DashboardAlertProps {
    open?: boolean;
    severity?: 'error' | 'success';
    message?: string;
    handleClose: () => void;
}

export default function DashboardAlert({
    open,
    severity,
    message,
    handleClose,
}: DashboardAlertProps) {
    const handleCloseToast = (e: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        handleClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleCloseToast}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
