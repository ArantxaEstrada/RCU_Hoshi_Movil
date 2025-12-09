import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function RDispositivo({ navigation, route }) {
    const { data } = route?.params || {};
    const [serialDispositivo, setSerialDispositivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const regexNumerico = /^[0-9]{1,20}$/;

    const buscarDispositivo = async () => {
        const serialTrim = serialDispositivo.trim();

        if (!serialTrim) {
            setError('Ingresa el serial del dispositivo.');
            return;
        }

        if (!regexNumerico.test(serialTrim)) {
            setError('El serial solo puede contener números.');
            return;
        }

        try {
            setLoading(true);
            const { data: dispositivo, error: err } = await supabase
                .schema('RCU')
                .from('dispositivo')
                .select('*')
                .eq('disp_serial', parseInt(serialTrim))
                .maybeSingle();

            if (err) {
                setError('Error al buscar dispositivo.');
                setLoading(false);
                return;
            }

            if (!dispositivo) {
                setError('No se encontró el dispositivo.');
                setLoading(false);
                return;
            }

            navigation.navigate('dispositivox', { dispositivo, data });
            setLoading(false);
        } catch (err) {
            setError('Error al buscar dispositivo.');
            setLoading(false);
        }
    };

    if (data && data.est_tipo !== 2 && data.perf_tipo <= 2) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.superiorPanel}>
                    <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                    <Text style={styles.superiorTitle}>Buscar dispositivo</Text>
                    <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                </View>
                <View style={styles.loggedInContainer2}>
                    <Text style={styles.welcomeText}>Ingresa el serial</Text>
                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Serial del dispositivo</Text>
                        <TextInput
                            style={styles.input2}
                            placeholder="Ej: 12345"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={serialDispositivo}
                            onChangeText={setSerialDispositivo}
                        />

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={buscarDispositivo}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Buscar</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('dispositivos', { data })}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    } else {
        navigation.replace('daccess', { data });
    }
}
