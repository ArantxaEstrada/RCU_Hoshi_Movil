import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Dispositivos({ navigation, route }) {
    const { data } = route?.params || {};
    if (data) {
        if (data.est_tipo !== 2 && data.perf_tipo <= 2) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Dispositivos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>

                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('cdispositivo', { data })}>
                            <Image source={require('../../img/cdisp.png')} />
                            <Text style={styles.optionText}>Dar de alta dispositivo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('rdispositivo', { data })}>
                            <Image source={require('../../img/sdisp.png')} />
                            <Text style={styles.optionText}>Buscar dispositivo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('informedispositivo', { data })}>
                            <Image source={require('../../img/inventario.png')} />
                            <Text style={styles.optionText}>Informe de dispositivos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('menu', { data })}>
                            <Text style={styles.buttonText}>Volver al menú</Text>
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
