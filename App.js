import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNav';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function App() {
    // Block Android hardware back button globally.
    useEffect(() => {
        const onBackPress = () => true; // returning true prevents default behavior
        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <NavigationContainer>
                <StackNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
