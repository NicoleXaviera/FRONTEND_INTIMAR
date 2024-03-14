import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import Swal from "sweetalert2";
import toastr from 'toastr';
import DatePicker from "react-datepicker"; 

import "react-datepicker/dist/react-datepicker.css";
import "toastr/build/toastr.css"; 

import '../../styles/ListadoReserva.css'; 

export default function ListadoReserva() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [title, setTitle] = useState("Reservas");
    const [searchValue, setSearchValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const componentPDF = useRef();

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                if (localStorage.getItem("access_token")) {
                    const { data } = await instance.get("/intimar/reserva", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setReservas(data.data);
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error fetching reservas:", error);
            }
        };
        fetchReservas();
    }, []);

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (!searchValue) {
                // Si la barra de búsqueda está vacía, mostrar la lista completa
                const { data } = await instance.get("/intimar/reserva", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setReservas(data.data);
                setTitle("Reservas");
                return;
            }

            const response = await instance.post("/intimar/client/findByName", {
                name: searchValue
            });

            const client = response.data.clients[0];

            if (client) {
                const reservasData = await instance.post("/intimar/reserva/clientId", {
                    clientId: client.id
                });

                setReservas(reservasData.data.data);
                setTitle(`Resultados por nombre o apellido del cliente`);
            } else {
                setReservas([]);
                setTitle(`No hay resultado para el cliente ${searchValue}`);
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSearchByDate = async () => {
        try {
            if (!selectedDate) {
                return;
            }

            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await instance.post("/intimar/reserva/fecha", {
                fecha: formattedDate
            });

            setReservas(response.data.data);
            setTitle(`Resultados por fecha de reserva: ${formattedDate}`);
        } catch (error) {
            console.error("Error during search by date:", error);
            console.log("Detalles del error:", error.response.data);
        }
    };

    const handleAdd = () => {
        navigate(`/reserva/create/`);
    };

    const handleEdit = (reservaId) => {
        navigate(`/reserva/edit/${reservaId}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro de eliminar la reserva?',
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
                await instance.delete('/intimar/reserva', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: { id: id },
                });

                const updatedReservas = reservas.filter(reserva => reserva.id !== id);
                setReservas(updatedReservas);
                toastr.success('Reserva eliminada exitosamente');
            } catch (error) {
                toastr.error('Error al eliminar la reserva');
                console.error("Error deleting reserva:", error);
            }
        }
    };

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };

    return (
        <div className="wrapper">
            <Navbar />
            <Aside />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Administrador de Reservas</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Reservas</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content" ref={componentPDF}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button className="btn btn-success" onClick={handleAdd}>
                                                    Agregar Reserva
                                                </button>
                                            </div>
                                            <div className="col-md-6">
    <div className="row">
        <div className="col-md-6 mb-2">
            <div className="input-group">
                <input
                    type="search"
                    className="form-control form-control-lg"
                    placeholder="Buscar por nombre"
                    value={searchValue}
                    onChange={handleInputChange}
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-lg btn-default"
                        onClick={handleSearch}
                    >
                        <i className="fa fa-search" />
                    </button>
                </div>
            </div>
        </div>
        <div className="col-md-6 mb-2">
            <div className="input-group">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="form-control form-control-lg"
                    placeholderText="Buscar por fecha"
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-lg btn-default"
                        onClick={handleSearchByDate}
                    >
                        <i className="fa fa-search" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nombre del cliente</th>
                                                    <th>Fecha de reserva</th>
                                                    <th>Hora de salida</th>
                                                    <th>Cantidad de adultos</th>
                                                    <th>Cantidad de niños</th>
                                                    <th>Estado de reserva</th>
                                                    <th>Motivo de reserva</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reservas && reservas.map((reserva, index) => {
                                                    const cliente = reserva.client;
                                                    const isRowSelected = index === selectedRow;

                                                    return (
                                                        <tr
                                                            key={reserva.id}
                                                            className={isRowSelected ? 'selected-row' : ''}
                                                            onClick={() => handleRowClick(index)}
                                                        >
                                                            <td>{cliente ? `${cliente.name} ${cliente.lastname}` : 'Cliente no disponible'}</td>
                                                            <td>{reserva.fecha_reserva}</td>
                                                            <td>{reserva.hora_reserva}</td>
                                                            <td>{reserva.cant_adultos}</td>
                                                            <td>{reserva.cant_niños}</td>
                                                            <td>
                                                                <span className={`badge ${reserva.estado_reserva.toLowerCase() === 'confirmada' ? 'bg-success' : (reserva.estado_reserva === 'Cancelada' ? 'bg-danger' : 'bg-warning')}`}>
                                                                    {reserva.estado_reserva}
                                                                </span>
                                                            </td>
                                                            <td>{reserva.motivo_reserva}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-warning btn-sm mr-2"
                                                                    onClick={() => handleEdit(reserva.id)}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDelete(reserva.id)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
