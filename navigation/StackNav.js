//Librarías
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Principal
import Login from '../screens/LogIn';
import Menu from '../screens/Menu';
import DAccess from '../screens/DAccess';
import EAccess from '../screens/EAccess';
//Reportes
import CReporte from '../screens/Reportes/CReporte';
import Reportes from '../screens/Reportes/Reportes';
import Pendientes from '../screens/Reportes/Pendientes';
import Completados from '../screens/Reportes/Completados';
import ReportesAl from '../screens/Reportes/ReportesAl';
import ReporteX from '../screens/Reportes/ReporteX';
//Alumnos
import Alumno from '../screens/Alumnos/Alumno';
import CAlumno from '../screens/Alumnos/CAlumno';
import RAlumno from '../screens/Alumnos/RAlumno';
import UAlumno from '../screens/Alumnos/UAlumno';
import DAlumno from '../screens/Alumnos/DAlumno';
//import AlumnoX from '../screens/AlumnoX';
//Técnicos
import Tecnicos from '../screens/Tecnicos/Tecnicos';
import CTecnico from '../screens/Tecnicos/CTecnico';
import UTecnico from '../screens/Tecnicos/UTecnico';
import DTecnico from '../screens/Tecnicos/DTecnico';
//Dispositivos
import Dispositivos from '../screens/Dispositivos/Dispositivos';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            {/*Principal*/}
            <Stack.Screen name="login" component={withPreventBack(Login)} />
            <Stack.Screen name="menu" component={withPreventBack(Menu)} />
            <Stack.Screen name="daccess" component={withPreventBack(DAccess)} />
            <Stack.Screen name="eaccess" component={withPreventBack(EAccess)} />
            {/*Reportes*/}
            <Stack.Screen name="reportes" component={withPreventBack(Reportes)} />
            <Stack.Screen name="pendientes" component={withPreventBack(Pendientes)} />
            <Stack.Screen name="completados" component={withPreventBack(Completados)} />
            <Stack.Screen name="reportesal" component={withPreventBack(ReportesAl)} />
            <Stack.Screen name="reportex" component={withPreventBack(ReporteX)} />
            <Stack.Screen name="creporte" component={withPreventBack(CReporte)} />
            {/*Alumnos*/}
            <Stack.Screen name="alumnos" component={withPreventBack(Alumno)} />
            <Stack.Screen name="calumno" component={withPreventBack(CAlumno)} />
            <Stack.Screen name="ralumno" component={withPreventBack(RAlumno)} />
            <Stack.Screen name="ualumno" component={withPreventBack(UAlumno)} />
            <Stack.Screen name="dalumno" component={withPreventBack(DAlumno)} />
            {/*Técnicos*/}
            <Stack.Screen name="tecnicos" component={withPreventBack(Tecnicos)} />
            <Stack.Screen name="ctecnico" component={withPreventBack(CTecnico)} />
            <Stack.Screen name="utecnico" component={withPreventBack(UTecnico)} />
            <Stack.Screen name="dtecnico" component={withPreventBack(DTecnico)} />
            {/*Dispositivos*/}
            <Stack.Screen name="dispositivos" component={withPreventBack(Dispositivos)} />
        </Stack.Navigator>
    );
}

function withPreventBack(Component) {
    return function Wrapped(props) {
        useEffect(() => {
            const nav = props.navigation;
            if (!nav || !nav.addListener) return;

            const unsubscribe = nav.addListener('beforeRemove', (e) => {
                // Only prevent 'GO_BACK' actions (system/hardware/gesture back)
                if (e.data?.action?.type === 'GO_BACK') {
                    e.preventDefault();
                }
            });

            return unsubscribe;
        }, [props.navigation]);

        return <Component {...props} />;
    };
}
/*
<Stack.Screen name="alumnox" component={AlumnoX} />
<Stack.Screen name="reportes" component={Reportes} />
*/
