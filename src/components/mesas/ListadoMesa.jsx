import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import mesaImagen from "../img/mesa-imagen.png";

export default function ListadoMesas() {
  const [mesas, setMesas] = useState([]);
  const [view, setView] = useState("cards");

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
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
      })();
    }
  }, []);

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
                <h1 className="m-0">Listado de Mesas</h1>
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
                                {/* <span className="fa-li">
                                    <i className="fas fa-lg fa-check-circle" />
                                </span>
                                {`${mesa.estado_mesa ? "Disponible" : "No disponible"}`} */}
                                </li>
                            </ul>
                            </div>
                        </div>
                        </div>
                        <div className="card-footer">
                        {/* <div className="text-right">
                         <a
                            href="/"
                            className={`btn btn-sm bg-teal ${mesa.estado_mesa ? "" : "disabled"}`}
                            disabled={!mesa.estado_mesa}
                          >
                            <i className="fas fa-info-circle" /> Reservar
                          </a>
                        </div> */}
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
                <h3 className="card-title">Lista de Mesas</h3>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mesas.map((mesa) => (
                      <tr key={mesa.id}>
                        <td>{mesa.numero_mesa}</td>
                        <td>{mesa.ubicacion_mesa}</td>
                        <td>{mesa.estado_mesa ? "Disponible" : "No disponible"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
