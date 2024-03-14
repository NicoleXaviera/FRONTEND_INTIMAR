import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../interceptors/axios";
import Countdown from "react-countdown";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import mesaImagen from "../img/mesa-imagen.png";

export default function ListadoCliente() {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [view, setView] = useState("cards");

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const { data } = await instance.get("/intimar/mesa", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setMesas(data.data);
      } catch (e) {
        console.log(e, "not auth");
      }
    };

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

    fetchMesas();
    fetchReservas();
  }, []);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {
    try {
      if (!searchValue) {
        return;
      }

      const response = await instance.post("/intimar/client/findByName", {
        name: searchValue,
      });

      const client = response.data.clients[0];

      if (client) {
        const reservasData = await instance.post("/intimar/reserva/clientId", {
          clientId: client.id,
        });

        setReservas(reservasData.data.data);
      } else {
        setReservas([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleAdd = () => {
    navigate(`/reserva/create/`);
  };

  const handleEdit = (id) => {
    navigate(`/reserva/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete reservation with ID: ${id}`);
  };

  const toggleView = (newView) => {
    setView(newView);
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
                <h1 className="m-0">Listado de Asignacion de Mesas</h1>
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
                  <div className="row align-items-center">
                    <div className="col-md-12 mb-3 d-flex justify-content-between">
                      <Link to="/asignarMesa/create" className="btn btn-success">
                        Asignar Mesa
                      </Link>
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
                  </div>
                </div>


                  {/* Contenido según la Vista seleccionada */}
                  {/* TARJETA */}
                  {view === "cards" && (
        <section className="content">
        <div className="card card-solid">
          <div className="card-body pb-0">
            <div className="row">
              {mesas.map((mesa) => (
                <div
                  className="col-12 col-sm-6 col-md-3 d-flex align-items-stretch flex-column"
                  key={mesa.id}
                >
                  <div className="card bg-light d-flex flex-fill">
                    <img
                      src={mesa.imagen_url || mesaImagen}
                      alt={`Mesa #${mesa.numero_mesa}`}
                      className="img-fluid"
                    />
                    <div className="card-body pt-0">
                      <div className="row">
                        <div className="col-7">
                          <h2 className="lead" style={{ fontWeight: "bold" }}>
                            <b>{`Mesa #${mesa.numero_mesa}`}</b>
                          </h2>
                          <ul className="ml-4 mb-0 fa-ul text-muted">
                            <li className="medium" style={{ padding: "0.1rem" }}>
                              <span className="fa-li">
                                <i className="fas fa-lg fa-map-marker-alt" />
                              </span>
                              {`${mesa.ubicacion_mesa}`}
                            </li>
                            <li className="medium" style={{ padding: "0.1rem" }}>
                              <span className="fa-li">
                                <i className="fas fa-lg fa-check-circle" />
                              </span>
                              {`${mesa.estado_mesa ? "Disponible" : "No disponible"}`}
                            </li>
                          </ul>
                          {mesa.estado_mesa ? (
                            <Link
                              to="/asignarMesa/create"
                              className="btn btn-sm bg-teal"
                            >
                              <i className="fas fa-info-circle" /> Asignar
                            </Link>
                          ) : (
                            <div className="text-muted">
                              <p className="mb-1">Estará disponible en:</p>
                              <Countdown
                                date={Date.now() + 90 * 60 * 1000} 
                                renderer={({ hours, minutes, seconds }) => (
                                  <p className="mb-0">{`${hours}:${minutes}:${seconds}`}</p>
                                )}
                              />
                            </div>
                          )}
                        </div>
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
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-12">
                            <div className="card">
                            <div className="col-md-6">
                              {/* Barra buscar */}
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
                                {/* TABLA */}
                              <div className="card-body">
                                <table className="table table-bordered table-striped">
                                  <thead>
                                    <tr>
                                      <th>ID de Reserva</th>
                                      <th>Nombre del cliente</th>
                                      <th>Fecha de reserva</th>
                                      <th>Hora de Reserva</th>
                                      <th>Hora de llegada</th>
                                      <th>Hora de salida</th>
                                      <th>Cantidad de adultos</th>
                                      <th>Cantidad de niños</th>
                                      <th>Estado de reserva</th>
                                      <th>Mesa Asignada</th>
                                      <th>Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {reservas.map((reserva) => {
                                      const cliente = reserva.client;
                                      const mesaAsignada =
                                        reserva.mesas.length > 0
                                          ? reserva.mesas[0].numero_mesa
                                          : "----";
                                      return (
                                        <tr key={reserva.id}>
                                          <td>{reserva.id}</td>
                                          <td>
                                            {cliente
                                              ? `${cliente.name} ${cliente.lastname}`
                                              : "Cliente no disponible"}
                                          </td>
                                          <td>{reserva.fecha_reserva}</td>
                                          <td>{reserva.hora_reserva}</td>
                                          <td>
                                            {reserva.hora_llegada == null
                                              ? "----"
                                              : reserva.hora_llegada}
                                          </td>
                                          <td>
                                            {reserva.hora_salida == null
                                              ? "----"
                                              : reserva.hora_salida}
                                          </td>
                                          <td>{reserva.cant_adultos}</td>
                                          <td>{reserva.cant_niños}</td>
                                          <td>{reserva.estado_reserva}</td>
                                          <td>{mesaAsignada}</td>
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
