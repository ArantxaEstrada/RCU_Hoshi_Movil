import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Completados({ navigation, route }) {
    const { data } = route.params;
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.superiorPanel}>
                <Image source={require('../../img/ipn-logo.png')} style={[styles.cornerImage, styles.topLeft]} />
                <Text style={styles.superiorTitle}>Reportes</Text>
                <Image source={require('../../img/rcu-logo.png')} style={[styles.cornerImage, styles.topRight]} />
            </View>
            <View style={styles.loggedInContainer2}>
                <Text style={styles.welcomeText}>Reportes completados</Text>

                <View style={styles.tableContainer}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableText, styles.headerText]}>Reporte</Text>
                        <Text style={[styles.tableText, styles.headerText]}>Fecha</Text>
                        <Text style={[styles.tableText, styles.headerText]}>Estatus</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableText}>Reporte 1</Text>
                        <Text style={styles.tableText}>12/10/2025</Text>
                        <View style={styles.statusCell}>
                            <View style={[styles.statusDot, { backgroundColor: 'limegreen' }]} />
                        </View>
                    </View>
                    <View style={[styles.tableRow, styles.tableAlt]}>
                        <Text style={styles.tableText}>Reporte 2</Text>
                        <Text style={styles.tableText}>08/10/2025</Text>
                        <View style={styles.statusCell}>
                            <View style={[styles.statusDot, { backgroundColor: 'limegreen' }]} />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('reportes', { data })}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
