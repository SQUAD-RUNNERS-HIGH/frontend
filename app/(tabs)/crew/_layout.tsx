import { Stack } from "expo-router";

export default function CrewLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}