import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Reportes({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Reportes</Text>
                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>

            <View style={styles.loggedInContainer2}>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('pendientes')}>
                    <Image source={require('../../img/pending.png')} />
                    <Text style={styles.optionText}>Reportes pendientes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('completados')}>
                    <Image source={require('../../img/completed.png')} />
                    <Text style={styles.optionText}>Reportes completados</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('menu')}>
                    <Text style={styles.buttonText}>Volver al menú</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
