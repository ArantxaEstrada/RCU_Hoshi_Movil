import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function AlumnoX({ route, navigation }) {
    const { alumno, data } = route?.params || {};

    if (data && alumno) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Información del Alumno</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Detalles del Alumno</Text>
                        <View style={styles.formCard2}>
                            <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                                <Text style={styles.label2}>Nombre completo</Text>
                                <Text style={styles.input2}>{alumno.usr_nombre} {alumno.usr_ap} {alumno.usr_am}</Text>

                                <Text style={styles.label2}>Boleta</Text>
                                <Text style={styles.input2}>{alumno.id}</Text>

                                <Text style={styles.label2}>Correo electrónico</Text>
                                <Text style={styles.input2}>{alumno.usr_correo}</Text>

                                <Text style={styles.label2}>Estado</Text>
                                <Text style={styles.input2}>
                                    {alumno.est_tipo === 1 ? 'Activo' :
                                     alumno.est_tipo === 2 ? 'Baja' :
                                     alumno.est_tipo === 3 ? 'Ausente' :
                                     alumno.est_tipo === 4 ? 'Dictamen' : 'Desconocido'}
                                </Text>
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('ualumno', { alumno, data })}
                            >
                                <Text style={styles.buttonText}>Actualizar alumno</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('dalumno', { alumno, data })}
                            >
                                <Text style={styles.buttonText}>Eliminar alumno</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('alumnos', { data })}>
                            <Text style={styles.buttonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('ralumno', { data });
    }
}
