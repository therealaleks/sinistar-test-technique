import { Card, CardProps } from '@mui/material';

export default function DashboardCard(props: CardProps) {
    let sx: typeof props.sx = {
        borderRadius: '10px',
        boxShadow:
            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(255,255,255,0.80)',
    };

    if (props.sx) {
        sx = { ...sx, ...props.sx };
    }

    return <Card {...props} sx={sx} />;
}
