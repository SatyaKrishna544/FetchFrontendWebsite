import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Image, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useAuth } from "./auth";
import { fetchBreeds, searchDogs, fetchDogDetails, matchDog } from "./api";
import { SearchResponse, Dog } from "./types";


const SORT_OPTIONS = [
  { label: "Breed (A-Z)", value: "breed:asc" },
  { label: "Breed (Z-A)", value: "breed:desc" },
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" }
];

const PAGE_SIZE = 25; // Match API default size

export default function IndexPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDogs, setTotalDogs] = useState(0);
  const [sortOption, setSortOption] = useState("breed:asc");

  // Fetch breeds and initial dogs on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const breedList = await fetchBreeds("");
        if (breedList.length > 0) {
          setBreeds(breedList);
          setSelectedBreed(breedList[0]);
          await performSearch(breedList[0], 0, "breed:asc");
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to load initial data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      initializeData();
    }
  }, [isAuthenticated]);

  const performSearch = async (breed: string, from: number, sort: string) => {
    try {
      setIsLoading(true);
      const searchResult = await searchDogs("", {
        breed,
        size: PAGE_SIZE,
        sort,
        from: from.toString()
      });

      if (searchResult?.resultIds) {
        const dogDetails = await fetchDogDetails("", searchResult.resultIds);
        if (Array.isArray(dogDetails)) {
          setDogs(dogDetails);
          setTotalDogs(searchResult.total);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search dogs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!selectedBreed) return;
    setCurrentPage(0);
    performSearch(selectedBreed, 0, sortOption);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const from = newPage * PAGE_SIZE;
    performSearch(selectedBreed, from, sortOption);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(0);
    performSearch(selectedBreed, 0, value);
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  };

  const handleMatch = async () => {
    if (favorites.length === 0) {
      Alert.alert("No Favorites", "Please select some favorite dogs first!");
      return;
    }

    try {
      const match = await matchDog("", favorites);
      if (match?.match) {
        Alert.alert("Match Found!", `You matched with a dog! ID: ${match.match}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to find a match. Please try again.");
    }
  };

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  const totalPages = Math.ceil(totalDogs / PAGE_SIZE);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Browse Dogs</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button 
            title={`Favorites (${favorites.length})`} 
            onPress={handleMatch}
          />
          <Button title="Logout" onPress={() => router.replace("/login")} />
        </View>
      </View>

      {/* Filters Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 5 }}>Breed:</Text>
        <Picker
          selectedValue={selectedBreed}
          onValueChange={setSelectedBreed}
          enabled={!isLoading}
          style={{ marginBottom: 10 }}
        >
          <Picker.Item label="Select a breed" value="" />
          {breeds.map((breed) => (
            <Picker.Item key={breed} label={breed} value={breed} />
          ))}
        </Picker>

        <Text style={{ marginBottom: 5 }}>Sort by:</Text>
        <Picker
          selectedValue={sortOption}
          onValueChange={handleSortChange}
          enabled={!isLoading}
          style={{ marginBottom: 10 }}
        >
          {SORT_OPTIONS.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>

        <Button 
          title="Search" 
          onPress={handleSearch} 
          disabled={isLoading || !selectedBreed}
        />
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Dog List */}
      {!isLoading && (
        <>
          <FlatList
            data={dogs}
            keyExtractor={(dog) => dog.id}
            renderItem={({ item: dog }) => (
              <View 
                style={{ 
                  marginBottom: 20, 
                  padding: 10, 
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5'
                }}
              >
                <Image 
                  source={{ uri: dog.img }} 
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    borderRadius: 8,
                    marginBottom: 10
                  }} 
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {dog.name} - {dog.breed}
                </Text>
                <Text>Age: {dog.age} years</Text>
                <Text>Location: {dog.zip_code}</Text>
                
                <Button
                  title={favorites.includes(dog.id) ? "♥ Favorited" : "♡ Add to Favorites"}
                  onPress={() => toggleFavorite(dog.id)}
                />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {/* Pagination Controls */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingVertical: 10 
          }}>
            <Button
              title="Previous"
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || isLoading}
            />
            <Text>
              Page {currentPage + 1} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || isLoading}
            />
          </View>
        </>
      )}
    </View>
  );
}