import { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { supabase } from '../lib/supabase';

export default function Login({ navigation }) {
    //Log In
    const [identifier, setIdentifier] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^[A-Za-z0-9!"#$%&/()=?¡¿*+{}[\]\-_,.]{8,25}$/;
    const regexId = /^[0-9]{1,20}$/;


    const checkSession = async () => {
        //Verificar campos
        if (!identifier.trim() || !mail.trim() || !password.trim()) {
            setError('Por favor, complete todos los campos');
            return;
        }
        if (!regexId.test(identifier.trim())) {
            setError('Identificador inválido');
            return;
        }
        if (!regexEmail.test(mail.trim())) {
            setError('Correo inválido');
            return;
        }
        if (!regexPassword.test(password.trim())) {
            setError('Contraseña inválida');
            return;
        }
        //Obtener datos
        const parseIdentifier = parseInt(identifier.trim());
        const emailLower = mail.trim().toLowerCase();
        const { data, error } = await supabase.schema('RCU').from('usuarios').select('*').eq('id', parseIdentifier).maybeSingle();
        if (!data) {
            setError('Usuario no encontrado');
            return;
        }
        if (error) {
            setError(error.message);
            return;
        }
        //Verificar datos
        if (data.usr_pass !== password.trim() || (data.usr_correo).toLowerCase() !== emailLower) {
            setError('Datos incorrectos');
            return;
        }
        else if (data.est_tipo != 2) {
            navigation.replace('menu', { data })
        }
        else {
            setError('Acceso denegado: Cuenta suspendida');
            return
        }
    };

    //Teclado
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            {!keyboardVisible && (
                <Image source={require('../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
            )}
            {!keyboardVisible && (
                <Image source={require('../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            )}

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80} style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Iniciar sesión</Text>

                    <Text style={styles.label}>Identificador</Text>
                    <TextInput
                        style={styles.input}
                        value={identifier}
                        onChangeText={setIdentifier}
                        placeholder="Ingrese su boleta o número de trabajador"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Correo</Text>
                    <TextInput
                        style={styles.input}
                        value={mail}
                        onChangeText={setMail}
                        placeholder="ejemplo@dominio.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Ingrese su contraseña"
                        placeholderTextColor="#999"
                        secureTextEntry
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={checkSession}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
