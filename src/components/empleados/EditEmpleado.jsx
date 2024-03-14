import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/empleados/";

const EditEmpleado = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [rolId, setRolId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleadoData = async () => {
      try {
        const response = await axios.get(`${baseUrl}${id}`);
        const empleadoData = response.data;

        setNombre(empleadoData.nombre_empleado);
        setApellido(empleadoData.apellido_empleado);
        setCelular(empleadoData.celular_empleado);
        setCorreo(empleadoData.correo_empleado);
        setRolId(empleadoData.Roles_id_Roles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmpleadoData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.log("Unauthorized access");
        return;
      }

      await axios.put(`${baseUrl}${id}`, {
        nombre_empleado: nombre,
        apellido_empleado: apellido,
        celular_empleado: celular,
        correo_empleado: correo,
        Roles_id_Roles: parseInt(rolId),
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      navigate("/empleados");
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-12 col-lg-8 offset-0 offset-lg-2">
          <div className="card">
            <div className="card-header bg-dark text-white">Editar Empleado</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <label>Nombre: </label>
                <input type="text" id="nombre" maxLength="200" className="form-control" required={true} value={nombre} onChange={(e) => setNombre(e.target.value)} />

                <label>Apellido: </label>
                <input type="text" id="apellido" maxLength="200" className="form-control" required={true} value={apellido} onChange={(e) => setApellido(e.target.value)} />

                <label>Celular: </label>
                <input type="text" id="celular" maxLength="10" className="form-control" required={true} value={celular} onChange={(e) => setCelular(e.target.value)} />

                <label>Correo: </label>
                <input type="email" id="correo" maxLength="200" className="form-control" required={true} value={correo} onChange={(e) => setCorreo(e.target.value)} />

                <label>Rol ID: </label>
                <input type="text" id="rolId" className="form-control" required={true} value={rolId} onChange={(e) => setRolId(e.target.value)} />

                <button className="btn btn-primary mt-3" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmpleado;
