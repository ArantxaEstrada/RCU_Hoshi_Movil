import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function RAlumno({ navigation, route }) {
    const { data } = route?.params || {};
    const [boleta, setBoleta] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [alumno, setAlumno] = useState(null);

    const regexBoleta = /^[0-9]{1,20}$/;

    const buscarAlumno = async () => {
        try {
            setLoading(true);
            setError('');
            setAlumno(null);

            const boletaTrim = boleta.trim();

            if (!boletaTrim) {
                setError('Por favor, ingrese una boleta.');
                setLoading(false);
                return;
            }

            if (!regexBoleta.test(boletaTrim)) {
                setError('La boleta solo puede contener números.');
                setLoading(false);
                return;
            }

            const parseBoleta = parseInt(boletaTrim);

            // Buscar el alumno en la base de datos
            const { data: alumnoData, error: searchError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .select('*')
                .eq('id', parseBoleta)
                .eq('perf_tipo', 3)
                .maybeSingle();

            if (searchError) {
                setError(searchError.message || 'Error al buscar el alumno.');
                setLoading(false);
                return;
            }

            if (!alumnoData) {
                setError('No se encontró un alumno con esa boleta.');
                setLoading(false);
                return;
            }

            setAlumno(alumnoData);
            setLoading(false);
            // Navegar a AlumnoX con los datos del alumno
            navigation.navigate('alumnox', { alumno: alumnoData, data });
        } catch (err) {
            setError('Error al buscar el alumno.');
            setLoading(false);
        }
    };

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
                        <Text style={styles.welcomeText}>Buscar alumno</Text>
                        <View style={styles.formCard2}>
                            <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                                <Text style={styles.label2}>Boleta del alumno</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Número de boleta"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={boleta}
                                    onChangeText={setBoleta}
                                />

                                {error ? <Text style={styles.error}>{error}</Text> : null}
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={buscarAlumno}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Buscar alumno</Text>
                                )}
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
        navigation.replace('eaccess');
    }
}
