import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageDisplayLimit?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageDisplayLimit = 5
}) => {
  const renderPageNumbers = () => {
    let pages = [];
    
    for (let i = 0; i < totalPages; i++) {
      const isCurrent = i === currentPage;
      const showPage =
        i < pageDisplayLimit || 
        i === totalPages - 1 || 
        Math.abs(i - currentPage) <= 1;

      if (!showPage) {
        if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
        continue;
      }

      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageNumber, isCurrent && styles.currentPage]}
          onPress={() => onPageChange(i)}
        >
          <Text style={[
            styles.pageNumberText,
            isCurrent ? styles.currentPageText : styles.pageText
          ]}>
            {i + 1}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  return (
    <View style={styles.pagination}>
      {/* Left Arrow */}
      <TouchableOpacity
        style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <MaterialIcons 
          name="chevron-left" 
          size={24} 
          color={currentPage === 0 ? "#ccc" : "#fff"} 
        />
      </TouchableOpacity>

      {/* Page Numbers */}
      {renderPageNumbers()}

      {/* Right Arrow */}
      <TouchableOpacity
        style={[
          styles.pageButton,
          currentPage >= totalPages - 1 && styles.pageButtonDisabled
        ]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color={currentPage >= totalPages - 1 ? "#ccc" : "#fff"} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  pageButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#007AFF',
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageNumber: {
    minWidth: 36,
    height: 36,
    padding: 8,
    marginHorizontal: 3,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPage: {
    backgroundColor: '#007AFF',
  },
  pageNumberText: {
    fontSize: 16,
    textAlign: 'center',
  },
  currentPageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageText: {
    color: '#333',
  },
});