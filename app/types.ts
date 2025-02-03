// 📁 app/types.ts
export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchFilters {
  breed?: string;
  size?: number;
  sort?: string;
  from?: string;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string;
  prev: string | null;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface MatchResponse {
  match: string;
}