import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function DAccess({ navigation, route }) {
    const { data } = route.params;
    if (data) {
        return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Menú</Text>
                <Image source={require('../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>
            <View style={styles.loggedInContainer}>
                <Text style={styles.welcomeText}>Hola, {data.usr_nombre}</Text>
                <Text style={styles.welcomeText}>Acceso denegado</Text>
                <Image source={require('../img/error.png')} style={styles.errorImage} />

                <Text style={styles.infoText}>No tienes permiso para acceder a esta sección.</Text>
                <TouchableOpacity style={styles.button2} onPress={() => navigation.replace('login')}>
                    <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
    } else {
        navigation.replace('eaccess');
    }
}
