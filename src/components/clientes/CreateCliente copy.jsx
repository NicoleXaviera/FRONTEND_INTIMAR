import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function CreateCliente() {
  const [client, setClient] = useState({
    name: "",
    lastname: "",
    age: 0,
    email: "",
    cellphone: "",
    address: "",
    allergies: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post(`/intimar/client`, client, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Mensaje de éxito usando react-toastify
      toast.success("Cliente agregado correctamente", {
        position: toast.POSITION.TOP_RIGHT,
      });

      setClient({
        name: "",
        lastname: "",
        age: 0,
        email: "",
        cellphone: "",
        address: "",
        allergies: "",
      });
    } catch (error) {
      console.error("Error creating client", error);
      toast.error("Error al crear el cliente", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleReservaClick = () => {
    navigate("/reserva/create");
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
                <h1 className="m-0">Crear Cliente</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Inicio</a>
                  </li>
                  <li className="breadcrumb-item active">Clientes</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card card-default">
              <div className="card-header">
                <h3 className="card-title">Crear Cliente</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          placeholder="Ingrese el nombre del cliente"
                          name="name"
                          value={client.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="apellido">Apellido:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="apellido"
                          placeholder="Ingrese el apellido del cliente"
                          name="lastname"
                          value={client.lastname}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edad">Edad:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="edad"
                          placeholder="Ingrese la edad del cliente"
                          name="age"
                          value={client.age}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="telefono"
                          placeholder="Ingrese el número de teléfono del cliente"
                          name="cellphone"
                          value={client.cellphone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Ingrese el correo electrónico del cliente"
                          name="email"
                          value={client.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="direccion">Dirección:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="direccion"
                          placeholder="Ingrese la dirección del cliente"
                          name="address"
                          value={client.address}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="alergias">Alergias:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="alergias"
                          placeholder="Ingrese las alergias del cliente"
                          name="allergies"
                          value={client.allergies}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group d-flex justify-content-end">
                    <button type="submit" className="btn btn-success mr-2">
                      Crear Cliente
                    </button>
                    <button type="button" className="btn btn-primary mr-2" onClick={handleReservaClick}>
                      Hacer Reserva
                    </button>
                    {/* Botón de regresar al listado de clientes */}
                    <Link to="/cliente" className="btn btn-secondary">
                      Regresar
                    </Link>
                  </div>

                  {/* Mensaje de éxito con react-toastify */}
                  <ToastContainer />
                </form>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
