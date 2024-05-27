import Box from '@mui/material/Box';
import HostTable from 'components/HostTable';
import MapDisplay from 'components/MapDisplay';
import HostControl from 'components/HostControl';
import WeightSelector from 'components/WeightSelector';
import AddressInput from 'components/AddressInput';
import { useState, useEffect, useRef, useCallback } from 'react';
import data from 'database.json';
import { useMapsLibrary, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { distance } from 'utils/utilFunctions';


// replace semi colons
interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
}
interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}

export interface PlaceType {
    place_id: string,
    description: string,
    structured_formatting: StructuredFormatting,
}

export interface GeoCodeType {
    geometry: {
        location: {
            lat: () => number,
            lng: () => number,
        },
    },
}

export interface Coordinates {
    lat: number,
    lng: number,
}

export interface Host {
    id: number,
    name: string,
    address: string,
    city: string,
    host_response_rate: number,
    review_score: number,
    extension_flexibility: number,
    latitude: number,
    longitude: number,
}

export interface HostDisance {
    [id: string]: number,
}

export interface Weights {
    HRW: number,
    RSW: number,
    EFW: number,
}

function Dashboard() {

    const [hostData, setHostData] = useState<Host[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const [hostDistances, setHostDistances] = useState<HostDisance | null>(null);
    const [selectedHostIds, setSelectedHostIds] = useState<Set<number>>(new Set<number>([]));
    const [userAddressLatLng, setUserAddressLatLng] = useState<Coordinates | null>(null);
    const geocodingLibrary = useMapsLibrary('geocoding');
    const geocoder = useRef(null as any);

    const [open, setOpen] = useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleWeightsSelect = (weights: Weights): void => {
        setLoading(true);

        setTimeout(() => {
            handleSortHostData(weights)
            setLoading(false);
            setOpen(true);
        }, 1500)
    };

    const weightedScore = (host: Host, weights: Weights) => {
        // define max scores in constant
        const normHRW = host.host_response_rate / 1.0
        const normRSW = host.review_score / 5.0
        const normEFW = host.extension_flexibility / 1.0

        return (normHRW * weights.HRW) + (normRSW * weights.RSW) + (normEFW * weights.EFW);
    }

    const handleSortHostData = (weights: Weights) => {
        const sortedData = [...hostData].sort((host1: Host, host2: Host) => {
            console.log("sorting");
            const weightedScore1 = weightedScore(host1, weights);
            const weightedScore2 = weightedScore(host2, weights); // ignore upper and lowercase

            return weightedScore2 - weightedScore1;
        });

        setHostData(sortedData);
    }

    // distance calculations
    useEffect(() => {
        if (userAddressLatLng) {
            let distanceData: HostDisance = {}

            hostData.forEach((host) => {
                let d: number = distance(userAddressLatLng, { lat: host.latitude, lng: host.longitude });
                distanceData[host.id] = d;
            });

            setHostDistances(distanceData);
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

    return (
        <>
            <Box position={"absolute"} sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>
                <MapDisplay locationMarkerData={userAddressLatLng} markerData={markerData()} offsetX={400}>
                    <MapControl position={ControlPosition.LEFT_CENTER}>
                        <Box width={"800px"} height="80vh" m={"10px"}>
                            <HostControl
                                hostData={hostData}
                                handleSelectedHostIds={handleSelectedHostIds}
                                handleWeightsSelect={handleWeightsSelect}
                                handleAddressInput={handleUserAddressInput}
                                loading={loading}
                            />
                        </Box>
                    </MapControl>
                </MapDisplay>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
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