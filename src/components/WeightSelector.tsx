import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Weights } from 'components/Dashboard';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';



interface WeightSelectorProps {
    handleWeightsSelect: (weights: Weights) => void,
}

function WeightSelector({ handleWeightsSelect }: WeightSelectorProps) {

    const [HRW, setHRW] = useState(50)
    const [RSW, setRSW] = useState(50)
    const [EFW, setEFW] = useState(50)

    useEffect(() => {
        handleWeightsSelect({
            HRW: HRW,
            RSW: RSW,
            EFW: EFW,
        })
    }, [HRW, RSW, EFW]);

    return (
        <Box width="30vw">
            <Card>
                <Box sx={{ width: "50%" }} px="5%">
                    <Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
                        <Slider value={HRW} onChange={(e, newVal) => setHRW(newVal as number)} aria-label="Host response rate weight" />
                        <Slider value={RSW} onChange={(e, newVal) => setRSW(newVal as number)} aria-label="Review score weight" />
                        <Slider value={EFW} onChange={(e, newVal) => setEFW(newVal as number)} aria-label="Extension flexibility weight" />
                    </Stack>
                </Box>
                <PieChart
                    series={[
                        {
                            innerRadius: 45,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            data: [
                                { id: 0, value: HRW * 100 + 1, label: 'series A' },
                                { id: 1, value: RSW * 100 + 1, label: 'series B' },
                                { id: 2, value: EFW * 100 + 1, label: 'series C' },
                            ],
                        },
                    ]}
                    width={400}
                    height={200}
                />
            </Card>
        </Box>
    );
}

export default WeightSelector;