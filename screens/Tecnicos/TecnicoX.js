import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function TecnicoX({ navigation, route }) {
    const { data, tecnico } = route?.params || {};

    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            if (tecnico) {
                const estadoText = tecnico.est_tipo === 1 ? 'Activo' : tecnico.est_tipo === 2 ? 'Baja' : tecnico.est_tipo === 3 ? 'Ausente' : tecnico.est_tipo === 4 ? 'Dictamen' : 'Desconocido';

                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={styles.superiorPanel}>
                            <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                            <Text style={styles.superiorTitle}>Técnicos</Text>
                            <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                        </View>
                        <View style={styles.loggedInContainer2}>
                            <Text style={styles.welcomeText}>Detalles del técnico</Text>
                            <View style={styles.formCard2}>
                                <Text style={styles.label2}>Nombre completo:</Text>
                                <Text style={styles.input}>{tecnico.usr_nombre} {tecnico.usr_ap} {tecnico.usr_am}</Text>

                                <Text style={styles.label2}>ID del técnico:</Text>
                                <Text style={styles.input}>{tecnico.id}</Text>

                                <Text style={styles.label2}>Correo:</Text>
                                <Text style={styles.input}>{tecnico.usr_correo}</Text>

                                <Text style={styles.label2}>Estado:</Text>
                                <Text style={styles.input}>{estadoText}</Text>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate('utecnico', { tecnico, data })}
                                >
                                    <Text style={styles.buttonText}>Actualizar técnico</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate('dtecnico', { tecnico, data })}
                                >
                                    <Text style={styles.buttonText}>Eliminar técnico</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('tecnicos', { data })}>
                                <Text style={styles.buttonText}>Volver</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                );
            } else {
                navigation.replace('tecnicos', { data });
            }
        } else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('eaccess');
    }
}
