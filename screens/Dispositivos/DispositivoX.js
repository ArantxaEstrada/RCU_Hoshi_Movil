import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { supabase } from '../../lib/supabase';

export default function DispositivoX({ navigation, route }) {
    const { dispositivo, data } = route?.params || {};
    const [tipoNombre, setTipoNombre] = useState('');
    const [salonNombre, setSalonNombre] = useState('');
    const [areaNombre, setAreaNombre] = useState('');
    const [loading, setLoading] = useState(true);

    // Función para formatear nombre de salón
    const formatearNombreSalon = (nombre) => {
        if (!nombre) return nombre;
        if (/^\d+$/.test(nombre.trim())) {
            return `Salón ${nombre}`;
        }
        return nombre;
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // Cargar tipo
            const { data: tipo } = await supabase
                .schema('RCU')
                .from('inventario')
                .select('inv_nombre')
                .eq('id', dispositivo.tipo_id)
                .maybeSingle();

            if (tipo) setTipoNombre(tipo.inv_nombre);

            // Cargar salón y área
            const { data: salon } = await supabase
                .schema('RCU')
                .from('salon')
                .select('sal_nombre, area_id')
                .eq('id', dispositivo.sal_id)
                .maybeSingle();

            if (salon) {
                setSalonNombre(salon.sal_nombre);

                // Cargar área
                const { data: area } = await supabase
                    .schema('RCU')
                    .from('area')
                    .select('area_nombre')
                    .eq('id', salon.area_id)
                    .maybeSingle();

                if (area) setAreaNombre(area.area_nombre);
            }

            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const getEstado = () => {
        if (!dispositivo.disp_estado_actv) return 'Inactivo';
        return 'Activo';
    };

    if (dispositivo && data && data.est_tipo !== 2 && data.perf_tipo <= 2) {
        if (loading) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.superiorPanel}>
                    <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                    <Text style={styles.superiorTitle}>Dispositivo #{dispositivo.id}</Text>
                    <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                </View>
                <View style={styles.informeContainer}>
                    <ScrollView style={styles.informeScrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.informeCard}>
                            <Text style={styles.welcomeText}>Información del dispositivo</Text>

                            <Text style={styles.label2}>ID:</Text>
                            <Text style={styles.input2}>{dispositivo.id}</Text>

                            <Text style={styles.label2}>Serial:</Text>
                            <Text style={styles.input2}>{dispositivo.disp_serial}</Text>

                            <Text style={styles.label2}>Código:</Text>
                            <Text style={styles.input2}>{dispositivo.disp_codigo}</Text>

                            <Text style={styles.label2}>Etiqueta:</Text>
                            <Text style={styles.input2}>{dispositivo.disp_etiqueta}</Text>

                            <Text style={styles.label2}>Tipo:</Text>
                            <Text style={styles.input2}>{tipoNombre}</Text>

                            <Text style={styles.label2}>Salón:</Text>
                            <Text style={styles.input2}>{formatearNombreSalon(salonNombre)}</Text>

                            <Text style={styles.label2}>Área:</Text>
                            <Text style={styles.input2}>{areaNombre}</Text>

                            <Text style={styles.label2}>Estado:</Text>
                            <Text style={styles.input2}>{getEstado()}</Text>
                        </View>
                    </ScrollView>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, position: 'absolute', bottom: 20, alignSelf: 'center' }}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('udispositivo', { dispositivo, data })}>
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('dispositivos', { data })}>
                            <Text style={styles.buttonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    } else {
        navigation.replace('daccess', { data });
    }
}
