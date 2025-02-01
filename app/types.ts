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
  // Add any other fields that the API returns
}