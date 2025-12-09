import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function InformeDispositivo({ navigation, route }) {
    const { data } = route?.params || {};
    const [filtroSalon, setFiltroSalon] = useState('');
    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [salones, setSalones] = useState([]);
    const [mostrarSalones, setMostrarSalones] = useState(false);

    const regexId = /^[0-9]{1,20}$/;

    // Función para formatear nombre de salón
    const formatearNombreSalon = (nombre) => {
        if (!nombre) return nombre;
        if (/^\d+$/.test(nombre.trim())) {
            return `Salón ${nombre}`;
        }
        return nombre;
    };

    useEffect(() => {
        cargarSalones();
    }, []);

    const cargarSalones = async () => {
        try {
            const { data: salonesData } = await supabase
                .schema('RCU')
                .from('salon')
                .select('*')
                .order('sal_nombre', { ascending: true });

            setSalones(salonesData || []);
        } catch (err) {
            setError('Error al cargar salones.');
        }
    };

    const cargarDispositivos = async () => {
        try {
            setLoading(true);
            setError('');

            let query = supabase
                .schema('RCU')
                .from('dispositivo')
                .select('*');

            if (filtroSalon) {
                query = query.eq('sal_id', parseInt(filtroSalon));
            }

            const { data: dispositivosData, error: err } = await query
                .order('id', { ascending: true });

            if (err) {
                setError('Error al cargar dispositivos.');
                setLoading(false);
                return;
            }

            setDispositivos(dispositivosData || []);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar dispositivos.');
            setLoading(false);
        }
    };

    const handleFiltro = () => {
        if (filtroSalon) {
            cargarDispositivos();
        } else {
            setError('Selecciona un salón.');
        }
    };

    const getTipoNombre = async (tipoId) => {
        try {
            const { data: tipo } = await supabase
                .schema('RCU')
                .from('inventario')
                .select('inv_nombre')
                .eq('id', tipoId)
                .maybeSingle();

            return tipo?.inv_nombre || 'Desconocido';
        } catch {
            return 'Desconocido';
        }
    };

    if (data && data.est_tipo !== 2 && data.perf_tipo <= 2) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.superiorPanel}>
                    <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                    <Text style={styles.superiorTitle}>Informe de dispositivos</Text>
                    <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                </View>
                <View style={styles.loggedInContainer2}>
                    <Text style={styles.welcomeText}>Filtrar por salón</Text>
                    <View style={styles.formCard2}>
                        <Text style={styles.label2}>Salón</Text>
                        <TouchableOpacity
                            style={styles.input2}
                            onPress={() => setMostrarSalones(!mostrarSalones)}
                        >
                            <Text style={{ color: filtroSalon ? '#000' : '#999' }}>
                                {filtroSalon
                                    ? formatearNombreSalon(salones.find(s => s.id === parseInt(filtroSalon))?.sal_nombre)
                                    : 'Selecciona un salón'}
                            </Text>
                        </TouchableOpacity>

                        {mostrarSalones && (
                            <View style={styles.dropdownList}>
                                {salones.map(salon => (
                                    <TouchableOpacity
                                        key={salon.id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFiltroSalon(salon.id.toString());
                                            setMostrarSalones(false);
                                        }}
                                    >
                                        <Text>{formatearNombreSalon(salon.sal_nombre)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {error && filtroSalon ? <Text style={styles.error}>{error}</Text> : null}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleFiltro}
                            disabled={loading || !filtroSalon}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Cargar informe</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {dispositivos.length > 0 && (
                        <ScrollView style={{ maxHeight: 400, marginTop: 20 }} showsVerticalScrollIndicator={false}>
                            <View style={styles.informeCard}>
                                <Text style={styles.welcomeText}>Dispositivos en {formatearNombreSalon(salones.find(s => s.id === parseInt(filtroSalon))?.sal_nombre)}</Text>

                                <View style={{ marginBottom: 15 }}>
                                    <Text style={styles.label2}>Activos: </Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>
                                        {dispositivos.filter(d => d.disp_estado_actv).length}
                                    </Text>
                                </View>

                                <View style={{ marginBottom: 15 }}>
                                    <Text style={styles.label2}>Inactivos: </Text>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f44336' }}>
                                        {dispositivos.filter(d => !d.disp_estado_actv).length}
                                    </Text>
                                </View>

                                <Text style={[styles.welcomeText, { marginTop: 20 }]}>Listado de dispositivos</Text>
                                {dispositivos.map((dispositivo, index) => (
                                    <View key={index} style={styles.informeReporteCard}>
                                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                            ID #{dispositivo.id} - {dispositivo.disp_estado_actv ? '✓ Activo' : '✗ Inactivo'}
                                        </Text>
                                        <Text style={styles.label2}>Serial:</Text>
                                        <Text style={styles.input2}>{dispositivo.disp_serial}</Text>

                                        <Text style={styles.label2}>Etiqueta:</Text>
                                        <Text style={styles.input2}>{dispositivo.disp_etiqueta}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}

                    {dispositivos.length === 0 && filtroSalon && !loading && (
                        <Text style={styles.informeEmptyText}>
                            No hay dispositivos en este salón.
                        </Text>
                    )}

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
