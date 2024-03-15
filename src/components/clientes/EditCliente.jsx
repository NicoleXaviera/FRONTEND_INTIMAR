import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../interceptors/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";

export default function EditClient() {
  const { id } = useParams();
  const [client, setClient] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await instance.post(`/intimar/client/findByName`, {
          name: id
        });
        setClient(data.clients[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error, "not auth");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.put(`/intimar/client`, client, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Redirige a la página de clientes después de la edición exitosa
      navigate("/cliente", { replace: true });

      // Notificación toast de éxito
      toast.success("Cliente agregado correctamente", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error creating client", error);
      toast.error("Error al actualizar el cliente", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="wrapper">
      <Navbar />
      <Aside />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Editar Cliente</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/cliente">Clientes</a>
                  </li>
                  <li className="breadcrumb-item active">Editar cliente</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card card-warning">
              <div className="card-header">
                <h3 className="card-title">Editar Cliente</h3>
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
                          value={client.name || ""}
                          onChange={handleChange}
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
                          value={client.lastname || ""}
                          onChange={handleChange}
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
                          value={client.age || ""}
                          onChange={handleChange}
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
                          value={client.cellphone || ""}
                          onChange={handleChange}
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
                          value={client.email || ""}
                          onChange={handleChange}
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
                          value={client.address || ""}
                          onChange={handleChange}
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
                          value={client.allergies || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-warning">
                      Actualizar Cliente
                    </button>
                  </div>
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
