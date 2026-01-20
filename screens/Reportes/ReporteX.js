import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function ReporteX({ navigation, route }) {
    const { data, reporte, dispositivo, inventario } = route.params;
    const nombreDispositivo = dispositivo ? dispositivo.disp_nombre : 'Desconocido';
    const serialDispositivo = dispositivo ? dispositivo.disp_serial : 'N/A';
    const [error, setError] = useState('');
    const [salon, setSalon] = useState(null);

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
        if (data && reporte && dispositivo && inventario) {
            // También cargar salón para perf_tipo 3 (alumnos)
            if (data.est_tipo != 2) {
                getInformation();
            }
        }
    }, []);

    const getInformation = async () => {
        try {
            if (!reporte.sal_id) {
                setSalon('Desconocido');
                return;
            }
            // Salón
            const { data: salonData, error: salonError } = await supabase
                .schema('RCU')
                .from('salon')
                .select('sal_nombre')
                .eq('id', reporte.sal_id)
                .single();
            if (salonError) {
                setError(salonError.message);
                setSalon('Desconocido');
                return;
            }
            if (salonData) {
                if (salonData.sal_nombre.trim().length > 1) {
                    setSalon(salonData.sal_nombre);
                } else if (salonData.sal_nombre.trim().length == 1) {
                    setSalon('Salón ' + salonData.sal_nombre);
                } else {
                    setSalon('Desconocido');
                }
                setError('');
            } else {
                setSalon('Desconocido');
            }

        } catch (error) {
            setError('Error al obtener la información.');
            setSalon('Desconocido');
        }
    }

    if (data && reporte && dispositivo && inventario) {
        if (data.est_tipo != 2 && data.perf_tipo <= 3) {
            if (data.perf_tipo <= 2) {
                if (reporte.rep_estado == 2) {
                    return (
                        <SafeAreaView style={styles.safe}>
                            <View style={styles.superiorPanel}>
                                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                                <Text style={styles.superiorTitle}>Reportes #{reporte.id}</Text>
                                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                            </View>
                            <View style={styles.loggedInContainer}>
                                <View style={styles.formCard2}>

                                    <Text style={styles.label}>Dispositivo:</Text>
                                    <Text style={styles.input}>{inventario?.inv_nombre || 'Desconocido'} {dispositivo?.disp_serial || 'N/A'}</Text>

                                    <Text style={styles.label}>Descripción:</Text>
                                    <Text style={styles.input}>{reporte.rep_descripcion}</Text>

                                    <Text style={styles.label}>Fecha y hora de levantamiento:</Text>
                                    <Text style={styles.input}>{(() => {
                                        const date = new Date(reporte.rep_fecha_lev);
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const year = date.getFullYear();
                                        const hours = String(date.getHours()).padStart(2, '0');
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        return `${day}-${month}-${year} ${hours}:${minutes}`;
                                    })()}</Text>

                                    <Text style={styles.label}>Fecha y hora de resolución:</Text>
                                    <Text style={styles.input}>{reporte.rep_fecha_res ? (() => {
                                        const date = new Date(reporte.rep_fecha_res);
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const year = date.getFullYear();
                                        const hours = String(date.getHours()).padStart(2, '0');
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        return `${day}-${month}-${year} ${hours}:${minutes}`;
                                    })() : 'Pendiente'}</Text>

                                    <Text style={styles.label}>Solución:</Text>
                                    <Text style={styles.input}>{reporte.rep_solucion || 'Desconocida'}</Text>

                                    <Text style={styles.label}>Salón:</Text>
                                    <Text style={styles.input}>
                                        {salon ? salon : 'Cargando...'}
                                    </Text>

                                    <Text style={styles.label}>Alumno</Text>
                                    <Text style={styles.input}>{reporte.al_boleta || 'Desconocido'}</Text>

                                    {error ? <Text style={styles.error}>{error}</Text> : null}
                                </View>


                                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('completados', { data })}>
                                    <Text style={styles.buttonText}>Volver</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    );
                } else if (reporte.rep_estado == 1) {

                    const [solucion, setSolucion] = useState(reporte.rep_solucion || '');
                    const formatDateToDDMMYYYY = (dateString) => {
                        if (!dateString) return '';
                        const date = new Date(dateString);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                    };
                    const formatTimeToHHMM = (dateString) => {
                        if (!dateString) return '';
                        const date = new Date(dateString);
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${hours}:${minutes}`;
                    };
                    const [fechaResolucion, setFechaResolucion] = useState(reporte.rep_fecha_res ? new Date(reporte.rep_fecha_res) : new Date());
                    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
                    const [loadingUpdate, setLoadingUpdate] = useState(false);

                    const showDatePicker = () => {
                        setDatePickerVisibility(true);
                    };

                    const hideDatePicker = () => {
                        setDatePickerVisibility(false);
                    };

                    const handleConfirm = (date) => {
                        setFechaResolucion(date);
                        hideDatePicker();
                    };

                    const formatDisplayDateTime = (date) => {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${day}-${month}-${year} ${hours}:${minutes}`;
                    };

                    const updateReporte = async () => {
                        try {
                            setLoadingUpdate(true);
                            const solucionTrim = solucion.trim();
                            if (!solucionTrim) {
                                setError('La solución no puede estar vacía.');
                                setLoadingUpdate(false);
                                return;
                            }

                            const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,;:#()\-_/\n]+$/;
                            if (!regex.test(solucionTrim)) {
                                setError('La solución contiene caracteres no permitidos.');
                                setLoadingUpdate(false);
                                return;
                            }

                            // Validar que la fecha de resolución sea válida y posterior a la de levantamiento
                            if (!fechaResolucion || isNaN(fechaResolucion.getTime())) {
                                setError('Selecciona una fecha y hora de resolución válidas.');
                                setLoadingUpdate(false);
                                return;
                            }

                            const levantamientoDate = new Date(reporte.rep_fecha_lev);
                            if (fechaResolucion.getTime() <= levantamientoDate.getTime()) {
                                setError('La fecha de resolución debe ser mayor a la fecha de levantamiento.');
                                setLoadingUpdate(false);
                                return;
                            }

                            const now = new Date();
                            if (fechaResolucion.getTime() > now.getTime()) {
                                setError('La fecha de resolución no puede ser mayor a la fecha actual.');
                                setLoadingUpdate(false);
                                return;
                            }

                            const updateData = {
                                rep_solucion: solucionTrim,
                                rep_fecha_res: getMexicoTime(),
                                rep_estado: 2,
                            };
                            const { error: updateError } = await supabase
                                .schema('RCU')
                                .from('reporte')
                                .update(updateData)
                                .eq('id', reporte.id);

                            setLoadingUpdate(false);

                            if (updateError) {
                                setError(updateError.message);
                                return;
                            }

                            navigation.replace('pendientes', { data });

                        } catch (error) {
                            setError('Error al actualizar el reporte.');
                            setLoadingUpdate(false);
                        }
                    }

                    return (
                        <SafeAreaView style={styles.safe}>
                            <View style={styles.superiorPanel}>
                                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                                <Text style={styles.superiorTitle}>Reportes #{reporte.id}</Text>
                                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                            </View>

                            <ScrollView contentContainerStyle={styles.loggedInContainer}>
                                <View style={styles.formCard2}>
                                    <Text style={styles.label}>Dispositivo:</Text>
                                    <Text style={styles.input}>{inventario?.inv_nombre || 'Desconocido'} {dispositivo?.disp_serial || 'N/A'}</Text>

                                    <Text style={styles.label}>Descripción:</Text>
                                    <Text style={styles.input}>{reporte.rep_descripcion}</Text>

                                    <Text style={styles.label}>Fecha y hora de levantamiento:</Text>
                                    <Text style={styles.input}>
                                        {formatDisplayDateTime(new Date(reporte.rep_fecha_lev))}
                                    </Text>

                                    <Text style={styles.label}>Solución:</Text>
                                    <TextInput
                                        style={styles.input}
                                        multiline
                                        value={solucion}
                                        onChangeText={setSolucion}
                                        placeholder="Escribe la solución"
                                    />

                                    <Text style={styles.label}>Fecha y hora de resolución:</Text>
                                    <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                                        <Text>{formatDisplayDateTime(fechaResolucion)}</Text>
                                    </TouchableOpacity>

                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="datetime"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        date={fechaResolucion}
                                        locale="es_ES"
                                    />

                                    <Text style={styles.label}>Salón:</Text>
                                    <Text style={styles.input}>
                                        {salon ? salon : 'Cargando...'}
                                    </Text>

                                    {error ? <Text style={styles.error}>{error}</Text> : null}

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={updateReporte}
                                        disabled={loadingUpdate}
                                    >
                                        {loadingUpdate ?
                                            <ActivityIndicator /> :
                                            <Text style={styles.buttonText}>Actualizar reporte</Text>
                                        }
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.button2}
                                    onPress={() => navigation.navigate('pendientes', { data })}
                                >
                                    <Text style={styles.buttonText}>Volver</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </SafeAreaView>
                    );
                }
            } else if (data.perf_tipo == 3) {
                const getEstadoText = (estado) => {
                    if (estado == 0) return 'No asignado';
                    if (estado == 1) return 'Pendiente';
                    if (estado == 2) return 'Completado';
                    return 'Desconocido';
                };

                const getEstadoColor = (estado) => {
                    if (estado == 0) return 'red';
                    if (estado == 1) return 'orange';
                    if (estado == 2) return 'limegreen';
                    return 'gray';
                };

                return (
                    <SafeAreaView style={styles.safe}>
                        <View style={styles.superiorPanel}>
                            <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                            <Text style={styles.superiorTitle}>Reportes #{reporte.id}</Text>
                            <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                        </View>
                        <View style={styles.loggedInContainer}>
                            <View style={styles.formCard2}>

                                <Text style={styles.label}>Dispositivo:</Text>
                                <Text style={styles.input}>{inventario?.inv_nombre || 'Desconocido'} {dispositivo?.disp_serial || 'N/A'}</Text>

                                <Text style={styles.label}>Descripción:</Text>
                                <Text style={styles.input}>{reporte.rep_descripcion}</Text>

                                <Text style={styles.label}>Fecha y hora de levantamiento:</Text>
                                <Text style={styles.input}>{(() => {
                                    const date = new Date(reporte.rep_fecha_lev);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    return `${day}-${month}-${year} ${hours}:${minutes}`;
                                })()}</Text>

                                <Text style={styles.label}>Fecha y hora de resolución:</Text>
                                <Text style={styles.input}>{reporte.rep_fecha_res ? (() => {
                                    const date = new Date(reporte.rep_fecha_res);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    return `${day}-${month}-${year} ${hours}:${minutes}`;
                                })() : 'Pendiente'}</Text>

                                <Text style={styles.label}>Solución:</Text>
                                <Text style={styles.input}>{reporte.rep_solucion || 'Desconocida'}</Text>

                                <Text style={styles.label}>Salón:</Text>
                                <Text style={styles.input}>
                                    {salon ? salon : 'Cargando...'}
                                </Text>

                                <Text style={styles.label}>Alumno</Text>
                                <Text style={styles.input}>{reporte.al_boleta || 'Desconocido'}</Text>

                                <Text style={styles.label}>Estado:</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: getEstadoColor(reporte.rep_estado) }} />
                                    <Text style={styles.input}>{getEstadoText(reporte.rep_estado)}</Text>
                                </View>

                                {error ? <Text style={styles.error}>{error}</Text> : null}
                            </View>

                            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('reportesal', { data })}>
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
