import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/LogIn';
import Menu from '../screens/Menu';
import Reportes from '../screens/Reportes/Reportes';
import Pendientes from '../screens/Reportes/Pendientes';
import Completados from '../screens/Reportes/Completados';
import Alumno from '../screens/Alumnos/Alumno';
import CAlumno from '../screens/Alumnos/CAlumno';
import RAlumno from '../screens/Alumnos/RAlumno';
import UAlumno from '../screens/Alumnos/UAlumno';
import DAlumno from '../screens/Alumnos/DAlumno';
//import AlumnoX from '../screens/AlumnoX';
import Tecnicos from '../screens/Tecnicos/Tecnicos';
import CTecnico from '../screens/Tecnicos/CTecnico';
import UTecnico from '../screens/Tecnicos/UTecnico';
import DTecnico from '../screens/Tecnicos/DTecnico';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="menu" component={Menu} />
            <Stack.Screen name="reportes" component={Reportes} />
            <Stack.Screen name="pendientes" component={Pendientes} />
            <Stack.Screen name="completados" component={Completados} />
            <Stack.Screen name="alumnos" component={Alumno} />
            <Stack.Screen name="calumno" component={CAlumno} />
            <Stack.Screen name="ralumno" component={RAlumno} />
            <Stack.Screen name="ualumno" component={UAlumno} />
            <Stack.Screen name="dalumno" component={DAlumno} />
            <Stack.Screen name="tecnicos" component={Tecnicos} />
            <Stack.Screen name="ctecnico" component={CTecnico} />
            <Stack.Screen name="utecnico" component={UTecnico} />
            <Stack.Screen name="dtecnico" component={DTecnico} />
        </Stack.Navigator>
    );
}
/*
<Stack.Screen name="alumnox" component={AlumnoX} />
<Stack.Screen name="reportes" component={Reportes} />
*/
