import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router"; // Use the correct router hook from expo-router
import { useAuth } from "./auth";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(name, email);
      
      if (result) {
        // Clear form fields
        setName("");
        setEmail("");
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

  // Redirect after login if the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // Redirect to home or desired path
    }
  }, [isAuthenticated, router]);

  return (
    <View style={{ padding: 20 }}>
      <Text>Name:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 10,
          borderRadius: 4,
        }}
        value={name}
        onChangeText={setName}
        editable={!isLoading}
        placeholder="Enter your name"
      />
      <Text>Email:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 10,
          borderRadius: 4,
        }}
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}
