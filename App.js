import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export default function App() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [reportesbool, setReportesbool] = useState(false);
    const [completadosbool, setCompletadosbool] = useState(false);

    const IniciarSesion = () => {
        setError('');
        if (!nombre.trim() || !correo.trim() || !contrasena) {
            setError('Completa todos los campos.');
            return;
        }
        if (nombre === 'admin' && correo === 'admin@ipn.mx' && contrasena === '1234') {
            setLoggedIn(true);
        } else {
            setError('Usuario, correo o contraseña incorrectos.');
        }
    };

    const CerrarSesion = () => {
        setNombre('');
        setCorreo('');
        setContrasena('');
        setLoggedIn(false);
        setReportesbool(false);
        setCompletadosbool(false);
    };

    const VerReportes = () => setReportesbool(true);
    const VerCompletados = () => setCompletadosbool(true);

    return (
        <SafeAreaView style={styles1.safe}>
            <StatusBar style="light" />
            {!loggedIn ? (
                <>
                    <Image source={require('./img/ipn-logo.png')} style={[styles1.cornerImage, styles1.topLeft]} />
                    <Image source={require('./img/rcu-logo.png')} style={[styles1.cornerImage, styles1.topRight]} />

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles1.container}>
                        <View style={styles1.card}>
                            <Text style={styles1.title}>Iniciar sesión</Text>

                            <Text style={styles1.label}>Nombre</Text>
                            <TextInput
                                style={styles1.input}
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Ingrese su nombre"
                                placeholderTextColor="#999"
                                autoCapitalize="words"
                            />

                            <Text style={styles1.label}>Correo</Text>
                            <TextInput
                                style={styles1.input}
                                value={correo}
                                onChangeText={setCorreo}
                                placeholder="ejemplo@dominio.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Text style={styles1.label}>Contraseña</Text>
                            <TextInput
                                style={styles1.input}
                                value={contrasena}
                                onChangeText={setContrasena}
                                placeholder="Ingrese su contraseña"
                                placeholderTextColor="#999"
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            {error ? <Text style={styles1.error}>{error}</Text> : null}

                            <TouchableOpacity style={styles1.button} onPress={IniciarSesion}>
                                <Text style={styles1.buttonText}>Iniciar sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </>
            ) : !reportesbool && !completadosbool ? (
                <View style={styles2.loggedInContainer}>
                    <View style={styles2.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles1.cornerImage, styles1.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles1.cornerImage, styles1.topRight]} />
                    </View>

                    <Text style={styles2.welcomeText}>Bienvenido/a, {nombre}</Text>

                    <TouchableOpacity style={styles2.optionButton} onPress={VerReportes}>
                        <Image source={require('./img/report.png')} />
                        <Text style={styles2.optionText}>Ver reportes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles2.optionButton} onPress={VerCompletados}>
                        <Image source={require('./img/complete.png')} />
                        <Text style={styles2.optionText}>Reportes completados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles2.button} onPress={CerrarSesion}>
                        <Text style={styles1.buttonText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles2.loggedInContainer}>
                    <View style={styles2.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles1.cornerImage, styles1.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles1.cornerImage, styles1.topRight]} />
                    </View>
                    <Text style={styles2.welcomeText}>
                        {reportesbool ? 'Panel de reportes' : 'Reportes completados'}
                    </Text>

                    <TouchableOpacity style={styles2.button} onPress={() => {setReportesbool(false); setCompletadosbool(false);}}>
                        <Text style={styles1.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles1 = StyleSheet.create({
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
        marginTop: 25,
        width: 90,
        height: 90,
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

const styles2 = StyleSheet.create({
    loggedInContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    superiorPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#5A1236',
        zIndex: 10,
    },
    button: {
        marginTop: 14,
        backgroundColor: '#5A1236',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 30,
        fontWeight: '600',
        marginBottom: 20,
        color: '#111',
    },
    optionButton: {
        backgroundColor: '#D9D9D9',
        paddingVertical: 10,
        width: '75%',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 8,
    },
    optionText: {
        color: '#000000',
        fontSize: 22,
        fontWeight: '700',
    },
});
