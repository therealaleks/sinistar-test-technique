import type { Coordinates, Host, Weights, HostDistances } from 'shared/shared.types';

export function distance(p1: Coordinates, p2: Coordinates): number {
    let earthRadiusKm = 6378;

    let latRad1 = p1.lat * (Math.PI / 180);
    let latRad2 = p2.lat * (Math.PI / 180);

    let latDelta = latRad2 - latRad1;
    let lngDelta = (p2.lng - p1.lng) * (Math.PI / 180);

    let distance = 2 * earthRadiusKm * Math.asin(
        Math.sqrt(
            Math.sin(latDelta / 2)
            * Math.sin(latDelta / 2)
            + Math.cos(latRad1)
            * Math.cos(latRad2)
            * Math.sin(lngDelta / 2)
            * Math.sin(lngDelta / 2)
        )
    );

    return distance;
}

function arraySwap(array: any[], i: number, j: number): void {
    if (i === j) return;

    const temp = array[j];

    array[j] = array[i];
    array[i] = temp;
}

function lomutoPartition(array: any[], start: number, end: number, compare: (e1: any, e2: any) => number): number {
    const pivot = start;
    let partition = start;

    for (let i = start + 1; i <= end; i++) {
        if (compare(array[i], array[pivot]) < 0) {
            partition++;
            arraySwap(array, partition, i);
        }
    }

    arraySwap(array, partition, pivot);

    return partition;
}

function quickSortRecursive(array: any[], start: number, end: number, compare: (e1: any, e2: any) => number): void {
    if (end < start) return;

    const partition = lomutoPartition(array, start, end, compare);

    quickSortRecursive(array, partition + 1, end, compare);
    quickSortRecursive(array, start, partition - 1, compare);
}

export function quickSort<T>(array: T[], compare: (e1: T, e2: T) => number): T[] {
    quickSortRecursive(array, 0, array.length - 1, compare);
    return array;
}

export const getOffsetCenter = (offsetX: number, offsetY: number, zoom: number, map: google.maps.Map, latlng: Coordinates): Coordinates => {
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
            return { lat: newCenter.lat(), lng: newCenter.lng() };
        }
    }

    return latlng;

}

export const hostWeightedScore = (host: Host, weights: Weights, hostDistances: HostDistances | null): number => {
    // define max scores in constant
    const normHRW = host.host_response_rate / 1.0
    const normRSW = host.review_score / 5.0
    const normEFW = host.extension_flexibility / 1.0

    let score = (normHRW * weights.HRW) + (normRSW * weights.RSW) + (normEFW * weights.EFW);

    if (hostDistances) {
        score += (1.0 - hostDistances[host.id]) * weights.UDW;
    }

    // normalize score out of 100?

    return score;
}