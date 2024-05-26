import { Map, MapCameraChangedEvent, Marker, AdvancedMarker, useMap, Pin } from '@vis.gl/react-google-maps';
import Box from '@mui/material/Box';
import mapDisplayStyle from 'components/mapDislplayStyle.json';
import type { Host } from 'components/Dashboard';
import { useState, useEffect } from 'react';
import { Easing, Tween, update, Group } from "@tweenjs/tween.js";

interface MapDisplayProps {
    markerData: Host[];
    //fix the type
    locationMarkerData: any;
}

function MapDisplay({ markerData, locationMarkerData }: MapDisplayProps) {

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

    useEffect(() => {
        if (locationMarkerData && map) {
            const center = map.getCenter();
            if (center) {
                const cameraZoom = {
                    zoom: map.getZoom(),
                }

                const cameraCenter = {
                    lat: center?.lat(),
                    lng: center?.lng(),
                }

                map.panTo({lat: locationMarkerData.latitude, lng: locationMarkerData.longitude });

                const zoomTween = new Tween(cameraZoom) // Create a new tween that modifies 'cameraOptions'.
                    .to({ zoom: 11}, 6000) // Move to destination in 15 second.
                    .easing(Easing.Cubic.Out) // Use an easing function to make the animation smooth.
                    .onUpdate(() => {
                        map.moveCamera({
                            zoom: cameraZoom.zoom,
                        });
                    })
                    .start(); // Start the tween immediately.

                const centerTween = new Tween(cameraCenter) // Create a new tween that modifies 'cameraOptions'.
                    .to({lat: locationMarkerData.latitude, lng: locationMarkerData.longitude }, 2000) // Move to destination in 15 second.
                    .easing(Easing.Cubic.Out) // Use an easing function to make the animation smooth.
                    .onUpdate(() => {
                        map.moveCamera({
                            center: cameraCenter,
                        });
                    })
                    .start(); // Start the tween immediately.

                // Setup the animation loop.
                const animateZoom = (time: number) => {
                    requestAnimationFrame(animateZoom);
                    zoomTween.update(time);
                }

                // Setup the animation loop.
                const animateCenter = (time: number) => {
                    requestAnimationFrame(animateCenter);
                    centerTween.update(time);
                }

                requestAnimationFrame(animateZoom);
                //requestAnimationFrame(animateCenter);
            }
        }
    }
        , [markerData, locationMarkerData]
    );

    return (
        <Box position={"absolute"} sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>
            <Map
                id={"main-google-map"}
                mapId={"86505c55e5bd8eb0"}
                defaultZoom={defaultZoom}
                defaultCenter={{ lat: 54.62328563684595, lng: -101.07148148602339 }}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
                {markerData.map(({ latitude, longitude }, index) => <Marker key={index} position={{ lat: latitude, lng: longitude }} />)}
                {locationMarkerData &&
                    <AdvancedMarker
                        key={"user-address-location"}
                        position={{ lat: locationMarkerData.latitude, lng: locationMarkerData.longitude }}>
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>}
            </Map>
        </Box>
    );
}

export default MapDisplay;