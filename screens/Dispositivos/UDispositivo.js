import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function UDispositivo({ navigation, route }) {
    const { dispositivo, data } = route?.params || {};
    const [serial, setSerial] = useState('');
    const [codigo, setCodigo] = useState('');
    const [etiqueta, setEtiqueta] = useState('');
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [salonSeleccionado, setSalonSeleccionado] = useState(null);
    const [estadoActivo, setEstadoActivo] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tipos, setTipos] = useState([]);
    const [salones, setSalones] = useState([]);
    const [mostrarTipos, setMostrarTipos] = useState(false);
    const [mostrarSalones, setMostrarSalones] = useState(false);

    const regexNumerico = /^[0-9]+$/;

    // Función para formatear nombre de salón
    const formatearNombreSalon = (nombre) => {
        if (!nombre) return nombre;
        if (/^\d+$/.test(nombre.trim())) {
            return `Salón ${nombre}`;
        }
        return nombre;
    };

    useEffect(() => {
        if (dispositivo) {
            setSerial(dispositivo.disp_serial.toString());
            setCodigo(dispositivo.disp_codigo.toString());
            setEtiqueta(dispositivo.disp_etiqueta);
            setTipoSeleccionado(dispositivo.tipo_id);
            setSalonSeleccionado(dispositivo.sal_id);
            setEstadoActivo(!!dispositivo.disp_estado_actv);
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data: tiposData } = await supabase
                .schema('RCU')
                .from('inventario')
                .select('*')
                .order('inv_nombre', { ascending: true });

            setTipos(tiposData || []);

            const { data: salonesData } = await supabase
                .schema('RCU')
                .from('salon')
                .select('*')
                .order('sal_nombre', { ascending: true });

            setSalones(salonesData || []);
        } catch (err) {
            setError('Error al cargar datos.');
        }
    };

    const handleUpdate = async () => {
        const serialTrim = serial.trim();
        const codigoTrim = codigo.trim();
        const etiquetaTrim = etiqueta.trim();

        console.log('UDispositivo handleUpdate start', {
            serialTrim,
            codigoTrim,
            etiquetaTrim,
            tipoSeleccionado,
            salonSeleccionado,
            estadoActivo,
            dispositivoId: dispositivo?.id,
        });

        if (!serialTrim || !codigoTrim || !etiquetaTrim || !tipoSeleccionado || !salonSeleccionado) {
            setError('Completa todos los campos.');
            return;
        }

        if (!regexNumerico.test(serialTrim)) {
            setError('El serial solo puede contener números.');
            return;
        }

        if (!regexNumerico.test(codigoTrim)) {
            setError('El código solo puede contener números.');
            return;
        }

        // Verificar duplicados (excluyendo el actual)
        const { data: existente } = await supabase
            .schema('RCU')
            .from('dispositivo')
            .select('id')
            .eq('disp_serial', parseInt(serialTrim))
            .neq('id', parseInt(dispositivo.id))
            .maybeSingle();

        if (existente) {
            console.log('UDispositivo duplicado serial', existente);
            setError('El serial ya está registrado.');
            return;
        }

        try {
            setLoading(true);
            console.log('UDispositivo updating dispositivo', dispositivo?.id);
            const { error: updateError } = await supabase
                .schema('RCU')
                .from('dispositivo')
                .update({
                    disp_serial: parseInt(serialTrim),
                    disp_codigo: parseInt(codigoTrim),
                    disp_etiqueta: etiquetaTrim,
                    tipo_id: tipoSeleccionado,
                    sal_id: salonSeleccionado,
                    disp_estado_actv: !!estadoActivo,
                })
                .eq('id', parseInt(dispositivo.id));

            if (updateError) {
                console.log('UDispositivo updateError', updateError);
                setError(updateError.message || 'Error al actualizar dispositivo.');
                setLoading(false);
                return;
            }

            // Obtener registro actualizado para reflejar estado real
            const { data: refreshed, error: fetchError } = await supabase
                .schema('RCU')
                .from('dispositivo')
                .select('*')
                .eq('id', parseInt(dispositivo.id))
                .maybeSingle();

            console.log('UDispositivo refreshed', { refreshed, fetchError });

            if (fetchError || !refreshed) {
                console.log('UDispositivo navigate fallback');
                navigation.navigate('dispositivox', { dispositivo: { ...dispositivo, disp_estado_actv: !!estadoActivo }, data });
            } else {
                console.log('UDispositivo navigate with refreshed');
                navigation.navigate('dispositivox', { dispositivo: refreshed, data });
            }
            setLoading(false);
        } catch (err) {
            setError('Error al actualizar dispositivo.');
            setLoading(false);
        }
    };

    if (dispositivo && data && data.est_tipo !== 2 && data.perf_tipo <= 2) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.superiorPanel}>
                    <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                    <Text style={styles.superiorTitle}>Editar dispositivo</Text>
                    <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                </View>
                <View style={styles.loggedInContainer2}>
                    <Text style={styles.welcomeText}>Actualizar dispositivo</Text>
                    <View style={styles.formCard2}>
                        <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label2}>Serial del dispositivo</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Ej: 12345"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={serial}
                                onChangeText={setSerial}
                            />

                            <Text style={styles.label2}>Código del dispositivo</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Ej: 9876543"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={codigo}
                                onChangeText={setCodigo}
                            />

                            <Text style={styles.label2}>Etiqueta del dispositivo</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Ej: ABC123"
                                placeholderTextColor="#999"
                                value={etiqueta}
                                onChangeText={setEtiqueta}
                            />

                            <Text style={styles.label2}>Tipo de dispositivo</Text>
                            <TouchableOpacity
                                style={styles.input2}
                                onPress={() => setMostrarTipos(!mostrarTipos)}
                            >
                                <Text style={{ color: tipoSeleccionado ? '#000' : '#999' }}>
                                    {tipoSeleccionado
                                        ? tipos.find(t => t.id === tipoSeleccionado)?.inv_nombre
                                        : 'Selecciona un tipo'}
                                </Text>
                            </TouchableOpacity>

                            {mostrarTipos && (
                                <View style={styles.dropdownList}>
                                    {tipos.map(tipo => (
                                        <TouchableOpacity
                                            key={tipo.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setTipoSeleccionado(tipo.id);
                                                setMostrarTipos(false);
                                            }}
                                        >
                                            <Text>{tipo.inv_nombre}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <Text style={styles.label2}>Salón</Text>
                            <TouchableOpacity
                                style={styles.input2}
                                onPress={() => setMostrarSalones(!mostrarSalones)}
                            >
                                <Text style={{ color: salonSeleccionado ? '#000' : '#999' }}>
                                    {salonSeleccionado
                                        ? formatearNombreSalon(salones.find(s => s.id === salonSeleccionado)?.sal_nombre)
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
                                                setSalonSeleccionado(salon.id);
                                                setMostrarSalones(false);
                                            }}
                                        >
                                            <Text>{formatearNombreSalon(salon.sal_nombre)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <Text style={styles.label2}>Estado</Text>
                            <TouchableOpacity
                                style={[styles.input2, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                                onPress={() => setEstadoActivo(!estadoActivo)}
                            >
                                <Text style={{ color: '#000' }}>
                                    {estadoActivo ? 'Activo' : 'Inactivo'}
                                </Text>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: estadoActivo ? '#4caf50' : '#f44336',
                                    borderWidth: 2,
                                    borderColor: estadoActivo ? '#4caf50' : '#f44336',
                                }} />
                            </TouchableOpacity>

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Guardar cambios</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('dispositivox', { dispositivo, data })}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    } else {
        navigation.replace('daccess', { data });
    }
}
