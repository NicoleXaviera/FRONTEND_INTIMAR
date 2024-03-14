import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Link } from "react-router-dom";

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function ListadoCliente() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const [view, setView] = useState("cards");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem("access_token") === null) {
          window.location.href = "/login";
        } else {
          const { data } = await instance.get("/intimar/client", {
            headers: {
              "Content-Type": "application/json",
            },
          });
          setClients(data.data);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchData();
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

        const client = response.data.clients[0];

        if (client) {
            setClients(client); 
        } else {
            setClients([]);
            toastr.warning(`No hay resultado para el cliente ${searchValue}`);
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
                      <div className="col-md-6">
                        <Link to="/cliente/create" className="btn btn-success mb-3">
                          Agregar Cliente
                        </Link>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group">
                          <input
                            type="search"
                            className="form-control form-control-lg"
                            value={searchValue}
                            onChange={handleInputChange}
                          />
                          <div className="input-group-append">
                            <button className="btn btn-lg btn-default" onClick={handleSearch}>
                              <i className="fa fa-search" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opciones de Vista */}
                  <div className="d-flex justify-content-end mb-2">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn btn-${view === "cards" ? "primary" : "light"}`}
                        onClick={() => toggleView("cards")}
                      >
                        Tarjetas
                      </button>
                      <button
                        type="button"
                        className={`btn btn-${view === "table" ? "primary" : "light"}`}
                        onClick={() => toggleView("table")}
                      >
                        Tabla
                      </button>
                    </div>
                  </div>

                  {/* Contenido según la Vista seleccionada */}
                  {/* TARJETA */}
                  {view === "cards" && (
                    <section className="content">
                      <div className="card card-solid">
                        <div className="card-body pb-0">
                          <div className="row">
                            {clients.map((client) => (
                              <div
                                className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
                                key={client.id}
                              >
                                <div className="card bg-light d-flex flex-fill">
                                  <br></br>
                                  <div className="card-body pt-0">
                                    <div className="row">
                                      <div className="col-7">
                                        <h2 className="lead" style={{ fontWeight: "bold" }}>
                                          <b>{`${client.name} ${client.lastname}`}</b>
                                        </h2>
                                        <ul className="ml-4 mb-0 fa-ul text-muted">
                                          <li className="medium" style={{ padding: "0.1rem" }}>
                                            <span className="fa-li">
                                              <i className="fas fa-lg fa-envelope" />
                                            </span>
                                            {`${client.email}`}
                                          </li>
                                          <li className="medium" style={{ padding: "0.1rem" }}>
                                            <span className="fa-li">
                                              <i className="fas fa-lg fa-building" />
                                            </span>
                                            {`${client.address}`}
                                          </li>
                                          <li className="medium" style={{ padding: "0.1rem" }}>
                                            <span className="fa-li">
                                              <i className="fas fa-lg fa-phone" />
                                            </span>{" "}
                                            {`${client.cellphone}`}
                                          </li>
                                          <li className="medium" style={{ padding: "0.1rem" }}>
                                            {" "}
                                            Alergias :{" "}
                                            {`${client.allergies == null ? "No hay alergias" : client.allergies}`}
                                          </li>
                                          <li className="medium" style={{ padding: "0.1rem" }}>
                                            {" "}
                                            Edad : {`${client.age}`}
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="col-5 text-center">
                                        <img src="../../dist/img/user1-128x128.jpg" alt="user-avatar" className="img-circle img-fluid" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="card-footer">
                                    <div className="text-right">
                                      <a href="/" className="btn btn-sm bg-teal">
                                        <i className="fas fa-comments" />
                                      </a>
                                      <a href="/" className="btn btn-sm btn-primary">
                                        <i className="fas fa-user" /> Ver detalles
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

                  {/* TABLA */}
                  {view === "table" && (
                    <section className="content">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Lista de Clientes</h3>
                        </div>
                        <div className="card-body">
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Correo Electrónico</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {clients.map((client) => (
                                <tr key={client.id}>
                                  <td>{`${client.name} ${client.lastname}`}</td>
                                  <td>{client.email}</td>
                                  <td>{client.address}</td>
                                  <td>{client.cellphone}</td>
                                  <td>
                                    <button
                                      className="btn btn-warning btn-sm mr-2"
                                      onClick={() => handleEdit(client.id)}
                                    >
                                      Editar
                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        // onClick={() => handleDelete(client.name)}
                                                        onClick={() => handleDelete(client.id, `${client.name} ${client.lastname}`)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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