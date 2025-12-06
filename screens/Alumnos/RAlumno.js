import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';
import React from 'react';

export default function RAlumno({ navigation, route }) {
    const { data } = route?.params || {};
    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            const [boleta, setBoleta] = React.useState('');
            const [error, setError] = React.useState('');
            const buscarAlumno = () => {
                // Lógica para buscar alumno por boleta
                if (boleta.trim() === '') {
                    setError('Por favor, ingrese una boleta válida.');
                } else {
                    setError('');
                    // Aquí iría la lógica para buscar el alumno en la base de datos
                    console.log('Buscando alumno con boleta:', boleta);
                }
            }
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Alumnos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Buscar alumno</Text>
                        <View style={styles.formCard2}>
                            <Text style={styles.label2}>Boleta del alumno</Text>
                            <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" value={boleta} onChangeText={setBoleta} />

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Buscar alumno</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('alumnos')}>
                            <Text style={styles.buttonText}>Volver</Text>
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
