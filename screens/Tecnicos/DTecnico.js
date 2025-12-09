import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function DTecnico({ navigation, route }) {
    const { data, tecnico } = route?.params || {};
    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');

    const regexId = /^[0-9]{1,20}$/;

    const handleDelete = async () => {
        try {
            setLoading(true);
            const idTrim = identificador.trim();
            const passTrim = password.trim();

            if (!idTrim || !passTrim) {
                setError('Todos los campos son obligatorios.');
                setLoading(false);
                return;
            }

            if (!regexId.test(idTrim)) {
                setError('El identificador solo puede contener números.');
                setLoading(false);
                return;
            }

            const parseId = parseInt(idTrim);

            // Verificar credenciales del admin
            const { data: adminData, error: adminError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .select('*')
                .eq('id', parseId)
                .eq('usr_pass', passTrim)
                .eq('perf_tipo', 1)
                .maybeSingle();

            if (adminError) {
                setError(adminError.message || 'Error al verificar las credenciales.');
                setLoading(false);
                return;
            }

            if (!adminData) {
                setError('Credenciales de administrador incorrectas.');
                setLoading(false);
                return;
            }

            if (adminData.est_tipo === 2) {
                setError('El administrador no está activo.');
                setLoading(false);
                return;
            }

            // Cambiar estado del técnico a Baja
            const { error: updateError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .update({ est_tipo: 2 })
                .eq('id', tecnico.id);

            if (updateError) {
                setError(updateError.message || 'No se pudo eliminar el técnico.');
                setLoading(false);
                return;
            }

            setError('');
            setLoading(false);
            setConfirm('Técnico eliminado exitosamente');
        } catch (err) {
            setError('Error al eliminar el técnico.');
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
            if (tecnico) {
                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={styles.superiorPanel}>
                            <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                            <Text style={styles.superiorTitle}>Técnicos</Text>
                            <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                        </View>
                        <View style={styles.loggedInContainer2}>
                            <Text style={styles.welcomeText}>Eliminar técnico</Text>

                            <View style={styles.formCard2}>
                                <Text style={styles.label2}>Técnico a eliminar:</Text>
                                <Text style={styles.infoText}>{tecnico.usr_nombre} {tecnico.usr_ap} {tecnico.usr_am}</Text>
                                <Text style={styles.infoText}>ID: {tecnico.id}</Text>

                                <Text style={styles.label2}>Identificador del administrador</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="ID del administrador"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={identificador}
                                    onChangeText={setIdentificador}
                                />

                                <Text style={styles.label2}>Contraseña del administrador</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Contraseña"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                {error ? <Text style={styles.error}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Eliminar técnico</Text>
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
                navigation.replace('tecnicos', { data });
            }
        } else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('eaccess');
    }
}
