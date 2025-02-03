// In app/hooks/useDogSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { fetchBreeds, searchDogs, fetchDogDetails } from '../api';
import { Dog } from '../types';
import { PAGE_SIZE } from '../constants';

export const useDogSearch = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDogs, setTotalDogs] = useState(0);
  const [sortOption, setSortOption] = useState("breed:asc");
  const [ageRange, setAgeRange] = useState<string>("all");

  // Add the filterByAge function
  const filterByAge = (dogs: Dog[], range: string) => {
    if (range === "all") return dogs;
    
    const [min, max] = range.split("-").map(Number);
    return dogs.filter(dog => {
      const age = Number(dog.age);
      if (range === "7+") return age >= 7;
      return age >= min && age < max;
    });
  };

  const loadBreeds = async () => {
    try {
      const breedList = await fetchBreeds();
      if (breedList.length > 0) {
        setBreeds(["all", ...breedList]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading breeds:", error);
      return false;
    }
  };

  const performSearch = useCallback(async (breed: string, from: number, sort: string) => {
    try {
      setIsLoading(true);
      const searchResult = await searchDogs({
        breed: breed === "all" ? "" : breed,
        size: PAGE_SIZE,
        sort,
        from: from.toString()
      });
      
      if (searchResult?.resultIds) {
        const dogDetails = await fetchDogDetails(searchResult.resultIds);
        const filteredDogs = filterByAge(dogDetails || [], ageRange);
        setDogs(filteredDogs);
        setTotalDogs(searchResult.total);
        setCurrentPage(Math.floor(from / PAGE_SIZE));
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert("Error", "Failed to search dogs.");
    } finally {
      setIsLoading(false);
    }
  }, [ageRange]);

  // Initial load - only load breeds
  useEffect(() => {
    loadBreeds();
  }, []);

  return {
    breeds,
    selectedBreed,
    setSelectedBreed,
    dogs,
    isLoading,
    currentPage,
    totalDogs,
    sortOption,
    setSortOption,
    ageRange,
    setAgeRange,
    performSearch,
    loadBreeds
  };
};