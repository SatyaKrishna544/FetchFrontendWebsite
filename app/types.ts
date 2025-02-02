export interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
}

export interface Match {
  match: string
}

export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

export interface Coordinates {
  lat: number;
  lon: number;
}