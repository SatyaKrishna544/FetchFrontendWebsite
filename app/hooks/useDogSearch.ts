// 📁 app/hooks/useDogSearch.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { searchDogs, fetchDogDetails } from '../api';
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

  const filterByAge = (dogs: Dog[], range: string) => {
    if (range === "all") return dogs;
    
    const [min, max] = range.split("-").map(Number);
    return dogs.filter(dog => {
      const age = Number(dog.age);
      if (range === "7+") return age >= 7;
      return age >= min && age < max;
    });
  };

  const performSearch = async (breed: string, from: number, sort: string) => {
    try {
      setIsLoading(true);
      console.log('Performing search:', { breed, from, sort });
      
      const searchResult = await searchDogs({
        breed: breed === "all" ? "" : breed,
        size: PAGE_SIZE,
        sort,
        from: from.toString()
      });
      
      console.log('Search result:', searchResult);

      if (searchResult?.resultIds) {
        const dogDetails = await fetchDogDetails(searchResult.resultIds);
        console.log('Dog details:', dogDetails);
        
        const filteredDogs = filterByAge(dogDetails || [], ageRange);
        console.log('Filtered dogs:', filteredDogs);
        
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
  };

  return {
    breeds,
    setBreeds,
    selectedBreed,
    setSelectedBreed,
    dogs,
    isLoading,
    setIsLoading,
    currentPage,
    totalDogs,
    sortOption,
    setSortOption,
    ageRange,
    setAgeRange,
    performSearch,
  };
};