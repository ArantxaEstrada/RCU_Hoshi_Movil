import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function CTecnico({ navigation, route }) {
    const { data } = route?.params || {};
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [idTecnico, setIdTecnico] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    const regexId = /^[0-9]{10}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPasswordLength = /^.{8,25}$/;
    const regexPasswordHasLetter = /[A-Za-z]/;
    const regexPasswordHasNumber = /[0-9]/;

    const handleCreate = async () => {
        try {
            setLoading(true);
            const nombreTrim = nombre.trim();
            const apTrim = apellidoPaterno.trim();
            const amTrim = apellidoMaterno.trim();
            const idTrim = idTecnico.trim();
            const correoTrim = correo.trim();
            const passwordTrim = password.trim();

            if (!nombreTrim || !apTrim || !amTrim || !idTrim || !correoTrim || !passwordTrim) {
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

            if (!regexId.test(idTrim)) {
                setError('El ID debe contener exactamente 10 dígitos.');
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

            const parseId = parseInt(idTrim);
            const correoLower = correoTrim.toLowerCase();

            // Verificar si el ID ya existe
            const { data: existingUser, error: checkError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .select('id')
                .eq('id', parseId)
                .maybeSingle();

            if (checkError) {
                setError(checkError.message || 'Error al verificar el ID.');
                setLoading(false);
                return;
            }

            if (existingUser) {
                setError('El ID ya está registrado.');
                setLoading(false);
                return;
            }

            // Verificar si el correo ya existe
            const { data: existingEmail, error: emailError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .select('id')
                .ilike('usr_correo', correoLower)
                .maybeSingle();

            if (emailError) {
                setError(emailError.message || 'Error al verificar el correo.');
                setLoading(false);
                return;
            }

            if (existingEmail) {
                setError('El correo ya está registrado.');
                setLoading(false);
                return;
            }

            // Insertar el nuevo técnico
            const insertData = {
                id: parseId,
                usr_nombre: nombreTrim,
                usr_ap: apTrim,
                usr_am: amTrim,
                usr_correo: correoLower,
                usr_pass: passwordTrim,
                perf_tipo: 2,
                est_tipo: 1
            };

            const { error: insertError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .insert(insertData);

            if (insertError) {
                setError(insertError.message || 'No se pudo crear el técnico.');
                setLoading(false);
                return;
            }

            setError('');
            setLoading(false);
            setConfirm('Técnico creado exitosamente');
        } catch (err) {
            setError('Error al crear el técnico.');
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
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('tecnicos', { data })}>
                                <Text style={styles.buttonText}>Volver a Técnicos</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                );
            }
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Técnicos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Agregar técnico</Text>
                        <View style={styles.formCard2}>
                            <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                                <Text style={styles.label2}>Nombre(s) del técnico</Text>
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

                                <Text style={styles.label2}>ID del técnico</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Número de trabajador"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={idTecnico}
                                    onChangeText={setIdTecnico}
                                />

                                <Text style={styles.label2}>Correo del técnico</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="ejemplo@dominio.com"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    value={correo}
                                    onChangeText={setCorreo}
                                />

                                <Text style={styles.label2}>Contraseña del técnico</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="8-25 caracteres"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </ScrollView>

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleCreate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Agregar técnico</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('tecnicos', { data })}>
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
