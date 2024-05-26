import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Weights } from 'components/Dashboard';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GenericSlider from 'components/GenericSlider';
import ChatIcon from '@mui/icons-material/Chat';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ThumbsUpDownRoundedIcon from '@mui/icons-material/ThumbsUpDownRounded';
import useTheme from '@mui/material/styles/useTheme';



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

    const weightsColorPalette = {
        HRW: "#ff9800",
        RSW: "#0CAFA9",
        EFW: "#B0D8A4",
    }

    return (
        <Card sx={{ borderRadius: "10px", height: "100%", pl: "13px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", backdropFilter: "blur(5px)" }}>
            <CardContent>
                <Box mt={"10px"} mb={"20px"}>
                    <Typography variant="h5" component="div" fontWeight={"bold"} >
                        Tell us what matters to you
                    </Typography>
                </Box>
                <Stack spacing={0} direction="row" alignItems="center">
                    <Box sx={{ width: "50%" }} >
                        <Stack spacing={3} direction="column" alignItems="center">
                            <GenericSlider handleInputValue={setHRW} value={HRW}>
                                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                    <ThumbsUpDownRoundedIcon />
                                    <Typography id="input-slider" gutterBottom>
                                        Host rating
                                    </Typography>
                                </Stack>

                            </GenericSlider>
                            <GenericSlider handleInputValue={setRSW} value={RSW}>
                                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                    <ChatIcon />
                                    <Typography id="input-slider" gutterBottom>
                                        Host response rate
                                    </Typography>
                                </Stack>
                            </GenericSlider>
                            <GenericSlider handleInputValue={setEFW} value={EFW}>
                                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                    <MoreTimeIcon />
                                    <Typography id="input-slider" gutterBottom>
                                        Extension flexibility
                                    </Typography>
                                </Stack>
                            </GenericSlider>
                        </Stack>
                    </Box>
                    <PieChart
                        sx={{ml:"25%"}}
                        slotProps={{
                            legend: { hidden: true },
                        }}
                        series={[
                            {
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                innerRadius: 45,
                                outerRadius: 100,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                data: [
                                    { id: 2, value: EFW * 100 + 1, label: 'Extension flexibility', color: weightsColorPalette.EFW  },
                                    
                                    { id: 1, value: RSW * 100 + 1, label: 'Host response rate', color: weightsColorPalette.RSW  },
                                    { id: 0, value: HRW * 100 + 1, label: 'Host rating', color: weightsColorPalette.HRW },
                                    
                                ],
                            },
                        ]}
                        width={100}
                        height={300}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
}

export default WeightSelector;