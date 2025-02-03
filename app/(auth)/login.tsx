import React, { useState, useEffect } from "react";
import { View, Image, Alert, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../providers/auth";
import { Button, Text, TextInput, HelperText } from "react-native-paper";

export default function LoginScreen() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
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
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  const validateInputs = () => {
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(name, email);
      if (success) {
        setName("");
        setEmail("");
        router.replace("/");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (error) {
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
        <Text style={styles.inputLabel}>Name:</Text>
        <TextInput
          mode="outlined"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) validateInputs();
          }}
          disabled={isLoading}
          placeholder="Enter your name"
          error={!!nameError}
          outlineStyle={styles.inputOutline}
          style={styles.input}
        />
        <HelperText type="error" visible={!!nameError}>
          {nameError}
        </HelperText>

        <Text style={styles.inputLabel}>Email:</Text>
        <TextInput
          mode="outlined"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) validateInputs();
          }}
          disabled={isLoading}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!emailError}
          outlineStyle={styles.inputOutline}
          style={styles.input}
        />
        <HelperText type="error" visible={!!emailError}>
          {emailError}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          contentStyle={styles.buttonContent}
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
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#6A4C93",
    marginBottom: 15,
  },
  loginBox: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 6,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#6A4C93",
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});