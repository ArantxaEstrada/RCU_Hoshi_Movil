import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNav';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <NavigationContainer>
                <StackNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
