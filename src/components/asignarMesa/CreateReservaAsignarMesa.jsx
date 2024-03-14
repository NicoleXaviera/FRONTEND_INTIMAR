import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import instance from "../../interceptors/axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function AsignarMesa() {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [reservaId, setReservaId] = useState(0);
  const [mesaId, setMesaId] = useState(0);
  const [horaLlegada, setHoraLlegada] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );
  const [horaSalida, setHoraSalida] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await instance.get("/intimar/reserva", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setReservas(response.data.data);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };

    const fetchMesas = async () => {
      try {
        const response = await instance.get("/intimar/mesa", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setMesas(response.data.data);
      } catch (error) {
        console.error("Error fetching mesas:", error);
      }
    };

    fetchReservas();
    fetchMesas();

    const horaSalidaConAdicional = new Date();
    horaSalidaConAdicional.setMinutes(
      horaSalidaConAdicional.getMinutes() + 90
    );

    const horaSalidaAdicional = horaSalidaConAdicional.toLocaleTimeString(
      "en-US",
      { hour12: false }
    );

    setHoraSalida(horaSalidaAdicional);
  }, []);

  const handleReservaChange = (e) => {
    const selectedReservaId = Number(e.target.value);
    setReservaId(selectedReservaId);
  };

  const handleMesaChange = (e) => {
    const selectedMesaId = Number(e.target.value);
    setMesaId(selectedMesaId);

    const selectedMesa = mesas.find((mesa) => mesa.id === selectedMesaId);
    if (selectedMesa) {
      console.log(`Número de Mesa: ${selectedMesa.numero_mesa}`);
      console.log(`Ubicación de Mesa: ${selectedMesa.ubicacion_mesa}`);
      console.log(
        `Estado de Mesa: ${selectedMesa.estado_mesa ? "Disponible" : "No disponible"}`
      );
    }
  };

  const mesasDisponibles = mesas.filter((mesa) => mesa.estado_mesa);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (reservaId === 0) {
        toastr.warning("Seleccione una reserva");
        return;
      }

      setIsSubmitting(true);
      const selectedReserva = reservas.find(
        (reserva) => reserva.id === reservaId
      );

      const response = await instance.post(
        "/intimar/reserva/mesa",
        {
          reservaId: reservaId,
          mesas: [{ id: mesaId }],
          clienteNombre: selectedReserva.client.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const update = await instance.put(
        "/intimar/reserva",
        {
          hora_llegada: horaLlegada,
          hora_salida: horaSalida,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toastr.success(response.data.message);
      setSuccessMessage("Mesa asignada correctamente");
      setIsSubmitting(false);
    } catch (error) {
      toastr.error(
        error.response?.data?.message || "Error al asignar mesa a reserva"
      );
      console.error("Error al asignar mesa a reserva:", error);
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
                <h1 className="m-0">Asignar Mesa a Reserva</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Asignar Mesa</li>
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
                      {successMessage && (
                        <div className="alert alert-success" role="alert">
                          {successMessage}
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="reservaId">Reserva:</label>
                        <select
                          className="form-control"
                          id="reservaId"
                          name="reservaId"
                          value={reservaId}
                          onChange={handleReservaChange}
                          required
                        >
                          <option value="" disabled>
                            Selecciona una reserva
                          </option>
                          {reservas.map((reserva) => (
                            <option key={reserva.id} value={reserva.id}>
                              {`Reserva ${reserva.id} - ${reserva.client.name}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="mesaId">Mesa:</label>
                        <select
                          className="form-control"
                          id="mesaId"
                          name="mesaId"
                          value={mesaId}
                          onChange={handleMesaChange}
                          required
                        >
                          <option value="" disabled>
                            Selecciona una mesa
                          </option>
                          {mesasDisponibles.map((mesa) => (
                            <option key={mesa.id} value={mesa.id}>
                              {`Mesa ${mesa.numero_mesa} - ${mesa.ubicacion_mesa}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="horaLlegada">Hora de Llegada:</label>
                        <input
                          type="time"
                          className="form-control"
                          id="horaLlegada"
                          value={horaLlegada}
                          onChange={(e) => setHoraLlegada(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="horaSalida">Hora de Salida:</label>
                        <input
                          type="time"
                          className="form-control"
                          id="horaSalida"
                          value={horaSalida}
                          onChange={(e) => setHoraSalida(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        Asignar Mesa
                      </button>
                      <Link
                        to="../asignarMesa"
                        className="btn btn-secondary ml-2"
                      >
                        Regresar
                      </Link>
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
