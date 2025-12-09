import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function UAlumno({ navigation, route }) {
    const { data, alumno } = route?.params || {};
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [estado, setEstado] = useState(1);
    const [showEstadoList, setShowEstadoList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPasswordLength = /^.{8,25}$/;
    const regexPasswordHasLetter = /[A-Za-z]/;
    const regexPasswordHasNumber = /[0-9]/;

    const estadosDisponibles = [
        { id: 1, nombre: 'Activo' },
        { id: 2, nombre: 'Baja' },
        { id: 4, nombre: 'Dictamen' }
    ];

    const getEstadoNombre = (estadoId) => {
        const estado = estadosDisponibles.find(e => e.id === estadoId);
        return estado ? estado.nombre : 'Desconocido';
    };

    useEffect(() => {
        if (alumno) {
            setNombre(alumno.usr_nombre || '');
            setApellidoPaterno(alumno.usr_ap || '');
            setApellidoMaterno(alumno.usr_am || '');
            setCorreo(alumno.usr_correo || '');
            setPassword(alumno.usr_pass || '');
            setEstado(alumno.est_tipo || 1);
        }
    }, [alumno]);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const nombreTrim = nombre.trim();
            const apTrim = apellidoPaterno.trim();
            const amTrim = apellidoMaterno.trim();
            const correoTrim = correo.trim();
            const passwordTrim = password.trim();

            if (!nombreTrim || !apTrim || !amTrim || !correoTrim || !passwordTrim) {
                setError('Todos los campos son obligatorios.');
                setLoading(false);
                return;
            }

            if (!regexNombre.test(nombreTrim)) {
                setError('El nombre solo puede contener letras y espacios.');
                setLoading(false);
                return;
            }

            if (!regexNombre.test(apTrim)) {
                setError('El apellido paterno solo puede contener letras y espacios.');
                setLoading(false);
                return;
            }

            if (!regexNombre.test(amTrim)) {
                setError('El apellido materno solo puede contener letras y espacios.');
                setLoading(false);
                return;
            }

            if (!regexEmail.test(correoTrim)) {
                setError('El correo no es válido.');
                setLoading(false);
                return;
            }

            if (!regexPasswordLength.test(passwordTrim)) {
                setError('La contraseña debe tener entre 8 y 25 caracteres.');
                setLoading(false);
                return;
            }

            if (!regexPasswordHasLetter.test(passwordTrim)) {
                setError('La contraseña debe contener al menos una letra.');
                setLoading(false);
                return;
            }

            if (!regexPasswordHasNumber.test(passwordTrim)) {
                setError('La contraseña debe contener al menos un número.');
                setLoading(false);
                return;
            }

            const correoLower = correoTrim.toLowerCase();

            // Verificar si el correo ya existe en otro usuario
            if (correoLower !== alumno.usr_correo.toLowerCase()) {
                const { data: existingEmail, error: emailError } = await supabase
                    .schema('RCU')
                    .from('usuarios')
                    .select('id')
                    .ilike('usr_correo', correoLower)
                    .neq('id', alumno.id)
                    .maybeSingle();

                if (emailError) {
                    setError(emailError.message || 'Error al verificar el correo.');
                    setLoading(false);
                    return;
                }

                if (existingEmail) {
                    setError('El correo ya está registrado por otro usuario.');
                    setLoading(false);
                    return;
                }
            }

            // Actualizar el alumno
            const updateData = {
                usr_nombre: nombreTrim,
                usr_ap: apTrim,
                usr_am: amTrim,
                usr_correo: correoLower,
                usr_pass: passwordTrim,
                est_tipo: estado
            };

            const { error: updateError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .update(updateData)
                .eq('id', alumno.id);

            if (updateError) {
                setError(updateError.message || 'No se pudo actualizar el alumno.');
                setLoading(false);
                return;
            }

            setError('');
            setLoading(false);
            setConfirm('Alumno actualizado exitosamente');
        } catch (err) {
            setError('Error al actualizar el alumno.');
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
                        <Text style={styles.welcomeText}>Actualizar alumno</Text>
                        <View style={styles.formCard2}>
                            <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                                <Text style={styles.label2}>Boleta del alumno</Text>
                                <Text style={styles.input2}>{alumno.id}</Text>

                                <Text style={styles.label2}>Nombre(s) del alumno</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Nombre(s)"
                                    placeholderTextColor="#999"
                                    value={nombre}
                                    onChangeText={setNombre}
                                />

                                <Text style={styles.label2}>Apellido paterno</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Apellido paterno"
                                    placeholderTextColor="#999"
                                    value={apellidoPaterno}
                                    onChangeText={setApellidoPaterno}
                                />

                                <Text style={styles.label2}>Apellido materno</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Apellido materno"
                                    placeholderTextColor="#999"
                                    value={apellidoMaterno}
                                    onChangeText={setApellidoMaterno}
                                />

                                <Text style={styles.label2}>Correo del alumno</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="ejemplo@dominio.com"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    value={correo}
                                    onChangeText={setCorreo}
                                />

                                <Text style={styles.label2}>Contraseña del alumno</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="8-25 caracteres"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <Text style={styles.label2}>Estado del alumno</Text>
                                <TouchableOpacity
                                    style={styles.input2}
                                    onPress={() => setShowEstadoList((v) => !v)}
                                >
                                    <Text>{getEstadoNombre(estado)}</Text>
                                </TouchableOpacity>
                                {showEstadoList && (
                                    <View style={{ marginTop: 8, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' }}>
                                        {estadosDisponibles.map((est) => (
                                            <TouchableOpacity
                                                key={est.id}
                                                style={{ padding: 10 }}
                                                onPress={() => {
                                                    setEstado(est.id);
                                                    setShowEstadoList(false);
                                                }}
                                            >
                                                <Text>{est.nombre}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Actualizar alumno</Text>
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
