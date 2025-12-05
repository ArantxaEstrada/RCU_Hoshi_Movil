import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Dispositivos({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Dispositivos</Text>
                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>
            <View style={styles.loggedInContainer2}>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ctecnico')}>
                    <Image source={require('../../img/cdisp.png')} />
                    <Text style={styles.optionText}>Dar de alta dispositivo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('dtecnico')}>
                    <Image source={require('../../img/ddisp.png')} />
                    <Text style={styles.optionText}>Dar de baja dispositivo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('utecnico')}>
                    <Image source={require('../../img/sdisp.png')} />
                    <Text style={styles.optionText}>Buscar dispositivo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton}>
                    <Image source={require('../../img/inventario.png')} />
                    <Text style={styles.optionText}>Inventario</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('menu')}>
                    <Text style={styles.buttonText}>Volver al menú</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
