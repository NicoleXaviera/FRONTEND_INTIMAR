import React, { useState, useEffect, useRef } from "react";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function CreateEmpleado() {
    const [title, setTitle] = useState("Registro de Empleados");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [cellphone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                if (localStorage.getItem("access_token")) {
                    const { data } = await instance.get("/intimar/role", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setRoles(data.data);
                    const defaultRoles = data.data.filter((rol) => rol.name === 'user');
                    setSelectedRoles(defaultRoles.map((rol) => rol.name));
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleRoleChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedRoles(selectedOptions);
    };

    const validatePhone = (cellphone) => {
        // Validar si el número de teléfono tiene nueve dígitos
        return /^\d{9}$/.test(cellphone);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validatePhone(cellphone)) {
            toastr.error('Número de teléfono inválido (debe tener 9 dígitos)');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await instance.post("/intimar/auth/signup", {
                name,
                lastname,
                email,
                cellphone,
                password,
                roles: selectedRoles,
            });

            toastr.success('Registro exitoso', response);

            setName("");
            setLastname("");
            setEmail("");
            setPhone("");
            setPassword("");
            setSelectedRoles([]);
            setIsSubmitting(false);
        } catch (error) {
            toastr.error(error.response.data.message);
            console.log(error);
        }
    };


    return (
        <div className="wrapper">
            <Navbar />
            <Aside />
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>{title}</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item active">Registro de empleados</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
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
                                            <div className="form-group">
                                                <label htmlFor="exampleInputName">Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleInputName"
                                                    placeholder="Ingrese nombre"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputApellido">Apellido</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleInputApellido"
                                                    placeholder="Ingrese apellido"
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputTelefono">Telefono</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleInputTelefono"
                                                    placeholder="Ingrese telefono"
                                                    value={cellphone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="exampleInputEmail1"
                                                    placeholder="Ingrese email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="exampleInputPassword1"
                                                    placeholder="Ingrese password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Roles</label>
                                                <p>Seleccione múltiples roles arrastrando o con control</p>
                                                <select
                                                    multiple
                                                    className="form-control"
                                                    style={{ height: 150 }}
                                                    onChange={handleRoleChange}
                                                    value={selectedRoles}
                                                >
                                                    {roles.map((rol) => (
                                                        <option
                                                            key={rol.id}
                                                            value={rol.name}
                                                        >
                                                            {rol.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                Submit
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
    )
}