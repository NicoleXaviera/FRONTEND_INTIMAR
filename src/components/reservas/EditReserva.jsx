import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../interceptors/axios";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

const EditReserva = ({ reservaId }) => {
  const { id } = useParams();
  const [fecha_reserva, setFechaReserva] = useState("");
  const [hora_reserva, setHoraReserva] = useState("");
  const [cant_adultos, setCantAdultos] = useState(0);
  const [cant_niños, setCantNiños] = useState(0);
  const [motivo_reserva, setMotivoReserva] = useState("");
  const [clienteId, setClientId] = useState(0);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState(0);
  const [anticipoId, setAnticipoId] = useState(0);
  const [anticipo_required, setAnticipoRequired] = useState(false);

  const [anticipoCheckBox, setAnticipoCheckBox] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState([]);

  const [anticipo, setAnticipo] = useState({
    monto_anticipo: 0,
    banco: "",
    moneda: "",
    fecha_anticipo: new Date().toISOString().split('T')[0],
    estado_anticipo: ""
  });

  useEffect(() => {
    const fetchReservaData = async () => {
      try {
        const response = await instance.post("/intimar/reserva/reservaId", {
          id: id
        });

        console.log(response.data.reserva);

        const reserva = response.data.reserva;

        setFechaReserva(reserva.fecha_reserva);
        setHoraReserva(reserva.hora_reserva);
        setCantAdultos(reserva.cant_adultos);
        setCantNiños(reserva.cant_niños);
        setMotivoReserva(reserva.motivo_reserva);
        setClientId(reserva.clienteId);
        setUserId(reserva.userId);
        setAnticipoId(reserva.anticipoId);
        setAnticipoRequired(reserva.anticipo_required);
        if(reserva.anticipo){
          setAnticipo(reserva.anticipo);
          setAnticipoCheckBox(true);
        }
      } catch (error) {
        console.error('Error fetching reserva data:', error);
      }
    };

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
        setUser(user);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    if (id) {
      fetchReservaData();
    }

    fetchClientes();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(anticipo);
      console.log(anticipoId);

      setIsSubmitting(true);

      const updatedReserva = {
        id,
        fecha_reserva,
        hora_reserva,
        cant_adultos,
        cant_niños,
        motivo_reserva,
        clienteId,
        anticipo_required,
        userId,
      };

      console.log(anticipo);
      console.log(anticipoId);

      if (anticipo_required) {
        updatedReserva.anticipoId = anticipoId;
        updatedReserva.anticipo = anticipo;
      }

      console.log(updatedReserva);

      const response = await instance.put(`/intimar/reserva`, updatedReserva, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toastr.success(response.data.message);
      console.log("Reserva actualizada:", response.data);
      setIsSubmitting(false);
    } catch (error) {
      toastr.error(error.response.data.message);
      console.error("Error updating reserva:", error.response.data.message);
      setIsSubmitting(false);
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
                <h1 className="m-0">Editar Reserva</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Reserva</li>
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
                                  {clientes.map((client) => (
                                    <option 
                                      key={client.id} 
                                      value={client.id}>
                                      {`${client.name} ${client.lastname}`}
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
                                      disabled={anticipoCheckBox} 
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
                        Actualizar Reserva
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
};

export default EditReserva;