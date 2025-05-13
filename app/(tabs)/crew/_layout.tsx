import { Stack } from "expo-router";

export default function CrewLayout() {
  return (
    <Stack initialRouteName="home/index">
      <Stack.Screen name="home/index" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}