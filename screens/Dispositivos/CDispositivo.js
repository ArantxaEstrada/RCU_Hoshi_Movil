import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function CDispositivo({ navigation, route }) {
    const { data } = route?.params || {};
    const [serial, setSerial] = useState('');
    const [codigo, setCodigo] = useState('');
    const [etiqueta, setEtiqueta] = useState('');
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [salonSeleccionado, setSalonSeleccionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');
    const [tipos, setTipos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [salones, setSalones] = useState([]);
    const [mostrarTipos, setMostrarTipos] = useState(false);
    const [mostrarAreas, setMostrarAreas] = useState(false);
    const [mostrarSalones, setMostrarSalones] = useState(false);

    const regexNumerico = /^[0-9]+$/;

    // Función para formatear nombre de salón
    const formatearNombreSalon = (nombre) => {
        if (!nombre) return nombre;
        // Si el nombre es solo números, agregar "Salón " al inicio
        if (/^\d+$/.test(nombre.trim())) {
            return `Salón ${nombre}`;
        }
        return nombre;
    };

    // Ejecutar al montar
    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                // Tipos
                try {
                    const { data: tiposData, error: tiposError } = await supabase
                        .schema('RCU')
                        .from('inventario')
                        .select('*')
                        .order('inv_nombre', { ascending: true });
                    if (tiposError) throw tiposError;
                    setTipos(tiposData || []);
                } catch (err) {
                    setError('Error al cargar tipos.');
                }

                // Áreas
                try {
                    const { data: areasData, error: areasError } = await supabase
                        .schema('RCU')
                        .from('area')
                        .select('*')
                        .order('area_nombre', { ascending: true });
                    if (areasError) throw areasError;
                    setAreas(areasData || []);
                } catch (err) {
                    setError('Error al cargar áreas.');
                }

                // Salones (sin join para evitar fallos por relaciones)
                try {
                    const { data: salonesData, error: salonesError } = await supabase
                        .schema('RCU')
                        .from('salon')
                        .select('*')
                        .order('sal_nombre', { ascending: true });
                    if (salonesError) throw salonesError;
                    setSalones(salonesData || []);
                } catch (err) {
                    setError('Error al cargar salones.');
                }
            };

            cargarDatos();
        }, [])
    );

    // Filtrar salones asegurando coincidencia de tipos y existencia de area_id
    const salonesFiltrados = areaSeleccionada
        ? salones.filter(salon =>
            salon.area_id !== undefined && salon.area_id !== null &&
            String(salon.area_id) === String(areaSeleccionada)
        )
        : [];

    const handleCreate = async () => {
        const serialTrim = serial.trim();
        const codigoTrim = codigo.trim();
        const etiquetaTrim = etiqueta.trim();

        if (!serialTrim || !codigoTrim || !etiquetaTrim || !tipoSeleccionado || !areaSeleccionada || !salonSeleccionado) {
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

        // Verificar duplicados
        const { data: existente } = await supabase
            .schema('RCU')
            .from('dispositivo')
            .select('id')
            .eq('disp_serial', parseInt(serialTrim))
            .maybeSingle();

        if (existente) {
            setError('El serial ya está registrado.');
            return;
        }

        try {
            setLoading(true);

            // Calcular nuevo ID manualmente (igual que en reporte)
            let newId = 1;
            try {
                const { data: last, error: lastError } = await supabase
                    .schema('RCU')
                    .from('dispositivo')
                    .select('id')
                    .order('id', { ascending: false })
                    .limit(1);

                if (lastError) throw lastError;
                if (last && last.length > 0) {
                    newId = (last[0].id || 0) + 1;
                }
            } catch (idErr) {
                setError('Error al obtener nuevo ID de dispositivo.');
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase
                .schema('RCU')
                .from('dispositivo')
                .insert([{
                    id: newId,
                    disp_serial: parseInt(serialTrim),
                    disp_codigo: parseInt(codigoTrim),
                    disp_etiqueta: etiquetaTrim,
                    tipo_id: tipoSeleccionado,
                    sal_id: salonSeleccionado,
                    disp_estado_actv: true,
                    disp_estado_sld: null,
                }]);

            if (insertError) {
                setError(insertError.message || 'Error al crear dispositivo.');
                setLoading(false);
                return;
            }

            setError('');
            setLoading(false);
            setConfirm('Dispositivo creado exitosamente');
        } catch (err) {
            setError('Error al crear dispositivo.');
            setLoading(false);
        }
    };

    if (data && data.est_tipo !== 2 && data.perf_tipo <= 2) {
        if (confirm) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                        <Text style={styles.confirmText}>{confirm}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('dispositivos', { data })}>
                            <Text style={styles.buttonText}>Volver a dispositivos</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.superiorPanel}>
                    <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                    <Text style={styles.superiorTitle}>Dar de alta dispositivo</Text>
                    <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                </View>
                <View style={styles.loggedInContainer2}>
                    <Text style={styles.welcomeText}>Dar de alta dispositivo</Text>
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

                            <Text style={styles.label2}>Área</Text>
                            <TouchableOpacity
                                style={styles.input2}
                                onPress={() => {
                                    setMostrarAreas(!mostrarAreas);
                                    setMostrarSalones(false);
                                }}
                            >
                                <Text style={{ color: areaSeleccionada ? '#000' : '#999' }}>
                                    {areaSeleccionada
                                        ? areas.find(a => a.id === areaSeleccionada)?.area_nombre
                                        : 'Selecciona un área'}
                                </Text>
                            </TouchableOpacity>

                            {mostrarAreas && (
                                <View style={styles.dropdownList2}>
                                    <ScrollView showsVerticalScrollIndicator={true}>
                                        {areas.map(area => (
                                            <TouchableOpacity
                                                key={area.id}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setAreaSeleccionada(area.id);
                                                    setSalonSeleccionado(null);
                                                    setMostrarAreas(false);
                                                    setError('');
                                                }}
                                            >
                                                <Text>{area.area_nombre}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            <Text style={styles.label2}>Salón</Text>
                            <TouchableOpacity
                                style={styles.input2}
                                onPress={() => {
                                    if (!areaSeleccionada) {
                                        setError('Selecciona un área primero.');
                                        return;
                                    }
                                    setMostrarSalones(!mostrarSalones);
                                    setError('');
                                }}
                            >
                                <Text style={{ color: salonSeleccionado ? '#000' : '#999' }}>
                                    {salonSeleccionado
                                        ? formatearNombreSalon(salones.find(s => s.id === salonSeleccionado)?.sal_nombre)
                                        : 'Selecciona un salón'}
                                </Text>
                            </TouchableOpacity>

                            {mostrarSalones && (
                                <View style={[styles.dropdownList, { maxHeight: 200 }]}>
                                    <ScrollView>
                                        {salonesFiltrados.length === 0 ? (
                                            <Text style={styles.input2}>Sin salones para esta área.</Text>
                                        ) : (
                                            salonesFiltrados.map(salon => (
                                                <TouchableOpacity
                                                    key={salon.id}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSalonSeleccionado(salon.id);
                                                        setMostrarSalones(false);
                                                        setError('');
                                                    }}
                                                >
                                                    <Text>{formatearNombreSalon(salon.sal_nombre)}</Text>
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </ScrollView>
                                </View>
                            )}

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                        </ScrollView>
                        <TouchableOpacity
                                style={styles.button}
                                onPress={handleCreate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Crear dispositivo</Text>
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
