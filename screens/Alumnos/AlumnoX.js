//Importamos las librerías necesarias
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function AlumnoX({ route, navigation }) {
    const { boleta } = route.params;
    const [alumnoData, setAlumnoData] = useState(null);
    // Aquí iría la lógica para obtener los datos del alumno usando la boleta
    // Por ahora, usaremos datos de ejemplo
    return (
        <SafeAreaView>

        </SafeAreaView>
    );
}
