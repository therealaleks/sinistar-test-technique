import type { Coordinates, Host, Weights, GeoCodeType, PlaceType } from 'shared/shared.types';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import HostTable from 'components/HostTable';
import WeightSelector from 'components/WeightSelector';
import AddressInput from 'components/AddressInput';
import DashboardAlert from 'components/DashboardAlert';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {
    useMapsLibrary,
} from '@vis.gl/react-google-maps';

import TuneIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';


interface HostControlProps {
    hostData: Host[],
    handleWeightsSelect: (weights: Weights) => void,
    handleSelectedHostIds: (hostIds: number[]) => void,
    handleUserLatLng: (latLng: Coordinates | null) => void,
    loading?: boolean,
    distanceEnabled?: boolean,
}

type HostControlTab = "settings" | "hosts" | "map";

export default function HostControl({
    hostData,
    handleWeightsSelect,
    handleSelectedHostIds,
    handleUserLatLng,
    loading = false,
    distanceEnabled = false
}: HostControlProps) {

    const [navValue, setNavValue] = useState<HostControlTab>("settings");
    const [apiFailToastOpen, setApiFailToastOpen] = useState<boolean>(false);

    const geocodingLibrary = useMapsLibrary('geocoding');
    const geocoder = useRef(null as any);

    const settingsDisplay = { xs: navValue === "settings" ? "inline" : "none", xl: "inline" }
    const hostTableDisplay = { xs: navValue === "hosts" ? "inline" : "none", xl: "inline" }

    useEffect(() => {
        setNavValue('hosts');
    }
        , [loading]
    )

    // move to address bar?
    useEffect(() => {
        if (!geocoder.current && geocodingLibrary) {
            geocoder.current = new geocodingLibrary.Geocoder()
        }
    }, [geocodingLibrary]);

    const handleAddressInput = (address: PlaceType | null): void => {
        if (!address) {
            handleUserLatLng(null);
            return;
        }
        geocoder.current
            .geocode({ placeId: address.place_id })
            .then(({ results }: { results: GeoCodeType[] }) => {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();

                handleUserLatLng({ lat, lng });
            })
            .catch((e: any) => {
                window.alert("Geocoder failed due to: " + e);
                setApiFailToastOpen(true);
            });
    }


    return (
        <>
            <Stack spacing={2} direction="column" alignItems="stretch" height={{ xs: 0, xl: "100%" }}>
                <Box display={{ xl: "none" }}>
                    <BottomNavigation
                        sx={{
                            borderRadius: 10,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            backdropFilter: "blur(5px)"
                        }}
                        showLabels
                        value={navValue}
                        onChange={(event: any, newValue: HostControlTab) => {
                            setNavValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Settings" value="settings" icon={<TuneIcon />} />
                        <BottomNavigationAction label="Hosts" value="hosts" icon={<HomeIcon />} />
                        <BottomNavigationAction label="Map" value="maps" icon={<MapIcon />} />
                    </BottomNavigation>
                </Box>
                <Box width="100%" display={settingsDisplay}>
                    <AddressInput handleAddressInput={handleAddressInput} />
                </Box>
                <Box width="100%" display={settingsDisplay}>
                    <WeightSelector handleWeightsSelect={handleWeightsSelect} loading={loading} distanceEnabled={distanceEnabled} />
                </Box>
                <Box width="100%" flexGrow="1" display={hostTableDisplay}>
                    <HostTable hostData={hostData} handleSelectedHostIds={handleSelectedHostIds} loading={loading} />
                </Box>
            </Stack>
            <DashboardAlert
                open={apiFailToastOpen}
                severity="error"
                message="Failed to locate address"
                handleClose={() => setApiFailToastOpen(false)}
            />
        </>
    );
}