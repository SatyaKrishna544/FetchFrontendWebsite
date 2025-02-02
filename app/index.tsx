import React, { useEffect, useState } from "react";
import { View, Text, Image, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useAuth } from "./auth";
import { fetchBreeds, searchDogs, fetchDogDetails } from "./api";
import { Dog } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const SORT_OPTIONS = [
  { label: "Breed (A-Z)", value: "breed:asc" },
  { label: "Breed (Z-A)", value: "breed:desc" },
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },
];

const PAGE_SIZE = 12; // Updated to show 15 cards per page
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARDS_PER_ROW = 4; // Updated to 5 cards per row
const CARD_WIDTH = (SCREEN_WIDTH - 40 - (CARDS_PER_ROW * CARD_MARGIN * 2)) / CARDS_PER_ROW;

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
  const [showFavoriteMessage, setShowFavoriteMessage] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState<string>("all");

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const breedList = await fetchBreeds("");
        setBreeds(breedList);
        setSelectedBreed(breedList[0] || "");
        await performSearch(breedList[0] || "", 0, "breed:asc");
      } catch (error) {
        Alert.alert("Error", "Failed to load initial data.");
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
        setDogs(dogDetails || []);
        setTotalDogs(searchResult.total);
        setCurrentPage(Math.floor(from / PAGE_SIZE));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search dogs.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (dogId: string) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(dogId);
      const updatedFavorites = isFavorite
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId];
      
      AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      
      // Show/hide favorite message
      setShowFavoriteMessage(isFavorite ? null : dogId);
      if (!isFavorite) {
        setTimeout(() => setShowFavoriteMessage(null), 2000); // Hide after 2 seconds
      }
      
      return updatedFavorites;
    });
  };

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  const totalPages = Math.ceil(totalDogs / PAGE_SIZE);

  return (
    <ScrollView style={styles.container}>
      {/* Cute Dog Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Welcome to Happy Tails!</Text>
        <Text style={styles.subtitle}>Find your perfect furry friend ❤️</Text>
      </View>

      {/* Compact Controls */}
      <View style={styles.controls}>
        {/* First Row - Breed and Sort */}
        <View style={styles.controlsRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.filterLabel}>Breed:</Text>
            <Picker
              selectedValue={selectedBreed}
              onValueChange={setSelectedBreed}
              style={styles.compactPicker}
            >
              {breeds.map((breed) => (
                <Picker.Item key={breed} label={breed} value={breed} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <Picker
              selectedValue={sortOption}
              onValueChange={(value) => {
                setSortOption(value);
                performSearch(selectedBreed, 0, value);
              }}
              style={styles.compactPicker}
            >
              {SORT_OPTIONS.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Second Row - Age filter */}
        <View style={styles.controlsRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.filterLabel}>Age Range:</Text>
            <Picker
              selectedValue={ageFilter}
              onValueChange={setAgeFilter}
              style={styles.compactPicker}
            >
              <Picker.Item label="All Ages" value="all" />
              <Picker.Item label="0-1 years" value="0-1" />
              <Picker.Item label="1-3 years" value="1-3" />
              <Picker.Item label="3-7 years" value="3-7" />
              <Picker.Item label="7+ years" value="7-100" />
            </Picker>
          </View>
        </View>

        {/* Third Row - Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => performSearch(selectedBreed, 0, sortOption)}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.favoriteButton]}
            onPress={() => router.push("/favorites")}
          >
            <Text style={styles.buttonText}>
              Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A4C93" />
        </View>
      ) : (
        <>
          {/* Dog Grid */}
          <View style={styles.gridContainer}>
            {dogs.map((dog) => (
              <View key={dog.id} style={styles.card}>
                <Image
                  source={{ uri: dog.img }}
                  style={styles.dogImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.dogName}>{dog.name}</Text>
                  <Text style={styles.dogBreed}>{dog.breed}</Text>
                  <View style={styles.dogInfoContainer}>
                    <Text style={styles.dogInfo}>Age: {dog.age} years</Text>
                    <Text style={styles.dogInfo}>ZIP: {dog.zip_code}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.favoriteToggle,
                      favorites.includes(dog.id) && styles.favoriteToggleActive
                    ]}
                    onPress={() => toggleFavorite(dog.id)}
                  >
                    <Text style={[
                      styles.favoriteToggleText,
                      favorites.includes(dog.id) && styles.favoriteToggleTextActive
                    ]}>
                      {favorites.includes(dog.id) ? '♥' : '♡'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
              onPress={() => performSearch(selectedBreed, (currentPage - 1) * PAGE_SIZE, sortOption)}
              disabled={currentPage === 0}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Page {currentPage + 1} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.pageButton, currentPage >= totalPages - 1 && styles.pageButtonDisabled]}
              onPress={() => performSearch(selectedBreed, (currentPage + 1) * PAGE_SIZE, sortOption)}
              disabled={currentPage >= totalPages - 1}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  
  pickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  compactPicker: {
    height: 36,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  favoriteButton: {
    backgroundColor: '#FF3B70',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dogImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 8,
    position: 'relative',
  },
  dogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dogBreed: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dogInfoContainer: {
    marginBottom: 8,
  },
  dogInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  favoriteToggle: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 6,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteToggleActive: {
    backgroundColor: '#FFE5EC',
  },
  favoriteToggleText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
  },
  favoriteToggleTextActive: {
    color: '#FF3B70',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  pageButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  pageText: {
    fontSize: 14,
    color: '#666',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  zipInput: {
    height: 36,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  favoriteMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  favoriteMessageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#444',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    padding: 16,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A4C93",
  },
  subtitle: {
    fontSize: 16,
    color: "#6A4C93",
    marginBottom: 15,
  },
  controls: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6A4C93",
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

});