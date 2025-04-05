import { Tabs } from "expo-router";
import TabBar from "./_component/TabBar";
import Header from "./_component/Header";
import { LocationProvider } from "./_hooks/useLocation";
import AuthContextProvider from "./_hooks/useAuth";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://80009cc741bd92843277d20ecf1a31dc@o4509099095293952.ingest.us.sentry.io/4509099096145920',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function TabLayout() {
  return (
    <AuthContextProvider>
      <LocationProvider>
      <Header />
        <Tabs
        screenOptions={{headerShown:false}}
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
          <Tabs.Screen name="crew" options={{ title: "crew" }} />

        </Tabs>
      </LocationProvider>
    </AuthContextProvider>
  );
});