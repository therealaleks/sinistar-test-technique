import { Coordinates } from 'components/Dashboard';

export function distance(p1: Coordinates, p2: Coordinates): number {
    let earthRadiusKm = 6378;

    let latRad1 = p1.lat * (Math.PI/180); 
    let latRad2 = p2.lat * (Math.PI/180);

    let latDelta = latRad2-latRad1;
    let lngDelta = (p2.lng - p1.lng) * (Math.PI/180);

    let distance = 2 * earthRadiusKm * Math.asin(
        Math.sqrt(
            Math.sin(latDelta/2)
            * Math.sin(latDelta/2)
            + Math.cos(latRad1)
            * Math.cos(latRad2)
            * Math.sin(lngDelta/2)
            * Math.sin(lngDelta/2)
        )
    );

    return distance;
}