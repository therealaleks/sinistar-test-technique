import Box from '@mui/material/Box';
import MapDisplay from 'components/MapDisplay';
import HostControl from 'components/HostControl';
import { useState, useEffect, useRef } from 'react';
import data from 'database.json';
import { useMapsLibrary, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { distance, quickSort, hostWeightedScore } from 'utils/utilFunctions';
import type { Coordinates, GeoCodeType, Host, PlaceType, Weights, HostDistances } from 'shared/shared.types';
import {useApiLoadingStatus, APILoadingStatus} from '@vis.gl/react-google-maps';

function Dashboard() {

    const [hostData, setHostData] = useState<Host[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const [hostDistances, setHostDistances] = useState<HostDistances | null>(null);
    const [selectedHostIds, setSelectedHostIds] = useState<Set<number>>(new Set<number>([]));
    const [userAddressLatLng, setUserAddressLatLng] = useState<Coordinates | null>(null);
    const geocodingLibrary = useMapsLibrary('geocoding');
    const geocoder = useRef(null as any);
    const hostControlRef = useRef<HTMLElement>();

    console.log(typeof hostControlRef.current)

    // better name
    const [successToastOpen, setSuccessToastOpen] = useState<boolean>(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessToastOpen(false);
    };

    const handleWeightsSelect = (weights: Weights): void => {
        setLoading(true);

        setTimeout(() => {
            handleSortHostData(weights)
            setLoading(false);
            setSuccessToastOpen(true);
        }, 1500)
    };

    const status = useApiLoadingStatus();

    useEffect(() => {
      if (status === APILoadingStatus.FAILED) {
        console.log(':(');
  
        return;
      }
    }, [status]);

    const handleSortHostData = (weights: Weights) => {
        const sortedData = quickSort( hostData, (host1: Host, host2: Host) => {
            
            const weightedScore1 = hostWeightedScore(host1, weights, hostDistances);
            const weightedScore2 = hostWeightedScore(host2, weights, hostDistances); // ignore upper and lowercase

            return weightedScore2 - weightedScore1;
        });

        setHostData(sortedData);
    }

    // distance calculations
    useEffect(() => {
        if (userAddressLatLng) {
            let distanceData: HostDistances = {};

            let maxDistance: number = 0;

            hostData.forEach((host) => {
                let d: number = distance(userAddressLatLng, { lat: host.latitude, lng: host.longitude });

                maxDistance = Math.max(d, maxDistance);

                distanceData[host.id] = d;
            });

            Object.keys(distanceData).forEach((id: string): void => {
                distanceData[id] = distanceData[id]/maxDistance;
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

    
    // move to address bar?
    useEffect(() => {
        if (!geocoder.current && geocodingLibrary) {
            geocoder.current = new geocodingLibrary.Geocoder()
        }

        // return () => {
        //     active = false;
        // };
    }, [geocodingLibrary]);

    const handleUserAddressInput = (address: PlaceType | null): void => {
        if (!address) {
            setUserAddressLatLng(null);
            return;
        }
        geocoder.current
            .geocode({ placeId: address.place_id })
            .then(({ results }: { results: GeoCodeType[] }) => {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();

                setUserAddressLatLng({ lat, lng });
            })
            .catch((e: any) => window.alert("Geocoder failed due to: " + e));
    }

    const getMapOffset = (): number => {
        if(hostControlRef.current) {
            const hostControlWidth = hostControlRef.current.offsetWidth;
            if (hostControlWidth < 600) {
                return 0;
            }
            return hostControlWidth/2;
        }

        return 0;
    }

    return (
        <>
            <Box position={"absolute"} sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>
                <MapDisplay locationMarkerData={userAddressLatLng} markerData={markerData()} offsetX={getMapOffset()}>
                    <MapControl position={ControlPosition.LEFT_TOP}>
                        <Box width={{xs: "95vw", lg: "600px", xl: "800px"}} height={{xs: 0, xl:"80vh"}} m={"10px"} ref={hostControlRef} >
                            <HostControl
                                hostData={hostData}
                                handleSelectedHostIds={handleSelectedHostIds}
                                handleWeightsSelect={handleWeightsSelect}
                                handleAddressInput={handleUserAddressInput}
                                loading={loading}
                                distanceEnabled={hostDistances !== null}
                            />
                        </Box>
                    </MapControl>
                </MapDisplay>
            </Box>
            <Snackbar open={successToastOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Hosts updated
                </Alert>
            </Snackbar>
        </>
    );
}

export default Dashboard;