import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { Dog } from '../types';
import { DogDetailModal } from './DogDetailModal';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
  cardWidth: number;
  showRemoveButton?: boolean;
}

export const DogCard: React.FC<DogCardProps> = ({
  dog,
  isFavorite,
  onToggleFavorite,
  cardWidth,
  showRemoveButton = false, 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleFavorite(dog.id);
  };

  return (
    <>
      <Card style={[styles.card, { width: cardWidth }]}>
        <Card.Cover source={{ uri: dog.img }} style={styles.dogImage} />
        <Card.Content style={styles.cardContent}>
          <View style={styles.detailsContainer}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <Text style={styles.dogBreed}>{dog.breed}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.dogInfo}>Age: {dog.age}</Text>
              <Text style={styles.dogInfo}>ZIP: {dog.zip_code}</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => setIsModalVisible(true)}
              style={styles.viewButton}
              labelStyle={styles.viewButtonLabel}
              compact={true} 
            >
              View Details
            </Button>
            {showRemoveButton ? (
              <Button
                mode="contained"
                onPress={() => onToggleFavorite(dog.id)}
                style={styles.removeButton}
              >
                Remove
              </Button>
            ) : (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <IconButton
                  icon={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  iconColor={isFavorite ? "#FF3B70" : "#666"}
                  onPress={handleFavoritePress}
                  style={styles.heartButton}
                />
              </Animated.View>
            )}
          </View>
        </Card.Content>
      </Card>

      <DogDetailModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        dog={dog}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  dogImage: {
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dogBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dogInfo: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  viewButton: {
    borderColor: '#6A4C93',
    height: 36,
  },
  viewButtonLabel: {
    color: '#6A4C93',
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: '#FF3B70',
  },
  heartButton: {
    margin: 0,
    marginRight: -8,
  },
});