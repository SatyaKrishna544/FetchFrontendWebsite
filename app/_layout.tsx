import { Stack } from "expo-router";
import { AuthProvider } from "./auth"; // Ensure your AuthProvider is properly handling auth context

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Define your screen routes */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </AuthProvider>
  );
}
