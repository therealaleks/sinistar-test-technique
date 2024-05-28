import type { Host, Weights } from 'shared/shared.types';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import HostTable from 'components/HostTable';
import WeightSelector from 'components/WeightSelector';
import type { PlaceType } from 'shared/shared.types';
import AddressInput from 'components/AddressInput';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import TuneIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';


interface HostControlProps {
    hostData: Host[],
    handleWeightsSelect: (weights: Weights) => void,
    handleSelectedHostIds: (hostIds: number[]) => void,
    handleAddressInput: (address: PlaceType | null) => void,
    loading?: boolean,
    distanceEnabled?: boolean,
}

export default function HostControl({ hostData, handleWeightsSelect, handleSelectedHostIds, handleAddressInput, loading, distanceEnabled }: HostControlProps) {
    const [value, setValue] = useState("settings");

    const settingsDisplay = { xs: value === "settings" ? "inline" : "none", xl: "inline" }
    const hostTableDisplay = { xs: value === "hosts" ? "inline" : "none", xl: "inline" }

    useEffect(() => {
            setValue('hosts');
        }
        ,[loading]
    )

    return (
        <Stack spacing={2} direction="column" alignItems="stretch" height="100%">
            <Box display={{ xl: "none" }}>
                <BottomNavigation
                    sx={{ borderRadius: 10, boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", backdropFilter: "blur(5px)" }}
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        console.log(newValue);
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction label="Settings" value="settings" icon={<TuneIcon />} />
                    <BottomNavigationAction label="Hosts" value="hosts" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Map" value="maps" icon={<MapIcon />} />
                </BottomNavigation>
            </Box>
            <Box width={"100%"} display={settingsDisplay}>
                <AddressInput handleAddressInput={handleAddressInput} />
            </Box>
            <Box width={"100%"} display={settingsDisplay}>
                <WeightSelector handleWeightsSelect={handleWeightsSelect} loading={loading} distanceEnabled={distanceEnabled} />
            </Box>
            <Box width={"100%"} flexGrow="1" display={hostTableDisplay}>
                <HostTable hostData={hostData} handleSelectedHostIds={handleSelectedHostIds} loading={loading} />
            </Box>
        </Stack>
    );
}