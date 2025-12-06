import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function DTecnico({ navigation, route }) {
    const { data } = route?.params || {};
    if (data) {
        if (data.est_tipo != 2 && data.perf_tipo === 1) {
            return (
                <SafeAreaView style={styles.safe}>
                    <View style={styles.superiorPanel}>
                        <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                        <Text style={styles.superiorTitle}>Técnicos</Text>
                        <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
                    </View>
                    <View style={styles.loggedInContainer2}>
                        <Text style={styles.welcomeText}>Eliminar técnico</Text>

                        <View style={styles.formCard2}>
                            <Text style={styles.label2}>ID del técnico</Text>
                            <TextInput style={styles.input2} placeholder="" placeholderTextColor="#999" keyboardType="numeric" />

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Buscar técnico</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('tecnicos', { data })}>
                            <Text style={styles.buttonText}>Volver</Text>
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
