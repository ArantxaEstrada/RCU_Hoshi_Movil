import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Alumno({ navigation, route }) {
    const { data } = route?.params || {};
    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Alumnos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('calumno', { data })}>
                            <Image source={require('../../img/create.png')} />
                            <Text style={styles.optionText}>Registrar alumno</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ralumno', { data })}>
                            <Image source={require('../../img/read.png')} />
                            <Text style={styles.optionText}>Buscar alumno</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ualumno', { data })}>
                            <Image source={require('../../img/update.png')} />
                            <Text style={styles.optionText}>Actualizar alumno</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('dalumno', { data })}>
                            <Image source={require('../../img/delete.png')} />
                            <Text style={styles.optionText}>Eliminar alumno</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('menu', { data })}>
                            <Text style={styles.buttonText}>Volver al menú</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('eaccess');
    }
}
