import "react-native-get-random-values";
import { Tabs } from "expo-router";
import TabBar from "./_component/TabBar";
import Header from "./_component/Header";
import { LocationProvider } from "./_hooks/useLocation";
import AuthContextProvider from "./_hooks/useAuth";

export default function TabLayout() {
  return (
    <AuthContextProvider>
      <LocationProvider>
        <Tabs
          screenOptions={{
            header: () => <Header />, // 모든 탭에 공통적으로 헤더 설정
          }}
          tabBar={() => <TabBar />}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Intro",
              headerShown: false, // 헤더를 숨김
              tabBarStyle: { display: "none" }, // 탭바 숨김
            }}
          />
          <Tabs.Screen
            name="login"
            options={{ title: "login", headerShown: false }}
          />
          <Tabs.Screen
            name="signup"
            options={{ title: "signup", headerShown: false }}
          />
          <Tabs.Screen name="map" options={{ title: "map" }} />
        </Tabs>
      </LocationProvider>
    </AuthContextProvider>
  );
}
