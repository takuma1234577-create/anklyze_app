import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/providers/AuthProvider';
import { RevenueCatProvider } from './src/providers/RevenueCatProvider';
import { SettingsProvider } from './src/providers/SettingsProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <SafeAreaProvider>
        <AuthProvider>
          <RevenueCatProvider>
            <SettingsProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </SettingsProvider>
          </RevenueCatProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
