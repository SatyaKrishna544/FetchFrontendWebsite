import { Dog, Match } from "./types";
import { Location, Coordinates } from "./types";

const API_BASE = "https://frontend-take-home-service.fetch.com";

// Function to log in a user
export const loginUser = async (name: string, email: string) => {
  try {
    const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      credentials: "include", // Include credentials for cookie-based auth
    });

    // Check if the response is ok (200-299 range)
    if (response.ok) {
      // If successful, we don't expect a JSON response, just a cookie being set
      console.log("Login successful, cookies set");
      return { success: true }; // Indicate successful login
    } else {
      throw new Error("Login failed: " + response.statusText);
    }
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};


// Function to log out the user
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include", // Ensures session cookies are cleared
    });

    if (!response.ok) throw new Error("Logout failed");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Fetch available dog breeds
export const fetchBreeds = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE}/dogs/breeds`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
    });

    if (!response.ok) throw new Error("Failed to fetch breeds");

    return response.json();
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return [];
  }
};

// Fetch dog search results based on filters
export const searchDogs = async (
  token: string,
  filters: { breed?: string; size?: number; sort?: string; from?: string }
) => {
  try {
    let query = `size=${filters.size || 10}&sort=${filters.sort || "breed:asc"}`;
    if (filters.breed) query += `&breeds=${filters.breed}`;
    if (filters.from) query += `&from=${filters.from}`;

    const response = await fetch(`${API_BASE}/dogs/search?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials:"include",
    });

    if (!response.ok) throw new Error("Failed to search dogs");

    return response.json();
  } catch (error) {
    console.error("Error searching dogs:", error);
    return null;
  }
};

// Fetch details of specific dogs by IDs
export const fetchDogDetails = async (token: string, dogIds: string[]) => {
  try {
    const response = await fetch(`${API_BASE}/dogs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) throw new Error("Failed to fetch dog details");

    return response.json();
  } catch (error) {
    console.error("Error fetching dog details:", error);
    return [];
  }
};

// Match favorite dogs and get a single matched dog ID
export const matchDog = async (token: string, favoriteDogIds: string[]) => {
  try {
    const response = await fetch(`${API_BASE}/dogs/match`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify(favoriteDogIds),
    });

    if (!response.ok) throw new Error("Failed to find match");

    return response.json();
  } catch (error) {
    console.error("Error matching dog:", error);
    return null;
  }
};

// Fetch location details for given ZIP codes
export async function fetchLocationsByZip(token: string, zipCodes: string[]): Promise<Location[]> {
  const response = await fetch(`${API_BASE}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(zipCodes),
  });
  if (!response.ok) throw new Error("Failed to fetch locations");
  return response.json();
}

// Search locations by city, state, or geographic bounding box
export async function searchLocations(
  token: string,
  city?: string,
  states?: string[],
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
    bottom_right?: Coordinates;
    top_right?: Coordinates;
  },
  size: number = 25,
  from?: number
): Promise<{ results: Location[]; total: number }> {
  const response = await fetch(`${API_BASE}/locations/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ city, states, geoBoundingBox, size, from }),
  });
  if (!response.ok) throw new Error("Failed to search locations");
  return response.json();
}