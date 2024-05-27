import { useState, useEffect } from 'react';

import { PieChart } from '@mui/x-charts/PieChart';
import {
    Box,
    Stack,
    Button,
    CardContent,
    Typography,
    Card,
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ThumbsUpDownRoundedIcon from '@mui/icons-material/ThumbsUpDownRounded';
import PlaceIcon from '@mui/icons-material/Place';

import { Weights } from 'components/Dashboard';
import GenericSlider from 'components/GenericSlider';

interface WeightSelectorProps {
    handleWeightsSelect: (weights: Weights) => void,
    loading?:boolean,
}

function WeightSelector({ handleWeightsSelect, loading }: WeightSelectorProps) {

    const [HRW, setHRW] = useState(50)
    const [RSW, setRSW] = useState(50)
    const [EFW, setEFW] = useState(50)
    const [UDW, setUDW] = useState(50)

    const weightsColorPalette = {
        HRW: "#ff9800",
        RSW: "#0CAFA9",
        EFW: "#B0D8A4",
        UDW: "#a0D32a"
    }

    useEffect(():void => {
        handleWeightsSelect({
            HRW: HRW,
            RSW: RSW,
            EFW: EFW,
        })
    }, [])

    return (
        <Card sx={{ borderRadius: "10px", height: "100%", pl: "13px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", backdropFilter: "blur(5px)" }}>
            <CardContent>
                <Box mt={"10px"} mb={"10px"}>
                    <Typography variant="h5" component="div" fontWeight={"bold"} >
                        Tell us what matters
                    </Typography>
                </Box>
                <Stack spacing={0} direction="row" alignItems="center">
                    <Box sx={{ width: "50%" }} >
                        <Stack spacing={0} direction="column" alignItems="center">
                        <GenericSlider handleInputValue={setUDW} value={UDW} color={weightsColorPalette.UDW}>
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <PlaceIcon/>
                                    <Typography id="input-slider" gutterBottom>
                                        Distance
                                    </Typography>
                                </Stack>

                            </GenericSlider>
                            <GenericSlider handleInputValue={setHRW} value={HRW} color={weightsColorPalette.HRW}>
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <ThumbsUpDownRoundedIcon />
                                    <Typography id="input-slider" gutterBottom>
                                        Host rating
                                    </Typography>
                                </Stack>

                            </GenericSlider>
                            <GenericSlider handleInputValue={setRSW} value={RSW} color={weightsColorPalette.RSW}>
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <ChatIcon />
                                    <Typography id="input-slider" gutterBottom>
                                        Host response rate
                                    </Typography>
                                </Stack>
                            </GenericSlider>
                            <GenericSlider handleInputValue={setEFW} value={EFW} color={weightsColorPalette.EFW}>
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <MoreTimeIcon />
                                    <Typography id="input-slider" gutterBottom>
                                        Extension flexibility
                                    </Typography>
                                </Stack>
                            </GenericSlider>
                        </Stack>
                    </Box>
                    <PieChart
                        sx={{ ml: "25%" }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'middle' },
                                padding: 0,
                                hidden: true
                            },
                        }}
                        series={[
                            {
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                innerRadius: 45,
                                outerRadius: 100,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                data: [
                                    
                                    { id: 0, value: HRW * 100 + 1, label: 'Host rating', color: weightsColorPalette.HRW },
                                    { id: 1, value: RSW * 100 + 1, label: 'Host response rate', color: weightsColorPalette.RSW },
                                    { id: 2, value: EFW * 100 + 1, label: 'Extension flexibility', color: weightsColorPalette.EFW },
                                    { id: 3, value: UDW * 100 + 1, label: 'Distance', color: weightsColorPalette.UDW },
                                    

                                ],
                                valueFormatter: (v) => {
                                    return `${(v.value-1)/100}`;
                                },
                            },
                        ]}
                        width={100}
                        height={200}
                    />
                </Stack>
                <Box my="10px">
                    <Stack spacing={0} direction="row" alignItems="center" justifyContent={"center"}>
                        <Button
                            variant="contained"
                            onClick={() => handleWeightsSelect({
                                HRW: HRW,
                                RSW: RSW,
                                EFW: EFW,
                            })}
                            disabled={loading}
                        >
                            FIND BEST HOSTS
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}

export default WeightSelector;