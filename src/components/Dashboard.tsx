import Box from '@mui/material/Box';
import HostTable from 'components/HostTable';
import MapDisplay from 'components/MapDisplay';
import HostControl from 'components/HostControl';
import WeightSelector from 'components/WeightSelector';
import AddressInput from 'components/AddressInput';
import { useState, useEffect, useRef } from 'react';
import data from 'database.json';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

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
    latitude: number,
    longitude: number,
}

export interface Host extends Coordinates {
    id: number,
    name: string,
    address: string,
    city: string,
    host_response_rate: number,
    review_score: number,
    extension_flexibility: number,
}


export interface Weights {
    HRW: number,
    RSW: number,
    EFW: number,
}

function Dashboard() {

    const [hostData, setHostData] = useState<Host[]>(data);
    const [selectedHostIds, setSelectedHostIds] = useState<Set<number>>(new Set<number>([]));
    const [userAddressData, setUserAddressData] = useState<Coordinates | null>(null);
    const geocodingLibrary = useMapsLibrary('geocoding');
    const geocoder = useRef(null as any);


    const [weights, setWeights] = useState<Weights>({
        HRW: 50,
        RSW: 50,
        EFW: 50,
    });

    const handleWeightsSelect = (weights: Weights): void => (setWeights(weights));


    const weightedScore = (host: Host) => {
        // define max scores in constant
        const normHRW = host.host_response_rate / 1.0
        const normRSW = host.review_score / 5.0
        const normEFW = host.extension_flexibility / 1.0

        return (normHRW * weights.HRW) + (normRSW * weights.RSW) + (normEFW * weights.EFW);
    }

    useEffect(() => {
        const sortedData = [...hostData].sort((host1: Host, host2: Host) => {
            console.log("sorting");
            const weightedScore1 = weightedScore(host1);
            const weightedScore2 = weightedScore(host2); // ignore upper and lowercase

            return weightedScore2 - weightedScore1;
        });

        setHostData(sortedData);
    },
        [weights]);
    useEffect(() => {

        let active = true;

        if (!geocoder.current && geocodingLibrary) {
            geocoder.current = new geocodingLibrary.Geocoder()
        }

        return () => {
            active = false;
        };
    }, [geocodingLibrary]);


    const handleSelectedHostIds = (ids: number[]): void => {
        setSelectedHostIds(new Set<number>(ids));
    }

    const markerData = (): Host[] => {
        if (selectedHostIds.size == 0) {
            return hostData;
        }

        return hostData.filter((host) => selectedHostIds.has(host.id));
    }


    const handleUserAddressInput = (address: PlaceType | null): void => {
        if (!address) {
            setUserAddressData(null);
            return;
        }
        geocoder.current
            .geocode({ placeId: address.place_id })
            .then(({ results }: { results: GeoCodeType[] }) => {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();

                setUserAddressData({ latitude: lat, longitude: lng });
            })
            .catch((e: any) => window.alert("Geocoder failed due to: " + e));
    }

    return (
        <Box sx={{ zIndex: 1, boxSizing: "border-box" }} position={"fixed"} width={"100%"} height={"95%"}>
            <MapDisplay locationMarkerData={userAddressData} markerData={markerData()} />
            <HostControl
                hostData={hostData}
                handleSelectedHostIds={handleSelectedHostIds}
                handleWeightsSelect={handleWeightsSelect}
                handleAddressInput={handleUserAddressInput}
            />
        </Box>
    );
}

export default Dashboard;