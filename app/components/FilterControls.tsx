import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { AGE_RANGES, SORT_BY_BREED, SORT_BY_NAME, SORT_BY_ZIP } from '../constants';

interface FilterControlsProps {
  breeds: string[];
  selectedBreed: string;
  sortOption: string;
  ageRange: string;
  favoritesCount: number;
  onBreedChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onSearch: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  breeds,
  selectedBreed,
  sortOption,
  ageRange,
  favoritesCount,
  onBreedChange,
  onSortChange,
  onAgeChange,
  onSearch,
}) => {
  const router = useRouter();

  return (
    <View style={styles.controls}>
      {/* Breed Filter */}
      <View style={styles.controlsRow}>
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Breed:</Text>
          <Picker
            selectedValue={selectedBreed}
            onValueChange={onBreedChange}
            style={styles.compactPicker}
          >
            <Picker.Item label="All Breeds" value="all" />
            {breeds.filter(breed => breed !== "all").map((breed) => (
              <Picker.Item key={breed} label={breed} value={breed} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.controlsRow}>
        {/* Name Sort */}
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Sort by Name:</Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={onSortChange}
            style={styles.compactPicker}
          >
            {SORT_BY_NAME.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        {/* Breed Sort */}
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Sort by Breed:</Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={onSortChange}
            style={styles.compactPicker}
          >
            {SORT_BY_BREED.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        {/* ZIP Sort */}
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Sort by ZIP:</Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={onSortChange}
            style={styles.compactPicker}
          >
            {SORT_BY_ZIP.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Age Range Filter */}
      <View style={styles.controlsRow}>
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Age Range:</Text>
          <Picker
            selectedValue={ageRange}
            onValueChange={onAgeChange}
            style={styles.compactPicker}
          >
            {AGE_RANGES.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={onSearch}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.favoriteButton]}
          onPress={() => router.push("/favorites")}
        >
          <Text style={styles.buttonText}>
            View Favorites ({favoritesCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#444',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
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
  favoriteButton: {
    backgroundColor: '#FF3B70',
  },
});