import React, { useState, useEffect, useRef } from "react";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toastr from 'toastr';

export default function ListadoReserva() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState(null);
    const [title, setTitle] = useState("Reservas");
    const [searchValue, setSearchValue] = useState('');
    const [dateSearch, setDateSearch] = useState('');

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

    const handleDateSearchChange = (event) => {
        setDateSearch(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const searchParams = {};

            if (searchValue) {
                const response = await instance.post("/intimar/client/findByName", {
                    name: searchValue
                });

                const client = response.data.clients[0];

                if (client) {
                    searchParams.clientId = client.id;
                } else {
                    setReservas([]);
                    setTitle(`No hay resultado para el cliente ${searchValue}`);
                    return;
                }
            }

            if (dateSearch) {
                searchParams.date = dateSearch;
            }

            const reservasData = await instance.post("/intimar/reserva/search", searchParams);
            setReservas(reservasData.data.data);
            setTitle(`Resultados de la búsqueda`);
        } catch (error) {
            console.error("Error during search:", error);
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
                <section className="content">
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
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="search"
                                                        className="form-control"
                                                        placeholder="Buscar por nombre"
                                                        value={searchValue}
                                                        onChange={handleInputChange}
                                                    />
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        placeholder="Buscar por fecha"
                                                        value={dateSearch}
                                                        onChange={handleDateSearchChange}
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                                                            <i className="fa fa-search" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {reservas !== null ? (
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
                                                    {reservas.map((reserva) => {
                                                        const cliente = reserva.client;
                                                        return (
                                                            <tr key={reserva.id}>
                                                                <td>{cliente ? `${cliente.name} ${cliente.lastname}` : 'Cliente no disponible'}</td>
                                                                <td>{reserva.fecha_reserva}</td>
                                                                <td>{reserva.hora_salida}</td>
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
                                        ) : (
                                            <p>Cargando reservas...</p>
                                        )}
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
