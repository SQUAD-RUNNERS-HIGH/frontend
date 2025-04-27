import { Stack } from "expo-router";

export default function CrewLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}