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
    place_id: string;
    description: string;
    structured_formatting: StructuredFormatting;
}

export interface GeoCodeType {
    geometry: {
        location: {
            lat: () => number;
            lng: () => number;
        };
    };
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Host {
    id: number;
    name: string;
    address: string;
    city: string;
    host_response_rate: number;
    review_score: number;
    extension_flexibility: number;
    latitude: number;
    longitude: number;
}

export interface Weights {
    HRW: number;
    RSW: number;
    EFW: number;
    UDW: number;
}

export interface HostDistances {
    [id: string]: number;
}
