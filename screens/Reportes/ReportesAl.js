import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function ReportesAl({ navigation, route }) {
    const { data } = route.params;
    const [error, setError] = useState('');
    const [reportes, setReportes] = useState([]);
    const [dispositivoList, setDispositivoList] = useState([]);
    const [inventarioList, setInventarioList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data && data.est_tipo != 2) {
            getInformation();
        }
    }, []);

    //Obtener datos
    const getInformation = async () => {
        try {
            setLoading(true);
            // Reportes del alumno
            const { data: reportesData, error } = await supabase
                .schema('RCU')
                .from('reporte')
                .select('*')
                .eq('al_boleta', data.id)
                .order('rep_fecha_lev', { ascending: false });
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            setReportes(reportesData || []);
            // Dispositivos
            const { data: dispositivos, error: dispError } = await supabase
                .schema('RCU')
                .from('dispositivo')
                .select('*');

            if (dispError) {
                setError(dispError.message);
                setLoading(false);
                return;
            }
            setDispositivoList(dispositivos || []);
            // Inventario
            const { data: inventario, error: invError } = await supabase
                .schema('RCU')
                .from('inventario')
                .select('*');

            if (invError) {
                setError(invError.message);
                setLoading(false);
                return;
            }
            setInventarioList(inventario || []);

            setError('');
            setLoading(false);

        } catch (err) {
            setError('Error al cargar los reportes');
            setLoading(false);
        }
    };

    function formatDate(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();

        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${dia}/${mes}/${año} ${horas}:${minutos}`;
    }

    function getStatusColor(estado) {
        if (estado == 2) return 'limegreen'; // Completado
        if (estado == 1) return 'yellow'; // Pendiente
        return 'red'; // Sin asignar o desconocido
    }

    if (data) {
        if (data.est_tipo != 2) {
            const dispositivoMap = {};
            dispositivoList.forEach(d => { dispositivoMap[d.id] = d; });

            const inventarioMap = {};
            inventarioList.forEach(inv => { inventarioMap[inv.id] = inv; });

            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Reportes</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>

                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Mis reportes</Text>

                        <View style={styles.tableWrapper}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableText, styles.headerText]}>Dispositivo</Text>
                                <Text style={[styles.tableText, styles.headerText]}>Fecha</Text>
                                <Text style={[styles.tableText, styles.headerText]}>Estatus</Text>
                            </View>

                            <ScrollView
                                style={styles.tableScroll}
                                contentContainerStyle={styles.tableContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {loading ? (
                                    <View style={{ padding: 20, alignItems: 'center' }}>
                                        <ActivityIndicator size="large" />
                                    </View>
                                ) : (
                                    reportes.length > 0 ? (
                                        reportes.map((rep, index) => {
                                            const dispositivo = dispositivoMap[rep.disp_id];
                                            const inventario = dispositivo ? inventarioMap[dispositivo.tipo_id] : null;

                                            const nombre = inventario?.inv_nombre || 'Desconocido';
                                            const serial = dispositivo?.disp_serial || 'N/A';

                                            return (
                                                <TouchableOpacity
                                                    key={rep.id || index}
                                                    style={[
                                                        styles.tableRow,
                                                        index % 2 === 1 ? styles.tableAlt : null
                                                    ]}
                                                    onPress={() => navigation.navigate('reportex', { data, reporte: rep, dispositivo, inventario })}
                                                >
                                                    <Text style={styles.tableText}>
                                                        {nombre} {serial}
                                                    </Text>

                                                    <Text style={styles.tableText}>
                                                        {formatDate(rep.rep_fecha_lev)}
                                                    </Text>

                                                    <View style={styles.statusCell}>
                                                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(rep.rep_estado) }]} />
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })
                                    ) : (
                                        <View style={{ padding: 15 }}>
                                            <Text style={styles.error}>No tiene reportes registrados</Text>
                                        </View>
                                    )
                                )}
                            </ScrollView>
                        </View>

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <TouchableOpacity
                            style={styles.button2}
                            onPress={() => navigation.replace('menu', { data })}
                        >
                            <Text style={styles.buttonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else {
            navigation.replace('eaccess');
        }
    } else {
        navigation.replace('eaccess');
    }
}
