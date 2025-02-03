import React from 'react';
import { View, Text, Modal, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Dog } from '../types';

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  matchedDog: Dog | null;
}

export const MatchModal: React.FC<MatchModalProps> = ({ visible, onClose, matchedDog }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Matched Dog!</Text>
          {matchedDog && (
            <>
              <Image source={{ uri: matchedDog.img }} style={styles.dogImage} />
              <Text style={styles.dogName}>{matchedDog.name} - {matchedDog.breed}</Text>
              <Text style={styles.dogInfo}>Age: {matchedDog.age} years</Text>
              <Text style={styles.dogInfo}>Zip: {matchedDog.zip_code}</Text>
            </>
          )}
          <Button onPress={onClose} style={styles.modalButton}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  dogImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  dogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dogInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalButton: {
    marginTop: 12,
    backgroundColor: "#6A4C93",
    paddingVertical: 8,
    borderRadius: 6,
  },
});