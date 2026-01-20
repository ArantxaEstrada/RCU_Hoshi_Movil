import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function CReporte({ navigation, route }) {
    const { data } = route?.params || {};
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const [areas, setAreas] = useState([]);
    const [salones, setSalones] = useState([]);
    const [dispositivos, setDispositivos] = useState([]);
    const [inventario, setInventario] = useState([]);

    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedSalon, setSelectedSalon] = useState(null);
    const [selectedDisp, setSelectedDisp] = useState(null);

    const [showAreaList, setShowAreaList] = useState(false);
    const [showSalonList, setShowSalonList] = useState(false);
    const [showDispList, setShowDispList] = useState(false);

    const regexDesc = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,;:#()\-_\/\n]+$/;

    // Función para obtener la hora actual de México (UTC-6)
    const getMexicoTime = () => {
        const formatter = new Intl.DateTimeFormat('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(new Date());
        const obj = {};
        parts.forEach(({ type, value }) => {
            obj[type] = value;
        });

        return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}.000Z`;
    };

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

    useEffect(() => {
        const loadData = async () => {
            try {
                // Áreas
                const { data: areaData, areaError } = await supabase.schema('RCU').from('area').select('*');
                if (!areaData) {
                    setError('No se pudieron cargar las áreas.');
                    return;
                }
                if (areaError) {
                    setError(areaError.message);
                    return;
                }
                setAreas(areaData || []);
                // Salones
                const { data: salonData, salonError } = await supabase.schema('RCU').from('salon').select('*');
                if (!salonData) {
                    setError('No se pudieron cargar los salones.');
                    return;
                }
                if (salonError) {
                    setError(salonError.message);
                    return;
                }
                setSalones(salonData || []);
                // Dispositivos
                const { data: dispData, dispError } = await supabase.schema('RCU').from('dispositivo').select('*');
                if (!dispData) {
                    setError('No se pudieron cargar los dispositivos.');
                    return;
                }
                if (dispError) {
                    setError(dispError.message);
                    return;
                }
                setDispositivos(dispData || []);
                // Inventario
                const { data: inventarioData, inventarioError } = await supabase.schema('RCU').from('inventario').select('*');
                if (!inventarioData) {
                    setError('No se pudieron cargar los inventarios.');
                    return;
                }
                if (inventarioError) {
                    setError(inventarioError.message);
                    return;
                }
                setInventario(inventarioData || []);
                setError('');
            } catch (err) {
                setError(err?.message || 'Error al cargar listas.');
            }
        };
        loadData();
    }, []);

    const filteredSalones = useMemo(() => {
        if (!selectedArea) return [];
        return salones.filter((s) => s.area_id === selectedArea);
    }, [selectedArea, salones]);

    const filteredDisps = useMemo(() => {
        if (!selectedSalon) return [];
        return dispositivos.filter((d) => d.sal_id === selectedSalon);
    }, [selectedSalon, dispositivos]);

    const getAreaLabel = (area) => area?.area_nombre || `Área ${area?.id ?? ''}`;
    const getSalonLabel = (s) => s?.sal_nombre || `Salón ${s?.id ?? ''}`;
    const getDispLabel = (d) => {
        const serial = d?.disp_serial || '';
        const inventarioItem = inventario.find(inv => inv.id === d?.tipo_id);
        const nombre = inventarioItem?.inv_nombre || '';
        if (serial && nombre) return `${serial} - ${nombre}`;
        return serial || nombre || `Disp ${d?.id ?? ''}`;
    };

    const handleCreate = async () => {
        try {
            setLoading(true);
            const descTrim = descripcion.trim();

            if (!selectedArea) {
                setError('Selecciona un área.');
                setLoading(false);
                return;
            }
            if (!selectedSalon) {
                setError('Selecciona un salón.');
                setLoading(false);
                return;
            }
            if (!selectedDisp) {
                setError('Selecciona un dispositivo.');
                setLoading(false);
                return;
            }

            if (!descTrim) {
                setError('La descripción no puede estar vacía.');
                setLoading(false);
                return;
            }

            if (!regexDesc.test(descTrim)) {
                setError('La descripción contiene caracteres no permitidos.');
                setLoading(false);
                return;
            }

            // Buscar técnico o admin con menos reportes asignados (estado 0, 1 o 2)
            let tecId = null;
            try {
                const { data: usuarios, error: usError } = await supabase
                    .schema('RCU')
                    .from('usuarios')
                    .select('id, perf_tipo, est_tipo');
                if (usError) {
                    setError(usError.message || 'Error al obtener técnicos.');
                    setLoading(false);
                    return;
                }
                //Borrar donde el est_tipo sea 2 o 3 o donde perf_tipo no sea 1 o 2
                const filteredUsuarios = usuarios.filter(u => (u.est_tipo !== 2 && u.est_tipo !== 3) && (u.perf_tipo === 1 || u.perf_tipo === 2));
                usuarios.length = 0;
                usuarios.push(...filteredUsuarios);
                // Obtener todos los reportes activos
                const { data: allReportesActivos, error: repError } = await supabase
                    .schema('RCU')
                    .from('reporte')
                    .select('tec_id')
                    .in('rep_estado', [0, 1, 2]);

                if (repError) {
                    setError(repError.message || 'Error al obtener reportes.');
                    setLoading(false);
                    return;
                }

                if (usuarios && usuarios.length > 0) {
                    const countByTec = {};

                    // Inicializa en 0 para cada usuario
                    usuarios.forEach(u => {
                        countByTec[u.id] = 0;
                    });

                    // Contar reportes en JS
                    allReportesActivos.forEach(r => {
                        if (r.tec_id && countByTec.hasOwnProperty(r.tec_id)) {
                            countByTec[r.tec_id]++;
                        }
                    });

                    // Escoger técnico con menos reportes
                    tecId = usuarios.reduce((minTec, u) => {
                        return countByTec[u.id] < countByTec[minTec] ? u.id : minTec;
                    }, usuarios[0].id);
                }

            } catch (err) {
                setError('Error al asignar técnico automáticamente.');
                setLoading(false);
                return;
            }

            // Obtener el ID más grande y sumar 1
            let newId = 1;
            try {
                const { data: allReportes, error: allRepError } = await supabase
                    .schema('RCU')
                    .from('reporte')
                    .select('id')
                    .order('id', { ascending: false })
                    .limit(1);

                if (allRepError) throw allRepError;

                if (allReportes && allReportes.length > 0) {
                    newId = (allReportes[0].id || 0) + 1;
                }
            } catch (err) {
                setError('Error al obtener nuevo ID de reporte.');
                setLoading(false);
                return;
            }

            const insertData = {
                id: newId,
                rep_descripcion: descTrim,
                rep_fecha_lev: getMexicoTime(),
                rep_fecha_res: null,
                sal_id: selectedSalon,
                al_boleta: data?.id,
                disp_id: selectedDisp,
                rep_fecha_asig_tec: tecId ? getMexicoTime() : null,
                tec_id: tecId,
                rep_solucion: null,
                rep_estado: tecId ? 1 : 0,
            };

            const { error: insertError } = await supabase.schema('RCU').from('reporte').insert(insertData);

            if (insertError) {
                setError(insertError.message || 'No se pudo crear el reporte.');
                setLoading(false);
                return;
            }
            setError('');
            setLoading(false);
            setConfirm('Reporte creado exitosamente');
        } catch (err) {
            setError('Error al crear el reporte.');
            setLoading(false);
        }
    };

    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 3) {
            if (confirm) {
                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                            <Text style={styles.confirmText}>{confirm}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('menu', { data })}>
                                <Text style={styles.buttonText}>Volver al menú</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                );
            }
            return (
                <SafeAreaView style={styles.safe}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={80}
                    >
                        {!keyboardVisible && (
                            <View style={styles.superiorPanel}>
                                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                                <Text style={styles.superiorTitle}>Enviar reporte</Text>
                                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                            </View>
                        )}
                        <ScrollView contentContainerStyle={styles.loggedInContainer}>
                            <View style={styles.formCard2}>
                                <ScrollView style={styles.formCardScroll} showsVerticalScrollIndicator={false}>
                                    <Text style={styles.label}>Área</Text>
                                    <TouchableOpacity
                                        style={styles.input}
                                        onPress={() => setShowAreaList((v) => !v)}
                                    >
                                        <Text>{selectedArea ? getAreaLabel(areas.find((a) => a.id === selectedArea)) : 'Selecciona un área'}</Text>
                                    </TouchableOpacity>
                                    {showAreaList ? (
                                        <View style={{ marginTop: 8, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' }}>
                                            {areas.length === 0 ? (
                                                <Text style={styles.input}>Sin áreas</Text>
                                            ) : (
                                                areas.map((a) => {
                                                    const areaId = a.id;
                                                    return (
                                                        <TouchableOpacity
                                                            key={areaId}
                                                            style={{ padding: 10 }}
                                                            onPress={() => {
                                                                setSelectedArea(areaId);
                                                                setSelectedSalon(null);
                                                                setSelectedDisp(null);
                                                                setShowAreaList(false);
                                                                setShowSalonList(false);
                                                                setShowDispList(false);
                                                            }}
                                                        >
                                                            <Text>{getAreaLabel(a)}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            )}
                                        </View>
                                    ) : null}
                                    <Text style={styles.label}>Salón</Text>
                                    <TouchableOpacity
                                        style={[styles.input, { opacity: selectedArea ? 1 : 0.5 }]}
                                        disabled={!selectedArea}
                                        onPress={() => setShowSalonList((v) => !v)}
                                    >
                                        <Text>
                                            {selectedSalon
                                                ? getSalonLabel(filteredSalones.find((s) => s.id === selectedSalon))
                                                : selectedArea
                                                    ? 'Selecciona un salón'
                                                    : 'Primero selecciona un área'}
                                        </Text>
                                    </TouchableOpacity>
                                    {showSalonList && selectedArea ? (
                                        <View style={{ marginTop: 8, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' }}>
                                            {filteredSalones.length === 0 ? (
                                                <Text style={styles.input}>Sin salones</Text>
                                            ) : (
                                                filteredSalones.map((s) => (
                                                    <TouchableOpacity
                                                        key={s.id}
                                                        style={{ padding: 10 }}
                                                        onPress={() => {
                                                            setSelectedSalon(s.id);
                                                            setSelectedDisp(null);
                                                            setShowSalonList(false);
                                                            setShowDispList(false);
                                                        }}
                                                    >
                                                        <Text>{getSalonLabel(s)}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            )}
                                        </View>
                                    ) : null}
                                    <Text style={styles.label}>Dispositivo</Text>
                                    <TouchableOpacity
                                        style={[styles.input, { opacity: selectedSalon ? 1 : 0.5 }]}
                                        disabled={!selectedSalon}
                                        onPress={() => setShowDispList((v) => !v)}
                                    >
                                        <Text>
                                            {selectedDisp
                                                ? getDispLabel(filteredDisps.find((d) => d.id === selectedDisp))
                                                : selectedSalon
                                                    ? 'Selecciona un dispositivo'
                                                    : 'Selecciona primero un salón'}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDispList && selectedSalon ? (
                                        <View style={{ marginTop: 8, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee' }}>
                                            {filteredDisps.length === 0 ? (
                                                <Text style={styles.input}>Sin dispositivos</Text>
                                            ) : (
                                                filteredDisps.map((d) => (
                                                    <TouchableOpacity
                                                        key={d.id}
                                                        style={{ padding: 10 }}
                                                        onPress={() => {
                                                            setSelectedDisp(d.id);
                                                            setShowDispList(false);
                                                        }}
                                                    >
                                                        <Text>{getDispLabel(d)}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            )}
                                        </View>
                                    ) : null}
                                    <Text style={styles.label}>Descripción</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={descripcion}
                                        onChangeText={setDescripcion}
                                        placeholder="Describe el problema"
                                        multiline
                                    />
                                    {error ? <Text style={styles.error}>{error}</Text> : null}
                                </ScrollView>
                                <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
                                    {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Enviar reporte</Text>}
                                </TouchableOpacity>
                            </View>
                            {!keyboardVisible && (
                                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('menu', { data })}>
                                    <Text style={styles.buttonText}>Volver</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            );
        } else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('eaccess');
    }
}
