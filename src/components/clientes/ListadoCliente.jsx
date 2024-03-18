import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function ListadoCliente() {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();
    const [view, setView] = useState("table"); // Cambiado a "table"
    const [searchValue, setSearchValue] = useState("");
    const [clientCount, setClientCount] = useState(0);
    const [idFilter, setIdFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [phoneFilter, setPhoneFilter] = useState("");
    const [resetClients, setResetClients] = useState(false); // Estado para reinicializar clientes
    const [selectedRow, setSelectedRow] = useState(null);

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
                    setClientCount(data.data.length);
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
                setResetClients(true); // Activar reinicialización
                toastr.warning(`No se encontró ningún cliente con el nombre: ${searchValue}`);
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Lista de Clientes", 10, 10);
        doc.setFontSize(12);
        clients.forEach((client, index) => {
            const yOffset = index * 10 + 20;
            doc.text(`${client.name} ${client.lastname}, Email: ${client.email}, Teléfono: ${client.cellphone}`, 10, yOffset);
        });
        doc.save("lista_clientes.pdf");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(clients);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
        XLSX.writeFile(workbook, "lista_clientes.xlsx");
    };

    // Función para reinicializar los clientes
    const resetClientsList = () => {
        setResetClients(false); // Desactivar reinicialización
        setSearchValue(""); // Limpiar el campo de búsqueda
        setClients([]); // Vaciar la lista de clientes
    };

    // Función para filtrar clientes
    const filteredClients = resetClients ? clients : clients.filter((client) =>
        client.id.toString().includes(idFilter.toString()) &&
        client.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        client.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        client.cellphone.includes(phoneFilter)
    );

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
                                    <div className="card-header bg-light">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="card-title">
                                                Lista de Clientes{" "}
                                                <span className="font-weight-bold" style={{ color: "#333" }}>
                                                    ({clientCount} clientes)
                                                </span>
                                            </h3>
                                            <div className="dropdown">
                                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fas fa-cogs"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" style={{ maxWidth: "200px" }}>
                                                    <button className="dropdown-item" onClick={generatePDF}>Generar PDF</button>
                                                    <button className="dropdown-item" onClick={exportToExcel}>Exportar como Excel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 col-sm-3 col-md-4 d-flex align-items-stretch flex-column mt-2">
                                                <div className="btn-group " role="group">
                                                <button
                                                        type="button"
                                                        className={`btn btn-${view === "table" ? "custom-orange" : "light"}`}
                                                        onClick={() => toggleView("table")}
                                                        style={{ backgroundColor: view === "table" ? "rgb(227, 111, 30)" : "", color: view === "table" ? "white" : "" }}
                                                    >
                                                        Tabla
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-${view === "cards" ? "custom-orange" : "light"}`}
                                                        onClick={() => toggleView("cards")}
                                                        style={{ backgroundColor: view === "cards" ? "rgb(227, 111, 30)" : "", color: view === "cards" ? "white" : "" }}
                                                    >
                                                        Tarjetas
                                                    </button>

                                                </div>
                                            </div>
                                            <div className="col-md-8 col-sm-9 mt-2 d-flex justify-content-end">
                                                <Link to="/cliente/create" className="btn btn-success">
                                                    Agregar Cliente
                                                </Link>
                                            </div>
                                        </div>
                                    </div>


                                    {view === "table" && (
                                        <section className="content">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="table-responsive">
                                                        {clients.length > 0 ? (
                                                            <table className="table table-bordered table-striped">
                                                                <tbody>
                                                                    <tr>
                                                                        <th>
                                                                            ID <br />
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={idFilter}
                                                                                onChange={(e) => setIdFilter(e.target.value)}
                                                                            />
                                                                        </th>
                                                                        <th>
                                                                            Nombre <br />
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={nameFilter}
                                                                                onChange={(e) => setNameFilter(e.target.value)}
                                                                                style={{width: "150px", height: "calc(2.25rem + 1px)",}} 
                                                                            />
                                                                        </th>
                                                                        <th>
                                                                            Correo Electrónico <br />
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={emailFilter}
                                                                                onChange={(e) => setEmailFilter(e.target.value)}
                                                                                style={{width: "200px"}} 
                                                                            />
                                                                        </th>
                                                                        <th>
                                                                            Teléfono <br />
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={phoneFilter}
                                                                                onChange={(e) => setPhoneFilter(e.target.value)}
                                                                                style={{width: "150px"}} 
                                                                            />
                                                                        </th>
                                                                        <th>
                                                                            Acciones
                                                                        </th>
                                                                    </tr>
                                                                    {filteredClients.map((client) => (
                                                                        <tr
                                                                            key={client.id}
                                                                            style={{
                                                                                backgroundColor: selectedRow === client.id ? '#e8e8e8' : 'white', // Cambiar el color de fondo cuando está seleccionada
                                                                                cursor: 'pointer' // Cambiar el cursor al pasar sobre la fila
                                                                            }}
                                                                            onClick={() => setSelectedRow(client.id)} // Actualizar el estado al hacer clic en la fila
                                                                        >
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
                                                                                    className="btn btn-danger btn-sm mt-2"
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

                                    {view === "cards" && (
                                        <section className="content">
                                        <div className="card card-solid">
                                            <div className="col-6 col-sm-12 col-md-9 d-flex align-items-stretch flex-column mt-4">
                                                <div className="input-group">
                                                    <input
                                                        type="search"
                                                        className="form-control"
                                                        placeholder="Buscar por nombre"
                                                        value={searchValue}
                                                        onChange={handleInputChange}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleSearch();
                                                            }
                                                        }}
                                                        style={{height: "calc(2.25rem + 2px)", width: "250px"}} // Establecer la misma altura que el botón y ajustar el ancho
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-lg btn-default d-flex align-items-center justify-content-center" onClick={handleSearch} style={{height: "calc(2.25rem + 2px)"}}>
                                                            <i className="fa fa-search" />
                                                        </button>
                                                        {searchValue && (
                                                <div className="col-12 mt-0 d-flex justify-content-end">
                                                    <a href="/cliente/" className="btn btn-link" onClick={resetClientsList}>Reinicializar</a>
                                                </div>
                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body pb-0">
                                                <div className="row">
                                                    {filteredClients.map((client) => (
                                                        <div
                                                            className="col-6 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
                                                            key={client.id}
                                                        >
                                                            <div className="card bg-light d-flex flex-fill mb-3">
                                                                <div className="card-body pt-0">
                                                                    <h2 className="lead" style={{ fontWeight: "bold" }}>
                                                                        <b>{`${client.name} ${client.lastname}`}</b>
                                                                    </h2>
                                                                    <ul className="list-unstyled">
                                                                        <li className="medium">
                                                                            <i className="fas fa-envelope mr-1" />
                                                                            {`${client.email}`}
                                                                        </li>
                                                                        <li className="medium">
                                                                            <i className="fas fa-phone mr-1" />
                                                                            {`${client.cellphone}`}
                                                                        </li>
                                                                        <li className="medium">
                                                                            <i className="fas fa-exclamation-circle mr-1" />
                                                                            Alergias: {`${client.allergies == null ? "No hay alergias" : client.allergies}`}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="card-footer">
                                                                    <div className="text-right">
                                                                        <button className="btn btn-sm" style={{ backgroundColor: 'rgb(0, 147, 144)', color: 'white' }} onClick={() => handleEdit(client.id)}>
                                                                            <i className="fas fa-user" /> Ver detalles
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
