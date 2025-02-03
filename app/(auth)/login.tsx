import React, { useState, useEffect } from "react";
import { View, TextInput, Image, Alert, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../providers/auth";
import { Button, Text } from "react-native-paper";

export default function LoginScreen() {

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    console.log('Auth state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Authenticated, attempting navigation');
      router.replace("/");
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    console.log('Starting login process');
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(name, email);
      console.log('Login result:', success);
      if (success) {
        console.log('Login successful, attempting navigation');
        setName("");
        setEmail("");
        // Force navigation to home
        router.replace("/");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>🐶 Welcome to Happy Tails!</Text>
        <Text style={styles.subtitle}>Find your perfect furry friend ❤️</Text>
      </Animated.View>

      <View style={styles.loginBox}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!isLoading}
          placeholder="Enter your name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF3E0",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
  loginBox: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6A4C93",
  },
});
