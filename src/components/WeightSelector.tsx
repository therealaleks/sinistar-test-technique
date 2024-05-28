import { useState, useEffect } from 'react';

import { PieChart } from '@mui/x-charts/PieChart';
import {
    Box,
    Stack,
    Button,
    CardContent,
    Typography,
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ThumbsUpDownRoundedIcon from '@mui/icons-material/ThumbsUpDownRounded';
import PlaceIcon from '@mui/icons-material/Place';
import type { PieValueType } from '@mui/x-charts/models/seriesType/pie';

import type { Weights } from 'shared/shared.types';
import GenericSlider from 'components/GenericSlider';
import DashboardCard from 'components/DashboardCard';


interface WeightSelectorProps {
    handleWeightsSelect: (weights: Weights) => void,
    loading?: boolean,
    distanceEnabled?: boolean,
}

interface FactorConfigs<T> {
    title: string,
    icon: JSX.Element,
    value: T,
    handler: (value: T) => void,
    color: string,
    enabled: boolean,
}

function WeightSelector({ handleWeightsSelect, loading, distanceEnabled }: WeightSelectorProps) {

    const [HRW, setHRW] = useState<number>(50)
    const [RSW, setRSW] = useState<number>(50)
    const [EFW, setEFW] = useState<number>(50)
    const [UDW, setUDW] = useState<number>(50)

    const factors: { [key: string]: FactorConfigs<number> } = {
        RSW: {
            title: "Rating score",
            icon: <ThumbsUpDownRoundedIcon />,
            value: RSW,
            handler: setRSW,
            color: "#0CAFA9",
            enabled: true,
        },
        HRW: {
            title: "Host response rate",
            icon: <ChatIcon />,
            value: HRW,
            handler: setHRW,
            color: "#ff9800",
            enabled: true,
        },
        EFW: {
            title: "Extension flexibility",
            icon: <MoreTimeIcon />,
            value: EFW,
            handler: setEFW,
            color: "#B0D8A4",
            enabled: true,
        },
        UDW: {
            title: "Distance",
            icon: <PlaceIcon />,
            value: UDW,
            handler: setUDW,
            color: "#a0D32a",
            enabled: distanceEnabled ? true : false,
        },
    }

    const handleWeights = (): void => {
        handleWeightsSelect({
            HRW: HRW,
            RSW: RSW,
            EFW: EFW,
            UDW: UDW,
        })
    }

    useEffect((): void => {
        handleWeights();
    }, [])

    const pieChartData = (): PieValueType[] => {
        const data: PieValueType[] = [
            // we multiply by 100 and add 1 to better reflect default sorting when all weights are 0
            // that is to say, an unweighted mean
            { id: 0, value: factors.HRW.value*100 + 1, label: factors.HRW.title, color: factors.HRW.color },
            { id: 1, value: factors.RSW.value*100 + 1, label: factors.RSW.title, color: factors.RSW.color },
            { id: 2, value: factors.EFW.value*100 + 1, label: factors.EFW.title, color: factors.EFW.color },
        ];

        if (distanceEnabled) {
            data.push({ id: 3, value: factors.UDW.value*100 + 1, label: factors.UDW.title, color: factors.UDW.color })
        }

        return data;
    };

    return (
        <DashboardCard sx={{ height: "100%", pl: "13px" }}>
            <CardContent>
                <Box mt="10px" mb="10px">
                    <Typography variant="h5" component="div" fontWeight="bold" >
                        Tell us what matters
                    </Typography>
                </Box>
                <Stack spacing={0} direction="row" alignItems="center" justifyContent="center">
                    <Box sx={{ width: { xs: "100%", sm: "50%" } }} >
                        <Stack spacing={0} direction="column" alignItems="center">
                            {
                                Object.keys(factors).map((factor: string) => {
                                    const configs = factors[factor];
                                    return <>
                                        {configs.enabled &&
                                            <GenericSlider handleInputValue={configs.handler} value={configs.value} color={configs.color}>
                                                <Stack spacing={2} direction="row" alignItems="center">
                                                    {configs.icon}
                                                    <Typography id="input-slider" gutterBottom>
                                                        {configs.title}
                                                    </Typography>
                                                </Stack>
                                            </GenericSlider>
                                        }
                                    </>
                                }
                                )
                            }
                        </Stack>
                    </Box>
                    <Box width="50%" height="200px" display={{ xs: "none", sm: "inline" }} >
                        <PieChart
                            sx={{ ml: "25%" }}
                            slotProps={{
                                legend: {
                                    hidden: true
                                },
                            }}
                            series={[
                                {
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    innerRadius: "50%",
                                    outerRadius: "100%",
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    data: pieChartData(),
                                    valueFormatter: (v) => {
                                        return `${((v.value-1)/100)}`;
                                    },
                                },
                            ]}
                        />
                    </Box>
                </Stack>
                <Box my="10px">
                    <Stack spacing={0} direction="row" alignItems="center" justifyContent="center">
                        <Button
                            sx={{ color: "white" }}
                            variant="contained"
                            onClick={handleWeights}
                            disabled={loading}
                        >
                            FIND BEST HOSTS
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </DashboardCard>
    );
}

export default WeightSelector;