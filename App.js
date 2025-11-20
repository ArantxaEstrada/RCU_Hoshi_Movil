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
    FlatList,
} from 'react-native';

export default function App() {
    //Pantallas
    const [pantalla, setPantalla] = useState('login');
    //Login
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    //Alumnos
    const [boleta, setBoleta] = useState('');
    const [alNombre, setAlNombre] = useState('');
    const [alCorreo, setAlCorreo] = useState('');
    const [alContrasena, setAlContrasena] = useState('');
    const [alReportes, setAlReportes] = useState([]);

    const IniciarSesion = () => {
        setError('');
        if (!nombre.trim() || !correo.trim() || !contrasena) {
            setError('Completa todos los campos.');
            return;
        }
        if (nombre === 'admin' && correo === 'admin@ipn.mx' && contrasena === '1234') {
            setPantalla('menu');
            setError('');
        } else {
            setError('Usuario, correo o contraseña incorrectos.');
        }
    };

    const CerrarSesion = () => {
        setNombre('');
        setCorreo('');
        setContrasena('');
        setPantalla('login');
    };

    const volverMenuP = () => {
        setPantalla('menu');
        setError('');
    }

    const volverMenuR = () => {
        setPantalla('reportes');
        setError('');
    }

    const volverMenuA = () => {
        setPantalla('alumnos');
        setError('');
        setBoleta('');
        setAlNombre('');
        setAlCorreo('');
        setAlReportes([]);
    }

    const volverMenuT = () => {
        setPantalla('tecnicos');
        setError('');
    }

    const buscarAlumno = () => {
        if (!boleta.trim()) {
            setError('Ingresa la boleta del alumno.');
            return;
        } else if (boleta === '2024090213') {
            setBoleta('2024090213');
            setAlNombre('Estrada Sevillano, Rodrigo');
            setAlCorreo('restradas2301@alumno.ipn.mx');
            const alReportesTemp = [
                { id: 1, descripcion: 'Falla en la computadora', estatus: 'Pendiente' },
                { id: 2, descripcion: 'Problema con el software', estatus: 'Completado' },
                { id: 3, descripcion: 'Mantenimiento de red', estatus: 'Pendiente' },
                { id: 4, descripcion: 'Actualización de sistema', estatus: 'Completado' },
                { id: 5, descripcion: 'Revisión de hardware', estatus: 'Pendiente' },
                { id: 6, descripcion: 'Instalación de programas', estatus: 'Completado' },
                { id: 7, descripcion: 'Configuración de dispositivos', estatus: 'Pendiente' },
                { id: 8, descripcion: 'Soporte técnico remoto', estatus: 'Completado' },
            ];
            setAlReportes(alReportesTemp);
            setPantalla('AlumnoX');
            setError('');
        } else {
            setError('Alumno no encontrado.');
        }
    }
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="light" />
            {pantalla === 'login' && (
                <>
                    <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                    <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Iniciar sesión</Text>

                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Ingrese su nombre"
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
                                placeholder="Ingrese su contraseña"
                                placeholderTextColor="#999"
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity style={styles.button} onPress={IniciarSesion}>
                                <Text style={styles.buttonText}>Iniciar sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </>
            )}
            {pantalla === 'menu' && (
                <>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Menú</Text>
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer}>
                        <Text style={styles.welcomeText}>Bienvenido/a, {nombre}</Text>

                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('reportes')}>
                            <Image source={require('./img/report.png')} />
                            <Text style={styles.optionText}>Reportes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('alumnos')}>
                            <Image source={require('./img/alumnos.png')} />
                            <Text style={styles.optionText}>Alumnos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('tecnicos')}>
                            <Image source={require('./img/personal.png')} />
                            <Text style={styles.optionText}>Técnicos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button2} onPress={CerrarSesion}>
                            <Text style={styles.buttonText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {/*-------------------------- Pantallas de reportes --------------------------*/}
            {pantalla === 'reportes' && (
                <>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Reportes</Text>
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('pendientes')}>
                            <Image source={require('./img/pending.png')} />
                            <Text style={styles.optionText}>Reportes pendientes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('completados')}>
                            <Image source={require('./img/completed.png')} />
                            <Text style={styles.optionText}>Reportes completados</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button2} onPress={volverMenuP}>
                            <Text style={styles.buttonText}>Volver al menú</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {pantalla === 'pendientes' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Reportes pendientes</Text>
                    <View style={styles.tableContainer}>
                        {/* Encabezado */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableText, styles.headerText]}>Reporte</Text>
                            <Text style={[styles.tableText, styles.headerText]}>Fecha</Text>
                            <Text style={[styles.tableText, styles.headerText]}>Estatus</Text>
                        </View>

                        {/* Filas */}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableText}>Reporte 1</Text>
                            <Text style={styles.tableText}>12/10/2025</Text>
                            <View style={styles.statusCell}>
                                <View style={[styles.statusDot, { backgroundColor: 'yellow' }]} />
                            </View>
                        </View>

                        <View style={[styles.tableRow, styles.tableAlt]}>
                            <Text style={styles.tableText}>Reporte 2</Text>
                            <Text style={styles.tableText}>08/10/2025</Text>
                            <View style={styles.statusCell}>
                                <View style={[styles.statusDot, { backgroundColor: 'yellow' }]} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={volverMenuR}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'completados' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Reportes completados</Text>

                    <View style={styles.tableContainer}>
                        {/* Encabezado */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableText, styles.headerText]}>Reporte</Text>
                            <Text style={[styles.tableText, styles.headerText]}>Fecha</Text>
                            <Text style={[styles.tableText, styles.headerText]}>Estatus</Text>
                        </View>

                        {/* Filas */}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableText}>Reporte 3</Text>
                            <Text style={styles.tableText}>05/10/2025</Text>
                            <View style={styles.statusCell}>
                                <View style={[styles.statusDot, { backgroundColor: 'limegreen' }]} />
                            </View>
                        </View>

                        <View style={[styles.tableRow, styles.tableAlt]}>
                            <Text style={styles.tableText}>Reporte 4</Text>
                            <Text style={styles.tableText}>01/10/2025</Text>
                            <View style={styles.statusCell}>
                                <View style={[styles.statusDot, { backgroundColor: 'limegreen' }]} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={volverMenuR}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/*-------------------------- Pantallas de alumnos --------------------------*/}
            {pantalla === 'alumnos' && (
                <>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Alumnos</Text>
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('CAlumno')}>
                            <Image source={require('./img/create.png')} />
                            <Text style={styles.optionText}>Agregar alumno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('RAlumno')}>
                            <Image source={require('./img/read.png')} />
                            <Text style={styles.optionText}>Buscar alumno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('UAlumno')}>
                            <Image source={require('./img/update.png')} />
                            <Text style={styles.optionText}>Editar alumno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('DAlumno')}>
                            <Image source={require('./img/delete.png')} />
                            <Text style={styles.optionText}>Eliminar alumno</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button2} onPress={volverMenuP}>
                            <Text style={styles.buttonText}>Volver al menú</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {pantalla === 'CAlumno' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

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

                    <TouchableOpacity style={styles.button2} onPress={volverMenuA}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'RAlumno' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Buscar alumno</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Boleta del alumno</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" value={boleta} onChangeText={setBoleta} />

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <TouchableOpacity style={styles.button} onPress={() => buscarAlumno()}>
                            <Text style={styles.buttonText}>Buscar alumno</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={volverMenuA}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'AlumnoX' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <Text style={styles.welcomeText}></Text>
                    <Text style={styles.welcomeText}>Detalles del alumno</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Nombre del alumno</Text>
                        <TextInput style={styles.input2} value={alNombre} editable={false} />

                        <Text style={styles.label2}>Boleta del alumno</Text>
                        <TextInput style={styles.input2} value={boleta} editable={false} />

                        <Text style={styles.label2}>Correo del alumno</Text>
                        <TextInput style={styles.input2} value={alCorreo} editable={false} />

                        <Text style={[styles.label2, { marginTop: 15 }]}>Reportes asociados</Text>
                        <View style={styles.tableContainer}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableText, styles.headerText]}>ID</Text>
                                <Text style={[styles.tableText, styles.headerText]}>Descripción</Text>
                                <Text style={[styles.tableText, styles.headerText]}>Estatus</Text>
                            </View>

                            <FlatList data={alReportes} keyExtractor={(item) => item.id.toString()} renderItem={({ item, index }) => (
                                <View style={[
                                    styles.tableRow,
                                    index % 2 === 1 ? styles.tableAlt : null,
                                ]}>
                                    <Text style={styles.tableText}>{item.id}</Text>
                                    <Text style={styles.tableText}>{item.descripcion}</Text>
                                    <Text style={styles.tableText}>{item.estatus}</Text>
                                </View>
                            )}
                                style={{ maxHeight: 115 }} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={volverMenuA}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'UAlumno' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Editar alumno</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Boleta del alumno</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Buscar alumno</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={volverMenuA}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'DAlumno' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Eliminar alumno</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Boleta del alumno</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Eliminar alumno</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={volverMenuA}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/*-------------------------- Pantallas de técnicos --------------------------*/}
            {pantalla === 'tecnicos' && (
                <>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Técnicos</Text>
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('CTecnico')}>
                            <Image source={require('./img/create.png')} />
                            <Text style={styles.optionText}>Agregar técnico</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton}>
                            <Image source={require('./img/information.png')} />
                            <Text style={styles.optionText}>Informe del técnico</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('UTecnico')}>
                            <Image source={require('./img/update.png')} />
                            <Text style={styles.optionText}>Editar técnico</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setPantalla('DTecnico')}>
                            <Image source={require('./img/delete.png')} />
                            <Text style={styles.optionText}>Eliminar técnico</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button2} onPress={volverMenuP}>
                            <Text style={styles.buttonText}>Volver al menú</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {pantalla === 'CTecnico' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Agregar técnico</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Nombre del técnico</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" />

                        <Text style={styles.label2}>ID del técnico</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                        <Text style={styles.label2}>Correo del técnico</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="email-address" />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Agregar técnico</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={volverMenuT}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'UTecnico' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Editar técnico</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>ID del técnico</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Buscar técnico</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={() => setPantalla('tecnicos')}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pantalla === 'DTecnico' && (
                <View style={styles.loggedInContainer2}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('./img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Image source={require('./img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <Text style={styles.welcomeText}>Eliminar técnico</Text>

                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>ID del técnico</Text>
                        <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Eliminar técnico</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={() => setPantalla('tecnicos')}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    button2: {
        position: 'absolute',
        bottom: 75,
        marginTop: 14,
        backgroundColor: '#5A1236',
        paddingVertical: 10,
        paddingHorizontal: 20,
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
    loggedInContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 25,
        backgroundColor: '#ffffff',
    },
    loggedInContainer2: {
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
    welcomeText: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 20,
        color: '#111',
        marginTop: 40,
    },
    optionButton: {
        backgroundColor: '#D9D9D9',
        paddingVertical: 10,
        width: '60%',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 8,
    },
    optionText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '700',
    },
    tableContainer: {
        width: '90%',
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#d9d9d9',
    },
    tableAlt: {
        backgroundColor: '#bfbfbf',
    },
    tableHeader: {
        backgroundColor: '#5A1236',
    },
    tableText: {
        color: 'black',
        flex: 1,
        textAlign: 'center',
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statusCell: {
        flex: 1,
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    formCard2: {
        width: '90%',
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginBottom: 20,
    },

    label2: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 6,
        marginTop: 10,
    },

    input2: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        marginBottom: 15,
    },
    superiorTitle: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
});
