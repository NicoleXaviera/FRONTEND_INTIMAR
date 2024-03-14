import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

export default function ListadoEmpleado() {
    const [employees, setEmployees] = useState([]);
    const componentPDF = useRef();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                if (localStorage.getItem("access_token")) {
                    const { data } = await instance.get("/intimar/employee", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setEmployees(data.data);
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
        fetchEmployees();
    }, []);

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Clients",
    });

    const deleteEmployee = async (employeeId) => {
        // Utilizar SweetAlert para mostrar un mensaje de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminarlo'
        });

        if (result.isConfirmed) {
            try {
                await instance.delete('/intimar/employee', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: { id: employeeId },
                });

                const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
                setEmployees(updatedEmployees);
                toastr.success('Empleado eliminado exitosamente');
            } catch (error) {
                toastr.error('Error al eliminar el empleado');
                console.error("Error deleting employee:", error);
            }
        }
    };


    return (
        <div className="wrapper">
            <Navbar />
            <Aside />
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Lista de empleados</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item active">Registro de empleados</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="content" ref={componentPDF}>
                    <div className="card card-solid">
                        <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                            {/* Botón para ir a la ruta /employees/register */}
                            <Link to="/empleado/create" className="btn btn-primary">
                                Registrar Empleado
                            </Link>
                            </div>
                            <div className="col-md-6 text-right">
                            <button className="btn btn-success" onClick={generatePDF}>
                                PDF
                            </button>
                            </div>
                        </div>
                        </div>
                        <div className="card-body pb-0">
                        <div className="row">
                            {employees.map((employee) => (
                            <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column" key={employee.id}>
                                <div className="card bg-light d-flex flex-fill">
                                <div className="card-header text-muted border-bottom-0">
                                    Empleado
                                </div>
                                <div className="card-body pt-0">
                                    <div className="row">
                                    <div className="col-7">
                                        <h2 className="lead" style={{ fontWeight: "bold" }}><b>{`${employee.name} ${employee.lastname}`}</b></h2>
                                        <ul className="ml-4 mb-0 fa-ul text-muted">
                                        <li className="medium" style={{ padding: "0.1rem" }}><span className="fa-li"><i className="fas fa-lg fa-envelope" /></span>{`${employee.email}`}</li>
                                        <li className="medium" style={{ padding: "0.1rem" }}><span className="fa-li"><i className="fas fa-lg fa-phone" /></span> {`${employee.cellphone}`}</li>
                                        </ul>
                                    </div>
                                    <div className="col-5 text-center">
                                        <img src="../../dist/img/user1-128x128.jpg" alt="user-avatar" className="img-circle img-fluid" />
                                    </div>
                                    <div className="col-12">
                                        <strong>Roles:</strong>
                                        <ul>
                                        {employee.roles.map((role, index) => (
                                            <li key={index}>{role.name}</li>
                                        ))}
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="text-right">
                                    {/* Botón de eliminación con función onClick */}
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(employee.id)}>
                                        Eliminar
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </section>
            </div>

            <Footer />
        </div>
    )
}