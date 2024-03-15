import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function ListadoCliente() {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();
    const [view, setView] = useState("cards");
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (localStorage.getItem("access_token") === null) {
            window.location.href = "/login";
        } else {
            (async () => {
                try {
                    const { data } = await instance.get("/intimar/client", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setClients(data.data);
                } catch (e) {
                    console.log(e, "not auth");
                }
            })();
        }
    }, []);

    const toggleView = (newView) => {
        setView(newView);
    };

    const handleEdit = (clientId) => {
        navigate(`/cliente/edit/${clientId}`); 
    };

    const handleDelete = async (clientId, clientName) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, eliminarlo",
        });

        if (result.isConfirmed) {
            try {
                await instance.delete(`/intimar/client`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { id: clientId },
                });

                // Actualizamos al eliminar
                const updatedClients = clients.filter(
                    (client) => client.id !== clientId
                );
                setClients(updatedClients);

                toastr.success("Cliente eliminado exitosamente");
            } catch (error) {
                toastr.error("Error al eliminar el cliente");
                console.error("Error deleting client:", error);
            }
        }
    };

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (!searchValue) {
                return;
            }

            const response = await instance.post("/intimar/client/findByName", {
                name: searchValue
            });

            const searchResult = response.data.clients;

            if (Array.isArray(searchResult) && searchResult.length > 0) {
                // Si hay resultados de la búsqueda
                setClients(searchResult);
            } else {
                // Si no hay resultados o el resultado no es un array
                setClients([]);
                toastr.warning(`No se encontró ningún cliente con el nombre: ${searchValue}`);
            }
        } catch (error) {
            console.error("Error during search:", error);
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
                                <h1 className="m-0">Administración de clientes </h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    
                                    <li className="breadcrumb-item active">Clientes</li>
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
                                            <div className="col-12 col-sm-3 col-md-4 d-flex align-items-stretch flex-column mt-2">
                                                <div className="btn-group " role="group">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-${view === "cards" ? "custom-orange" : "light"}`}
                                                        onClick={() => toggleView("cards")}
                                                        style={{ backgroundColor: view === "cards" ? "rgb(227, 111, 30)" : "", color: view === "cards" ? "white" : "" }}
                                                    >
                                                        Tarjetas
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-${view === "table" ? "custom-orange" : "light"}`}
                                                        onClick={() => toggleView("table")}
                                                        style={{ backgroundColor: view === "table" ? "rgb(227, 111, 30)" : "", color: view === "table" ? "white" : "" }}
                                                    >
                                                        Tabla
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-8 mt-2">
                                                <div className="input-group">
                                                    <input
                                                        type="search"
                                                        className="form-control form-control-lg"
                                                        value={searchValue}
                                                        onChange={handleInputChange}
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-lg btn-default mr-4" onClick={handleSearch}>
                                                            <i className="fa fa-search" />
                                                        </button>
                                                        <Link to="/cliente/create" className="btn btn-success mb-8">
                                                            Agregar Cliente
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {view === "cards" && (
                                        <section className="content">
                                            <div className="card card-solid">
                                                <div className="card-body pb-0">
                                                    <div className="row">
                                                        {clients.map((client) => (
                                                            <div
                                                                className="col-6 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
                                                                key={client.id}
                                                            >
                                                                <div className="card bg-light d-flex flex-fill">
                                                                    <br></br>
                                                                    <div className="card-body pt-0">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <h2 className="lead" style={{fontWeight: "bold"}}><b>{`${client.name} ${client.lastname}`}</b></h2>
                                                                                <ul className="ml-4 mb-0 fa-ul text-muted">
                                                                                    <li className="medium" style={{padding: "0.1rem"}}><span className="fa-li"><i className="fas fa-lg fa-envelope" /></span>{`${client.email}`}</li>
                                                                                    <li className="medium" style={{padding: "0.1rem"}}><span className="fa-li"><i className="fas fa-lg fa-phone" /></span> {`${client.cellphone}`}</li>
                                                                                    <li className="medium" style={{padding: "0.1rem"}}><span className="fa-li"> <i className="fas fa-lg fa-exclamation-circle" /></span>  Alergias : {`${client.allergies == null ? "No hay alergias":client.allergies}`}</li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-footer">
                                                                        <div className="text-right">
                                                                            <a href="/" className="btn btn-sm" style={{ backgroundColor: 'rgb(0, 147, 144)', color: 'white' }} onClick={() => handleEdit(client.id)}>
                                                                                <i className="fas fa-user"/> Ver detalles
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {view === "table" && (
                                        <section className="content">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h3 className="card-title">Lista de Clientes</h3>
                                                </div>
                                                <div className="card-body">
                                                    <div className="table-responsive">
                                                        {clients.length > 0 ? (
                                                            <table className="table table-bordered table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Nombre</th>
                                                                        <th>Correo Electrónico</th>
                                                                        <th>Teléfono</th>
                                                                        <th>Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {clients.map((client) => (
                                                                        <tr key={client.id}>
                                                                            <td>{client.id}</td>
                                                                            <td>{`${client.name} ${client.lastname}`}</td>
                                                                            <td>{client.email}</td>
                                                                            <td>{client.cellphone}</td>
                                                                            <td>
                                                                                <button
                                                                                    className="btn btn-info btn-sm mr-2"
                                                                                    onClick={() => handleEdit(client.name)} 
                                                                                >
                                                                                    Editar
                                                                                </button>
                                                                                <button
                                                                                    className="btn btn-danger btn-sm"
                                                                                    onClick={() => handleDelete(client.id)}
                                                                                >
                                                                                    Eliminar
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <p>No se encontraron clientes con el nombre: {searchValue}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}

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
