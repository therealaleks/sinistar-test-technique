import {ChangeEvent, type ReactNode} from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';

interface GenericSliderProps {
    handleInputValue: (value: number) => void,
    value: number,
    children?: ReactNode,
    color?: string, 
}

export default function GenericSlider({ value, handleInputValue, children, color }: GenericSliderProps) {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleInputValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            handleInputValue(0);
        } else if (value > 100) {
            handleInputValue(100);
        }
    };
    return (
        <Box width="100%">
            {children}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider sx={{color: color}} valueLabelDisplay="auto" value={value} onChange={(e, newVal) => handleInputValue(newVal as number)} aria-label="Host response rate weight"  />
                </Grid>
                <Grid item>
                    <Typography component="div" fontWeight={"bold"}>
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
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}