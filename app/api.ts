import { Dog, SearchFilters, SearchResponse, LoginResponse, MatchResponse } from "./types";

const API_BASE = "https://frontend-take-home-service.fetch.com";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  // Some endpoints don't return JSON
  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json();
  }
  
  return {} as T;
}

/**
 * Login user
 */
export async function loginUser(name: string, email: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      credentials: "include",
    });

    if (response.ok) {
      // Return a success object even if the response is empty
      return { success: true };
    } else {
      throw new Error(`Login failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    await handleResponse<void>(response);
  } catch (error) {
    console.error("Logout error:", error);
    throw error instanceof ApiError ? error : new Error('Logout failed');
  }
}

/**
 * Fetch available dog breeds
 */
export async function fetchBreeds(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/dogs/breeds`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return handleResponse<string[]>(response);
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error instanceof ApiError ? error : new Error('Failed to fetch breeds');
  }
}

/**
 * Search dogs with filters
 */
export async function searchDogs(filters: SearchFilters): Promise<SearchResponse> {
  try {
    const queryParams = new URLSearchParams({
      size: (filters.size || 10).toString(),
      sort: filters.sort || "breed:asc",
      ...(filters.breed && { breeds: filters.breed }),
      ...(filters.from && { from: filters.from }),
    });

    const response = await fetch(`${API_BASE}/dogs/search?${queryParams}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return handleResponse<SearchResponse>(response);
  } catch (error) {
    console.error("Error searching dogs:", error);
    throw error instanceof ApiError ? error : new Error('Failed to search dogs');
  }
}

/**
 * Fetch details for specific dogs
 */
export async function fetchDogDetails(dogIds: string[]): Promise<Dog[]> {
  try {
    const response = await fetch(`${API_BASE}/dogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dogIds),
    });

    return handleResponse<Dog[]>(response);
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error instanceof ApiError ? error : new Error('Failed to fetch dog details');
  }
}

/**
 * Match dogs from favorites
 */
export async function matchDog(favoriteDogIds: string[]): Promise<MatchResponse> {
  try {
    const response = await fetch(`${API_BASE}/dogs/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(favoriteDogIds),
    });

    return handleResponse<MatchResponse>(response);
  } catch (error) {
    console.error("Error matching dog:", error);
    throw error instanceof ApiError ? error : new Error('Failed to find match');
  }
}

/**
 * Check authentication status
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/dogs/breeds`, {
      method: "GET",
      credentials: "include",
    });

    await handleResponse<void>(response);
    return true;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}