import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function CAlumno({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Alumnos</Text>
                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>
            <View style={styles.loggedInContainer2}>
                <Text style={styles.welcomeText}>Agregar alumno</Text>
                <View style={styles.formCard2}>
                    <Text style={styles.label2}>Nombre del alumno</Text>
                    <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" />

                    <Text style={styles.label2}>Boleta del alumno</Text>
                    <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                    <Text style={styles.label2}>Correo del alumno</Text>
                    <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="email-address" />

                    <Text style={styles.label2}>Contraseña del alumno</Text>
                    <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="email-address" />

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Agregar alumno</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('alumnos')}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
