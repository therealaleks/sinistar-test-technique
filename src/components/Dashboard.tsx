
import { useState, useEffect, useRef } from 'react';

import MapDisplay from 'components/MapDisplay';
import HostControl from 'components/HostControl';
import DashboardAlert from 'components/DashboardAlert';

import { Box } from '@mui/material'

import {
    MapControl,
    ControlPosition,
    useApiLoadingStatus,
    APILoadingStatus,
} from '@vis.gl/react-google-maps';

import { distance, quickSort, hostWeightedScore, distanceScores } from 'utils/utilFunctions';
import type {
    Coordinates,
    Host,
    Weights,
    HostDistances
} from 'shared/shared.types';
import data from 'database.json';

function Dashboard() {

    const [hostData, setHostData] = useState<Host[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const [userAddressLatLng, setUserAddressLatLng] = useState<Coordinates | null>(null);
    const [hostDistances, setHostDistances] = useState<HostDistances | null>(null);
    const [selectedHostIds, setSelectedHostIds] = useState<Set<number>>(new Set<number>([]));

    const [successToastOpen, setSuccessToastOpen] = useState<boolean>(false);
    const [apiFailToastOpen, setApiFailToastOpen] = useState<boolean>(false);
    
    const gmapsAPIStatus = useApiLoadingStatus();
    const hostControlRef = useRef<HTMLElement>();

    const handleWeightsSelect = (weights: Weights): void => {
        setLoading(true);

        // here we use an artificial loading time. This is a common method to assure
        // the user that their request is being considered dutifuly
        // the actual process is instant
        setTimeout(() => {
            handleSortHostData(weights)
            setLoading(false);
            setSuccessToastOpen(true);
        }, 1500)
    };

    const handleSortHostData = (weights: Weights) => {

        const hostDistanceScores = distanceScores(hostDistances);

        const sortedData = quickSort(hostData, (host1: Host, host2: Host) => {

            const weightedScore1 = hostWeightedScore(host1, weights, hostDistanceScores);
            const weightedScore2 = hostWeightedScore(host2, weights, hostDistanceScores); // ignore upper and lowercase

            return weightedScore2 - weightedScore1;
        });

        setHostData(sortedData);
    }

    // distance calculations
    useEffect(() => {
        if (userAddressLatLng) {
            let distanceData: HostDistances = {};

            hostData.forEach((host) => {
                let d: number = distance(userAddressLatLng, { lat: host.latitude, lng: host.longitude });

                distanceData[host.id] = d;
            });

            setHostDistances(distanceData);
        } else {
            setHostDistances(null);
        }
    }, [userAddressLatLng, hostData]);

    const handleSelectedHostIds = (ids: number[]): void => {
        setSelectedHostIds(new Set<number>(ids));
    }

    const markerData = (): Host[] => {
        if (selectedHostIds.size === 0) {
            return hostData;
        }

        return hostData.filter((host) => selectedHostIds.has(host.id));
    }

    useEffect(() => {
        if (gmapsAPIStatus === APILoadingStatus.FAILED) {
            console.log('failed to load Google Maps API');


            setApiFailToastOpen(true);
        }
    }, [gmapsAPIStatus]);

    const getMapOffset = (): number => {
        if (hostControlRef.current) {
            const hostControlWidth = hostControlRef.current.offsetWidth;
            if (hostControlWidth < 600) {
                return 0;
            }
            return hostControlWidth / 2;
        }

        return 0;
    }

    return (
        <>
            <Box position={"absolute"} sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>
                <MapDisplay locationMarkerData={userAddressLatLng} markerData={markerData()} offsetX={getMapOffset()}>
                    <MapControl position={ControlPosition.LEFT_TOP}>
                        <Box width={{ xs: "95vw", lg: "600px", xl: "800px" }} height={{ xs: 0, xl: "80vh" }} m={"10px"} ref={hostControlRef} >
                            <HostControl
                                hostData={hostData}
                                handleSelectedHostIds={handleSelectedHostIds}
                                handleWeightsSelect={handleWeightsSelect}
                                handleUserLatLng={setUserAddressLatLng}
                                loading={loading}
                                distanceEnabled={hostDistances !== null}
                            />
                        </Box>
                    </MapControl>
                </MapDisplay>
            </Box>
            <DashboardAlert
                open={successToastOpen}
                severity="success"
                message="Hosts updated"
                handleClose={() => setSuccessToastOpen(false)}
            />
            <DashboardAlert
                open={apiFailToastOpen}
                severity="error"
                message="Failed to load map"
                handleClose={() => setApiFailToastOpen(false)}
            />
        </>
    );
}

export default Dashboard;