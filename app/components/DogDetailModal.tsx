import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { Dog } from '../types';

interface DogDetailModalProps {
  visible: boolean;
  onClose: () => void;
  dog: Dog | null;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({ visible, onClose, dog }) => {
  if (!dog) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            style={styles.closeIcon}
          />
          <Card style={styles.card}>
            <Card.Cover source={{ uri: dog.img }} style={styles.dogImage} />
            <Card.Content style={styles.cardContent}>
              <View style={styles.detailsContainer}>
                <Text style={styles.dogName}>{dog.name}</Text>
                <Text style={styles.dogBreed}>{dog.breed}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.dogInfo}>🎂 Age: {dog.age} years</Text>
                  <Text style={styles.dogInfo}>📍 ZIP: {dog.zip_code}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Button
            mode="contained"
            onPress={onClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dogImage: {
    height: 300,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  dogName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dogBreed: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  dogInfo: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#6A4C93',
  },
});
