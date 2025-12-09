import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function Menu({ navigation, route }) {
    const { data } = route?.params || {};
    if (data) {
        const nombre = (data.usr_nombre.split(' ')[0]) || 'Usuario';
        if (data.est_tipo != 2) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Menú</Text>
                        <Image source={require('../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        {data.perf_tipo >= 2 ? (
                            <Text style={styles.welcomeText2}>Bienvenido/a, {nombre}</Text>
                        ) : (
                            <Text style={styles.welcomeText}>Bienvenido/a, {nombre}</Text>
                        )}

                        {data.perf_tipo <= 2 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('reportes', { data })}>
                                <Image source={require('../img/reportes.png')} />
                                <Text style={styles.optionText}>Reportes</Text>
                            </TouchableOpacity>
                        )}

                        {data.perf_tipo === 1 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('alumnos', { data })}>
                                <Image source={require('../img/alumnos.png')} />
                                <Text style={styles.optionText}>Alumnos</Text>
                            </TouchableOpacity>
                        )}

                        {data.perf_tipo === 1 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('tecnicos', { data })}>
                                <Image source={require('../img/tecnicos.png')} />
                                <Text style={styles.optionText}>Técnicos</Text>
                            </TouchableOpacity>
                        )}

                        {data.perf_tipo === 2 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('informetecnico', { data })}>
                                <Image source={require('../img/information.png')} />
                                <Text style={styles.optionText}>Mi informe</Text>
                            </TouchableOpacity>
                        )}

                        {data.perf_tipo <= 2 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('dispositivos', { data })}>
                                <Image source={require('../img/dispositivos.png')} />
                                <Text style={styles.optionText}>Dispositivos</Text>
                            </TouchableOpacity>
                        )}

                        {data.perf_tipo === 3 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('creporte', { data })}>
                                <Image source={require('../img/nreport.png')} />
                                <Text style={styles.optionText}>Enviar reporte</Text>
                            </TouchableOpacity>
                        )}

                        {data.perf_tipo === 3 && (
                            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('reportesal', { data })}>
                                <Image source={require('../img/reportes.png')} />
                                <Text style={styles.optionText}>Consultar reportes</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.replace('login')}>
                            <Text style={styles.buttonText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }
        else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('eaccess');
    }
}
