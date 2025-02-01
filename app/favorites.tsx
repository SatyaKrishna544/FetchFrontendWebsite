import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Image, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useRouter } from "expo-router";
import { fetchDogDetails, matchDog } from "./api";
import { Dog } from "./types";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const storedFavorites = await AsyncStorage.getItem("favorites"); // Retrieve stored favorites
        const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

        if (favoriteIds.length > 0) {
          setFavorites(favoriteIds);
          const dogs = await fetchDogDetails("", favoriteIds);
          setFavoriteDogs(dogs);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load favorite dogs.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleMatch = async () => {
    if (favorites.length === 0) {
      Alert.alert("No Favorites", "Please add some favorite dogs first!");
      return;
    }

    try {
      const match = await matchDog("", favorites);
      if (match?.match) {
        const matchedDogDetails = favoriteDogs.find((dog) => dog.id === match.match);
        if (matchedDogDetails) {
          setMatchedDog(matchedDogDetails);
        } else {
          Alert.alert("Match Found!", `Dog ID: ${match.match} (Details not available)`);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to find a match.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Back to Home" onPress={() => router.replace("/")} />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>Your Favorite Dogs</Text>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : favoriteDogs.length > 0 ? (
        <FlatList
          data={favoriteDogs}
          keyExtractor={(dog) => dog.id}
          renderItem={({ item: dog }) => (
            <View style={{ marginBottom: 20, padding: 10, borderRadius: 8, backgroundColor: "#f5f5f5" }}>
              <Image source={{ uri: dog.img }} style={{ width: "100%", height: 200, borderRadius: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{dog.name} - {dog.breed}</Text>
              <Text>Age: {dog.age} years</Text>
              <Text>Location: {dog.zip_code}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No favorite dogs selected.</Text>
      )}

      <Button title="Find a Match" onPress={handleMatch} disabled={favoriteDogs.length === 0} />

      {matchedDog && (
        <View style={{ marginTop: 20, padding: 10, borderRadius: 8, backgroundColor: "#d1e7dd" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Matched Dog!</Text>
          <Image source={{ uri: matchedDog.img }} style={{ width: "100%", height: 200, borderRadius: 8, marginBottom: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{matchedDog.name} - {matchedDog.breed}</Text>
          <Text>Age: {matchedDog.age} years</Text>
          <Text>Location: {matchedDog.zip_code}</Text>
        </View>
      )}
    </View>
  );
}
