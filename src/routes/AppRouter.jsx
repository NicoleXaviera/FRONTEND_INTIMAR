import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from '../pages/Home.js';
import Login from '../components/Login.js'
import Logout from '../components/Logout.js'
import NotFound from '../components/NotFound.js'

import ListadoEmpleado from '../components/empleados/ListadoEmpleado.jsx';
import CreateEmpleado from '../components/empleados/CreateEmpleado.jsx';
import EditEmpleado from '../components/empleados/EditEmpleado.jsx';

import ListadoCliente from '../components/clientes/ListadoCliente.jsx';
import CreateCliente from '../components/clientes/CreateCliente.jsx';
import EditCliente from '../components/clientes/EditCliente.jsx';

import ListadoMesa from '../components/mesas/ListadoMesa.jsx';
import CreateMesa from '../components/mesas/CreateMesa.jsx';

import ListadoReserva from '../components/reservas/ListadoReserva.jsx';
import CreateReserva from '../components/reservas/CreateReserva.jsx';
import EditReserva from '../components/reservas/EditReserva.jsx';

import ReservaReports from "../components/reportes/ReservaReport.js";
import ClientReport from "../components/reportes/ClientReport";

import Configuracion from "../components/reportes/Configuracion.jsx";

import ListadoAsignarMesa from '../components/asignarMesa/ListadoReservaAsignarMesa.jsx';
import CreateAsignarMesa from '../components/asignarMesa/CreateReservaAsignarMesa.jsx';

import Calendar from "../components/graficas/Calendar.jsx";

import ReservasPorMeses from "../components/graficas/ReservaPorMeses.jsx";
import Consultas from "../components/consultas/Consulta.jsx";


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path='*' exact={true} element={ <NotFound/> } />
                
                <Route path="/empleado" element={<ListadoEmpleado />} />
                <Route path="/empleado/create" element={<CreateEmpleado />} />
                <Route path="/empleado/edit/:id" element={<EditEmpleado />} />

                <Route path="/cliente" element={<ListadoCliente />} />
                <Route path="/cliente/create" element={<CreateCliente />} />
                <Route path="/cliente/edit/:id" element={<EditCliente />} />

                <Route path="/mesa" element={<ListadoMesa />} />
                <Route path="/mesa/create" element={<CreateMesa />} />


                <Route path="/reserva" element={<ListadoReserva />} />
                <Route path="/reserva/create" element={<CreateReserva />} />
                <Route path="/reserva/edit/:id" element={<EditReserva />} />

                 <Route path="/reserva/reporte" element={<ReservaReports/>}/> 
                 <Route path="/cliente/reporte" element={<ClientReport/>}/> 

                <Route path="/asignarMesa" element={<ListadoAsignarMesa />} />
                <Route path="/asignarMesa/create" element={<CreateAsignarMesa />} />

                <Route path="/calendar" element={<Calendar />} />
                <Route path="/grafica/ReservasPorMeses" element={<ReservasPorMeses />} />
                <Route path="/consultas" element={<Consultas />} />

                <Route path="/configuracion" element={<Configuracion/>}/> 
                
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;