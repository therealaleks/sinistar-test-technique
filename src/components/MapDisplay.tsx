import { Map, MapCameraChangedEvent, Marker, AdvancedMarker, useMap, Pin, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import Box from '@mui/material/Box';
import mapDisplayStyle from 'components/mapDislplayStyle.json';
import type { Host } from 'components/Dashboard';
import { useState, useEffect, type ReactNode } from 'react';
import { Easing, Tween } from "@tweenjs/tween.js";
import type { Coordinates } from 'components/Dashboard';


interface MapDisplayProps {
    markerData: Host[];
    //fix the type
    locationMarkerData: Coordinates | null;
    children?: ReactNode,
    offsetX?: number,
    offsetY?: number,
}

function MapDisplay({ markerData, locationMarkerData, children, offsetX = 0, offsetY = 0 }: MapDisplayProps) {

    const defaultZoom = 5;

    const map = useMap("main-google-map");


    // useEffect?
    map?.setOptions({
        minZoom: 4,
        maxZoom: 17,
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
        styles: mapDisplayStyle,
    })

    const getOffsetCenter = (zoom: number, map: google.maps.Map, latlng: Coordinates) => {
        var scale = Math.pow(2, zoom);

        var worldCoordinateCenter = map.getProjection()?.fromLatLngToPoint(latlng);
        var pixelOffset = new google.maps.Point((offsetX / scale) || 0, (offsetY / scale) || 0);

        if (worldCoordinateCenter) {
            var worldCoordinateNewCenter = new google.maps.Point(
                worldCoordinateCenter.x - pixelOffset.x,
                worldCoordinateCenter.y + pixelOffset.y
            );

            var newCenter = map.getProjection()?.fromPointToLatLng(worldCoordinateNewCenter);

            if (newCenter) {
                console.log(newCenter, latlng);
                return { lat: newCenter.lat(), lng: newCenter.lng() };
            }


        }

        return latlng;

    }

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

                //map.panTo({lat: locationMarkerData.latitude, lng: locationMarkerData.longitude });

                const mapTween = new Tween(mapOptions)
                    .to({ zoom: 11, center: getOffsetCenter(11, map, locationMarkerData) }, 6000)
                    .easing(Easing.Cubic.Out)
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
        , [locationMarkerData, map]
    );

    return (
        <Map
            id={"main-google-map"}
            mapId={"86505c55e5bd8eb0"}
            defaultZoom={defaultZoom}
            defaultCenter={{ lat: 54.62328563684595, lng: -101.07148148602339 }}
            onCameraChanged={(ev: MapCameraChangedEvent) => { }
            }>
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