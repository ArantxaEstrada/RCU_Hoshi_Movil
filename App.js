import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export default function App() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        setError('');
        if (!nombre.trim() || !correo.trim() || !contrasena) {
            setError('Completa todos los campos.');
            return;
        }
        if (contrasena === '1234') {
            Alert.alert('Éxito', `Bienvenido/a, ${nombre}`);
            // Aquí podrías navegar a otra pantalla o limpiar campos
        } else {
            setError('Contraseña incorrecta.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="light" />
            {/* Esquinas superiores con imágenes */}
            <Image
                source={{ uri: 'https://via.placeholder.com/80/ffffff/000000?text=L' }}
                style={[styles.cornerImage, styles.topLeft]}
                accessibilityLabel="Logo izquierdo"
            />
            <Image
                source={{ uri: 'https://via.placeholder.com/80/ffffff/000000?text=R' }}
                style={[styles.cornerImage, styles.topRight]}
                accessibilityLabel="Logo derecho"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Iniciar sesión</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Tu nombre"
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Correo</Text>
                    <TextInput
                        style={styles.input}
                        value={correo}
                        onChangeText={setCorreo}
                        placeholder="ejemplo@dominio.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={contrasena}
                        onChangeText={setContrasena}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#5A1236',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    cornerImage: {
        position: 'absolute',
        width: 72,
        height: 72,
        borderRadius: 12,
        top: 18,
        zIndex: 10,
    },
    topLeft: {
        left: 18,
    },
    topRight: {
        right: 18,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#111',
    },
    label: {
        fontSize: 13,
        color: '#555',
        marginTop: 8,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontSize: 15,
        color: '#111',
    },
    button: {
        marginTop: 14,
        backgroundColor: '#5A1236',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: '#b91c1c',
        marginTop: 8,
    },
});
