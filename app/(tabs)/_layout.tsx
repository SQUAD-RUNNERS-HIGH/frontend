import { Tabs } from "expo-router";
import TabBar from "../../component/TabBar";
import Header from "../../component/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import GlobalModal from "@/component/GlobalModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();
export default function TabLayout() {
  useReactQueryDevTools(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor="black" translucent={false} />
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <GlobalModal />

        <Tabs screenOptions={{ headerShown: false }} tabBar={() => <TabBar />}>
          <Tabs.Screen
            name="index"
            options={{
              title: "index",
              tabBarStyle: { display: "none" }, // 탭바 숨김
            }}
          />
          <Tabs.Screen name="login" options={{ title: "login" }} />
          <Tabs.Screen
            name="signup"
            options={{ title: "signup", headerShown: false }}
          />
          <Tabs.Screen name="map" options={{ title: "map" }} />
          <Tabs.Screen name="crew" options={{ title: "crew" }} />
        </Tabs>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
