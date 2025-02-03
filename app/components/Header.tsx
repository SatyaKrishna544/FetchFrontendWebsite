import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../providers/auth';

interface HeaderProps {
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showLogout = true }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      {/* Top Navigation Bar with Logout Button */}
      <View style={styles.topBar}>
        {showLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>← Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Header Content */}
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Welcome to Happy Tails!</Text>
        <Text style={styles.subtitle}>Find your perfect furry friend ❤️</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  logoutButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
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
});
