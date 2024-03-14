import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

const Configuracion = () => {
  const [configuracion, setConfiguracion] = useState({});

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          const response = await instance.get("/intimar/configuracion", {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const config = response.data.data;
          setConfiguracion(config);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, []);

  return (
    <div className="wrapper">
      <Navbar />
      <Aside />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Configuración</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Configuración</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Aforo</th>
                          <th scope="col">Duración de Reserva (horas)</th>
                          <th scope="col">Hora Mínima</th>
                          <th scope="col">Hora Máxima</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{configuracion.aforo !== undefined && configuracion.aforo !== null ? configuracion.aforo : 'N/A'}</td>
                          <td>{configuracion.duracion_reserva !== undefined && configuracion.duracion_reserva !== null ? configuracion.duracion_reserva : 'N/A'}</td>
                          <td>{configuracion.hora_min !== undefined && configuracion.hora_min !== null ? configuracion.hora_min : 'N/A'}</td>
                          <td>{configuracion.hora_max !== undefined && configuracion.hora_max !== null ? configuracion.hora_max : 'N/A'}</td>
                        </tr>
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Configuracion;
