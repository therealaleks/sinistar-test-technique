import { Map, Marker, AdvancedMarker, useMap, Pin} from '@vis.gl/react-google-maps';
import type { Host } from 'shared/shared.types';
import { useEffect, type ReactNode } from 'react';
import { Easing, Tween } from "@tweenjs/tween.js";
import type { Coordinates } from 'shared/shared.types';
import { getOffsetCenter } from 'utils/utilFunctions';


interface MapDisplayProps {
    markerData: Host[],
    locationMarkerData: Coordinates | null,
    children?: ReactNode,
    offsetX?: number,
    offsetY?: number,
}

function MapDisplay({ markerData, locationMarkerData, children, offsetX = 0, offsetY = 0 }: MapDisplayProps) {

    const defaultZoom = 5;

    const map = useMap("main-google-map");

    useEffect(()=> {
        map?.setOptions({
            minZoom: 4,
            maxZoom: 17,
            disableDefaultUI: true,
            zoomControl: true,
        })
    }, [map])

    useEffect(() => {
        if (locationMarkerData && map) {
            const center = map.getCenter();
            if (center) {
                const mapOptions = {
                    zoom: map.getZoom(),
                    center: {
                        lat: center?.lat(),
                        lng: center?.lng(),
                    },
                }

                // alternative method to pan camera with animation
                // map.panTo(getOffsetCenter(offsetX, offsetY, map.getZoom() || 0, map, locationMarkerData));

                const mapTween = new Tween(mapOptions)
                    .to({ center: getOffsetCenter(offsetX, offsetY, map.getZoom() || 0, map, locationMarkerData) }, 2000)
                    .easing(Easing.Quadratic.In)
                    .onUpdate(() => {
                        map.moveCamera(mapOptions);
                    }).start();

                const animateMap = (time: number) => {
                    requestAnimationFrame(animateMap);
                    mapTween.update(time);
                }

                requestAnimationFrame(animateMap);
            }
        }
    }
        , [locationMarkerData, map, offsetX, offsetY]
    );

    return (
        <Map
            id={"main-google-map"}
            mapId={"86505c55e5bd8eb0"}
            defaultZoom={defaultZoom}
            defaultCenter={{ lat: 54.62328563684595, lng: -101.07148148602339 }}
        >
            {markerData.map(({ latitude, longitude }, index) => <Marker key={index} position={{ lat: latitude, lng: longitude }} />)}
            {locationMarkerData &&
                <AdvancedMarker
                    key={"user-address-location"}
                    position={locationMarkerData}>
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>}
            {children}
        </Map>
    );
}

export default MapDisplay;