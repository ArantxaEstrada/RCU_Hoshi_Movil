import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function RTecnico({ navigation, route }) {
    const { data } = route?.params || {};
    const [idTecnico, setIdTecnico] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const regexId = /^[0-9]{1,20}$/;

    const buscarTecnico = async () => {
        try {
            setLoading(true);
            const idTrim = idTecnico.trim();

            if (!idTrim) {
                setError('Ingresa el ID del técnico.');
                setLoading(false);
                return;
            }

            if (!regexId.test(idTrim)) {
                setError('El ID solo puede contener números.');
                setLoading(false);
                return;
            }

            const parseId = parseInt(idTrim);

            const { data: tecnicoData, error: searchError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .select('*')
                .eq('id', parseId)
                .eq('perf_tipo', 2)
                .maybeSingle();

            if (searchError) {
                setError(searchError.message || 'Error al buscar el técnico.');
                setLoading(false);
                return;
            }

            if (!tecnicoData) {
                setError('No se encontró ningún técnico con ese ID.');
                setLoading(false);
                return;
            }

            setError('');
            setLoading(false);
            navigation.navigate('tecnicox', { tecnico: tecnicoData, data });
        } catch (err) {
            setError('Error al buscar el técnico.');
            setLoading(false);
        }
    };

    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Técnicos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Buscar técnico</Text>
                        <View style={styles.formCard2}>
                            <Text style={styles.label2}>ID del técnico</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Número de trabajador"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={idTecnico}
                                onChangeText={setIdTecnico}
                            />

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={buscarTecnico}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Buscar técnico</Text>
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
