import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Alumno({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Alumnos</Text>
                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>
            <View style={styles.loggedInContainer2}>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('calumno')}>
                    <Image source={require('../../img/create.png')} />
                    <Text style={styles.optionText}>Registrar alumno</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ralumno')}>
                    <Image source={require('../../img/read.png')} />
                    <Text style={styles.optionText}>Buscar alumno</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ualumno')}>
                    <Image source={require('../../img/update.png')} />
                    <Text style={styles.optionText}>Actualizar alumno</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('dalumno')}>
                    <Image source={require('../../img/delete.png')} />
                    <Text style={styles.optionText}>Eliminar alumno</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('menu')}>
                    <Text style={styles.buttonText}>Volver al menú</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
