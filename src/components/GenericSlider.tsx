import {ChangeEvent, type ReactNode} from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';

interface GenericSliderProps {
    handleInputValue: (value: number) => void,
    value: number,
    children?: ReactNode,
    color?: string, 
}

export default function GenericSlider({ value, handleInputValue, children, color }: GenericSliderProps) {

    const maxVal = 100;
    const minVal = 0;

    // bound inputs
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        let newValue: number = 0;

        if (event.target.value !== '') {
            newValue = Math.min(Math.max(Number(event.target.value), minVal), maxVal)
        }

        handleInputValue(newValue);
    };

    const handleBlur = () => {
        if (value < 0) {
            handleInputValue(0);
        } else if (value > 100) {
            handleInputValue(100);
        }
    };
    return (
        <Box width="100%" height="55px">
            {children}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        sx={{color: color}}
                        valueLabelDisplay="auto"
                        value={value} onChange={(e, newVal) => handleInputValue(newVal as number)}
                    />
                </Grid>
                <Grid item>
                    <Typography component="div" fontWeight="bold">
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 10,
                                min: 0,
                                max: 100,
                                type: 'number',
                            }}
                        />
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}