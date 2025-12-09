import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function DAlumno({ navigation, route }) {
    const { data, alumno } = route?.params || {};
    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');

    const regexId = /^[0-9]{1,20}$/;
    const regexPassword = /^.{8,25}$/;

    const handleDelete = async () => {
        try {
            setLoading(true);
            const idTrim = identificador.trim();
            const passwordTrim = password.trim();

            if (!idTrim || !passwordTrim) {
                setError('Todos los campos son obligatorios.');
                setLoading(false);
                return;
            }

            if (!regexId.test(idTrim)) {
                setError('Identificador inválido.');
                setLoading(false);
                return;
            }

            if (!regexPassword.test(passwordTrim)) {
                setError('Contraseña inválida.');
                setLoading(false);
                return;
            }

            const parseId = parseInt(idTrim);

            // Verificar que el identificador y contraseña coincidan con el admin actual
            if (parseId !== data.id || passwordTrim !== data.usr_pass) {
                setError('Identificador o contraseña incorrectos.');
                setLoading(false);
                return;
            }

            // Eliminar el alumno
            const { error: deleteError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .delete()
                .eq('id', alumno.id);

            if (deleteError) {
                setError(deleteError.message || 'No se pudo eliminar el alumno.');
                setLoading(false);
                return;
            }

            setError('');
            setLoading(false);
            setConfirm('Alumno eliminado exitosamente');
        } catch (err) {
            setError('Error al eliminar el alumno.');
            setLoading(false);
        }
    };

    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            if (confirm) {
                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                            <Text style={styles.confirmText}>{confirm}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('alumnos', { data })}>
                                <Text style={styles.buttonText}>Volver a Alumnos</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                );
            }

            if (!alumno) {
                navigation.replace('ralumno', { data });
                return null;
            }

            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Alumnos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Eliminar alumno</Text>

                        <View style={styles.formCard2}>
                            <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                                <Text style={styles.label2}>Información del alumno a eliminar:</Text>

                                <Text style={styles.label2}>Nombre completo</Text>
                                <Text style={styles.input2}>{alumno.usr_nombre} {alumno.usr_ap} {alumno.usr_am}</Text>

                                <Text style={styles.label2}>Boleta</Text>
                                <Text style={styles.input2}>{alumno.id}</Text>

                                <Text style={styles.label2}>Correo</Text>
                                <Text style={styles.input2}>{alumno.usr_correo}</Text>

                                <Text style={[styles.label2, { marginTop: 20, fontSize: 16, color: '#b91c1c' }]}>
                                    Para confirmar la eliminación, ingresa tus credenciales:
                                </Text>

                                <Text style={styles.label2}>Tu identificador (admin)</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Número de trabajador"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={identificador}
                                    onChangeText={setIdentificador}
                                />

                                <Text style={styles.label2}>Tu contraseña</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Contraseña"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </ScrollView>

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Eliminar alumno</Text>
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
