import { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function Login({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
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

    const IniciarSesion = () => {
        setError('');
        if (!nombre.trim() || !correo.trim() || !contrasena) {
            setError('Completa todos los campos.');
            return;
        }

        if (nombre === 'admin' && correo === 'admin@ipn.mx' && contrasena === '1234') {
            navigation.replace('menu', { nombre });
        } else {
            setError('Usuario, correo o contraseña incorrectos.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            {!keyboardVisible && (
                <Image source={require('../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
            )}
            {!keyboardVisible && (
                <Image source={require('../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={80}  // <- Ajusta este número
                style={styles.container}
            >


                <View style={styles.card}>
                    <Text style={styles.title}>Iniciar sesión</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ingrese su nombre"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Correo</Text>
                    <TextInput
                        style={styles.input}
                        value={correo}
                        onChangeText={setCorreo}
                        placeholder="ejemplo@dominio.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={contrasena}
                        onChangeText={setContrasena}
                        placeholder="Ingrese su contraseña"
                        placeholderTextColor="#999"
                        secureTextEntry
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={IniciarSesion}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
