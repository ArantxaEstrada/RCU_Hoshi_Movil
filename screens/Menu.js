import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function Menu({ navigation, route }) {
    const { nombre = '' } = route.params ?? {};
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Menú</Text>
                <Image source={require('../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>
            <View style={styles.loggedInContainer2}>
                <Text style={styles.welcomeText}>Bienvenido/a, {nombre}</Text>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('reportes')}>
                    <Image source={require('../img/reportes.png')} />
                    <Text style={styles.optionText}>Reportes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('alumnos')}>
                    <Image source={require('../img/alumnos.png')} />
                    <Text style={styles.optionText}>Alumnos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('tecnicos')}>
                    <Image source={require('../img/tecnicos.png')} />
                    <Text style={styles.optionText}>Técnicos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('dispositivos')}>
                    <Image source={require('../img/dispositivos.png')} />
                    <Text style={styles.optionText}>Dispositivos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2} onPress={() => navigation.replace('login')}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
