import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function CreateReserva() {

  const [fecha_reserva, setFechaReserva] = useState("");
  const [hora_reserva, setHoraReserva] = useState("");
  const [cant_adultos, setCantAdultos] = useState(0);
  const [cant_niños, setCantNiños] = useState(0);
  const [motivo_reserva, setMotivoReserva] = useState("");
  const [clienteId, setClientId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [anticipo_required, setAnticipoRequired] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState([]);

  const [anticipo, setAnticipo] = useState(
    {
      monto_anticipo: 0,
      banco: "",
      moneda: "",
      fecha_anticipo: new Date().toISOString().split('T')[0], // Obtiene la fecha de hoy en formato YYYY-MM-DD
      estado_anticipo: ""
    }
  );

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await instance.get('/intimar/client', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setClientes(response.data.data);

        const userString = localStorage.getItem('user');

        const user = JSON.parse(userString);

        setUserId(user.id);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      if (!anticipo_required) {
        const response = await instance.post("/intimar/reserva",
          {
            fecha_reserva,
            hora_reserva,
            cant_adultos,
            cant_niños,
            motivo_reserva,
            clienteId,
            anticipo_required,
            userId
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          });
        toastr.success(response.data.message);
        console.log("Reserva creada:", response.data);
        setIsSubmitting(false);
      } else {
        const response = await instance.post("/intimar/reserva",
          {
            fecha_reserva,
            hora_reserva,
            cant_adultos,
            cant_niños,
            motivo_reserva,
            clienteId,
            userId,
            anticipo_required,
            anticipo
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          });
        toastr.success(response.data.message);
        console.log("Reserva creada:", response.data);
        setIsSubmitting(false);
      }
    } catch (error) {
      toastr.error(error.response.data.message);
      console.error("Error creating reserva:", error.response.data.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <Aside />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Registrar Reserva </h1>
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
              <div className="col-md-12">
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Ingrese los siguientes datos:</h3>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td>
                                <label htmlFor="clienteId">Cliente:</label>
                                <select
                                  className="form-control"
                                  id="clienteId"
                                  name="clienteId"
                                  value={clienteId}
                                  onChange={(e) => setClientId(Number(e.target.value))}
                                  required
                                >
                                  <option value="" disabled>
                                    Selecciona un cliente
                                  </option>
                                  {clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                      {`${cliente.name} ${cliente.lastname}`}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <label htmlFor="motivo_reserva">Motivo de la Reserva:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="motivo_reserva"
                                  value={motivo_reserva}
                                  onChange={(e) => setMotivoReserva((e.target.value))}
                                  required
                                />
                              </td>

                            </tr>
                            <tr>
                              <td>
                                <label htmlFor="cant_adultos">Cantidad de Adultos:</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="cant_adultos"
                                  value={cant_adultos}
                                  onChange={(e) => setCantAdultos(Number(e.target.value))}
                                  required
                                />
                              </td>
                              <td>
                                <label htmlFor="cant_niños">Cantidad de Niños:</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="cant_niños"
                                  value={cant_niños}
                                  onChange={(e) => setCantNiños(Number(e.target.value))}
                                  required
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <label htmlFor="fecha_reserva">Fecha Reserva:</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="fecha_reserva"
                                  value={fecha_reserva}
                                  onChange={(e) => setFechaReserva((e.target.value))}
                                  required
                                />
                              </td>
                              <td>
                                <label htmlFor="hora_reserva">Hora Reserva:</label>
                                <input
                                  type="time"
                                  className="form-control"
                                  id="hora_reserva"
                                  value={hora_reserva}
                                  onChange={(e) => setHoraReserva((e.target.value))}
                                  required
                                />
                              </td>
                            </tr>

                            <tr>
                              <tr>
                                <td colSpan="2">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="anticipo_required"
                                      checked={anticipo_required}
                                      onChange={(e) => setAnticipoRequired(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="anticipo_required">
                                      ¿Anticipo Requerido?
                                    </label>
                                  </div>
                                </td>
                              </tr>

                            </tr>
                            {anticipo_required && (
                              <tr>
                                <td colSpan="2">
                                  <label htmlFor="monto_anticipo">Monto Anticipo:</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="monto_anticipo"
                                    value={anticipo.monto_anticipo}
                                    onChange={(e) => setAnticipo({ ...anticipo, monto_anticipo: Number(e.target.value) })}
                                    required
                                  />
                                </td>
                              </tr>

                            )}
                            {anticipo_required && (
                              <tr>
                                <td colSpan="2">
                                  <label htmlFor="banco">Banco:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="banco"
                                    value={anticipo.banco}
                                    onChange={(e) => setAnticipo({ ...anticipo, banco: (e.target.value) })}
                                    required
                                  />
                                </td>
                              </tr>
                            )}
                            {anticipo_required && (
                              <tr>
                                <td colSpan="2">
                                  <label htmlFor="moneda">Moneda:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="moneda"
                                    value={anticipo.moneda}
                                    onChange={(e) => setAnticipo({ ...anticipo, moneda: (e.target.value) })}
                                    required
                                  />
                                </td>
                              </tr>
                            )}
                            {anticipo_required && (
                              <tr>
                                <td colSpan="2">
                                  <label htmlFor="estado_anticipo">Estado Anticipo:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="estado_anticipo"
                                    value={anticipo.estado_anticipo}
                                    onChange={(e) => setAnticipo({ ...anticipo, estado_anticipo: (e.target.value) })}
                                    required
                                  />
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Crear Reserva
                      </button>
                    </div>
                  </form>
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