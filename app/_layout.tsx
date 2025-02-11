import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import Header from "./_component/Header";
import TabBar from "./_component/TabBar";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{header: () => <Header />}} tabBar={(props) => <TabBar />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="login" options={{ title: 'Login' }} />
      <Tabs.Screen name="signup" options={{ title: 'Signup' }} />
    </Tabs>
  );
}