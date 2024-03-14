import React, { useState } from "react";
import instance from "../../interceptors/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";


export default function CreateMesa() {
  const [mesaData, setMesaData] = useState({
    ubicacion_mesa: "",
    numero_mesa: "",
    estado_mesa: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMesaData({
      ...mesaData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance.post("/intimar/mesa", mesaData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Lógica adicional después de enviar la solicitud POST, si es necesario

    } catch (error) {
      console.error("Error al crear la mesa", error);
      // Manejo de errores, si es necesario
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
                <h1 className="m-0">Crear Mesa</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Inicio</a>
                  </li>
                  <li className="breadcrumb-item active">Mesas</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card card-default">
              <div className="card-header">
                <h3 className="card-title">Crear Mesa</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="ubicacion">Ubicación:</label>
                        <select
                          className="form-control"
                          id="ubicacion"
                          name="ubicacion_mesa"
                          value={mesaData.ubicacion_mesa}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Seleccione una ubicación</option>
                          <option value="Comedor">Comedor</option>
                          <option value="Terraza">Terraza</option>
                          {/* Agrega más opciones según sea necesario */}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="numero_mesa">Número de Mesa:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="numero_mesa"
                          placeholder="Ingrese el número de mesa"
                          name="numero_mesa"
                          value={mesaData.numero_mesa}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="estado_mesa">Estado de la Mesa:</label>
                        <input
                          type="checkbox"
                          className="form-control"
                          id="estado_mesa"
                          name="estado_mesa"
                          checked={mesaData.estado_mesa}
                          onChange={() =>
                            setMesaData({
                              ...mesaData,
                              estado_mesa: !mesaData.estado_mesa,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-success">
                      Crear Mesa
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
