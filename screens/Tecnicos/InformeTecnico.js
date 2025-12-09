import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function InformeTecnico({ navigation, route }) {
    const { data } = route?.params || {};
    const [idTecnico, setIdTecnico] = useState('');
    const [tecnico, setTecnico] = useState(null);
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mostrarInforme, setMostrarInforme] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

    const regexId = /^[0-9]{1,20}$/;

    useEffect(() => {
        // Si es técnico o admin, cargar automáticamente su informe
        if (data && (data.perf_tipo === 1 || data.perf_tipo === 2)) {
            cargarInformeTecnico(data.id);
        }
    }, []);

    const cargarInformeTecnico = async (id) => {
        try {
            setLoading(true);
            setError('');

            // Obtener datos del técnico
            const { data: tecnicoData, error: tecnicoError } = await supabase
                .schema('RCU')
                .from('usuarios')
                .select('*')
                .eq('id', id)
                .in('perf_tipo', [1, 2])
                .maybeSingle();

            if (tecnicoError) {
                setError(tecnicoError.message || 'Error al obtener datos del técnico.');
                setLoading(false);
                return;
            }

            if (!tecnicoData) {
                setError('No se encontró el técnico.');
                setLoading(false);
                return;
            }

            setTecnico(tecnicoData);

            // Obtener reportes del técnico
            const { data: reportesData, error: reportesError } = await supabase
                .schema('RCU')
                .from('reporte')
                .select('*')
                .eq('tec_id', id)
                .order('rep_fecha_res', { ascending: false });

            if (reportesError) {
                setError(reportesError.message || 'Error al obtener reportes.');
                setLoading(false);
                return;
            }

            setReportes(reportesData || []);
            // Seleccionar el primer reporte por defecto si existen
            if (reportesData && reportesData.length > 0) {
                setReporteSeleccionado(0);
            } else {
                setReporteSeleccionado(null);
            }
            setMostrarInforme(true);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar el informe.');
            setLoading(false);
        }
    };

    const buscarTecnico = async () => {
        const idTrim = idTecnico.trim();

        if (!idTrim) {
            setError('Ingresa el ID del técnico.');
            return;
        }

        if (!regexId.test(idTrim)) {
            setError('El ID solo puede contener números.');
            return;
        }

        cargarInformeTecnico(parseInt(idTrim));
    };

    function formatDate(fechaString) {
        if (!fechaString) return 'No especificada';
        const fecha = new Date(fechaString);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        return `${dia}/${mes}/${año} ${horas}:${minutos}`;
    }

    function getEstadoReporte(estado) {
        switch (estado) {
            case 1: return 'Pendiente';
            case 2: return 'En proceso';
            case 3: return 'Completado';
            default: return 'Desconocido';
        }
    }

    function getEstadoUsuario(estado) {
        switch (estado) {
            case 1: return 'Activo';
            case 2: return 'Baja';
            case 3: return 'Ausente';
            case 4: return 'Dictamen';
            default: return 'Desconocido';
        }
    }

    if (data) {
        if (data.est_tipo !== 2 && (data.perf_tipo === 1 || data.perf_tipo === 2)) {
            // Admin o Técnico
            if (loading) {
                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    </SafeAreaView>
                );
            }

            if (mostrarInforme && tecnico) {
                const totalReportes = reportes.length;
                const reportesPendientes = reportes.filter(r => r.rep_estado === 1).length;
                const reportesEnProceso = reportes.filter(r => r.rep_estado === 2).length;
                const reportesCompletados = reportes.filter(r => r.rep_estado === 3).length;

                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={styles.superiorPanel}>
                            <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                            <Text style={styles.superiorTitle}>Informe Técnico</Text>
                            <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                        </View>
                        <View style={styles.informeContainer}>
                            <ScrollView style={styles.informeScrollView} showsVerticalScrollIndicator={false}>
                                <View style={styles.informeCard}>
                                    {/* Información del técnico */}
                                    <Text style={styles.welcomeText}>Datos del técnico</Text>
                                    <Text style={styles.label2}>Nombre completo:</Text>
                                    <Text style={styles.input2}>{tecnico.usr_nombre} {tecnico.usr_ap} {tecnico.usr_am}</Text>

                                    <Text style={styles.label2}>ID:</Text>
                                    <Text style={styles.input2}>{tecnico.id}</Text>

                                    <Text style={styles.label2}>Correo:</Text>
                                    <Text style={styles.input2}>{tecnico.usr_correo}</Text>

                                    <Text style={styles.label2}>Estado:</Text>
                                    <Text style={styles.input2}>{getEstadoUsuario(tecnico.est_tipo)}</Text>

                                    {/* Estadísticas de reportes */}
                                    <Text style={[styles.welcomeText, { marginTop: 20 }]}>Estadísticas de reportes</Text>
                                    <View style={styles.informeStatsBox}>
                                        <View style={styles.informeRow}>
                                            <View style={styles.informeColumnItem}>
                                                <Text style={styles.label2}>Total</Text>
                                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0066cc' }}>{totalReportes}</Text>
                                            </View>
                                            <View style={styles.informeColumnItem}>
                                                <Text style={styles.label2}>Pendientes</Text>
                                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>{reportesPendientes}</Text>
                                            </View>
                                            <View style={styles.informeColumnItem}>
                                                <Text style={styles.label2}>En proceso</Text>
                                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>{reportesEnProceso}</Text>
                                            </View>
                                            <View style={styles.informeColumnItem}>
                                                <Text style={styles.label2}>Completados</Text>
                                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>{reportesCompletados}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {reportes.length > 0 && (
                                        <>
                                            <Text style={styles.welcomeText}>Reportes</Text>
                                            {/* Lista de reportes */}
                                            <View style={styles.informeReportList}>
                                                {reportes.map((reporte, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[
                                                            styles.informeReportListItem,
                                                            reporteSeleccionado === index && styles.informeReportListItemSelected
                                                        ]}
                                                        onPress={() => setReporteSeleccionado(index)}
                                                    >
                                                        <Text style={[
                                                            styles.informeReportListText,
                                                            reporteSeleccionado === index && styles.informeReportListTextSelected
                                                        ]}>
                                                            Reporte #{reporte.id} - {getEstadoReporte(reporte.rep_estado)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>

                                            {reporteSeleccionado !== null && reportes[reporteSeleccionado] && (
                                                <View style={styles.informeReporteCard}>
                                                    <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Reporte #{reportes[reporteSeleccionado].id}</Text>

                                                    <Text style={styles.label2}>Estado:</Text>
                                                    <Text style={styles.input2}>{getEstadoReporte(reportes[reporteSeleccionado].rep_estado)}</Text>

                                                    <Text style={styles.label2}>Descripción:</Text>
                                                    <Text style={styles.input2}>{reportes[reporteSeleccionado].rep_descripcion || 'Sin descripción'}</Text>

                                                    <Text style={styles.label2}>Fecha de levantamiento:</Text>
                                                    <Text style={styles.input2}>{formatDate(reportes[reporteSeleccionado].rep_fecha_lev)}</Text>

                                                    <Text style={styles.label2}>Fecha de resolución:</Text>
                                                    <Text style={styles.input2}>{formatDate(reportes[reporteSeleccionado].rep_fecha_res)}</Text>

                                                    <Text style={styles.label2}>Observaciones:</Text>
                                                    <Text style={styles.input2}>{reportes[reporteSeleccionado].rep_observaciones || 'Sin observaciones'}</Text>
                                                </View>
                                            )}
                                        </>
                                    )}

                                    {reportes.length === 0 && (
                                        <Text style={styles.informeEmptyText}>
                                            Este técnico no tiene reportes asignados.
                                        </Text>
                                    )}
                                </View>
                            </ScrollView>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, position: 'absolute', bottom: 20, alignSelf: 'center' }}>
                                {data.perf_tipo === 1 && (
                                    <TouchableOpacity style={styles.button} onPress={() => setMostrarInforme(false)}>
                                        <Text style={styles.buttonText}>Buscar otro</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.button} onPress={() => data.perf_tipo === 1 ? navigation.navigate('tecnicos', { data }) : navigation.navigate('menu', { data })}>
                                    <Text style={styles.buttonText}>Volver</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                );
            }

            // Pantalla de búsqueda (solo para admin)
            if (data.perf_tipo === 1) {
                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={styles.superiorPanel}>
                            <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                            <Text style={styles.superiorTitle}>Informe</Text>
                            <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                        </View>
                        <View style={styles.loggedInContainer2}>
                            <Text style={styles.welcomeText}>Buscar informe</Text>
                            <View style={styles.formCard2}>
                                <Text style={styles.label2}>ID del técnico</Text>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Ingresa el ID"
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
                                        <Text style={styles.buttonText}>Buscar informe</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('tecnicos', { data })}>
                                <Text style={styles.buttonText}>Volver</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                );
            }
        } else {
            navigation.replace('daccess', { data });
        }
    } else {
        navigation.replace('eaccess');
    }
}
