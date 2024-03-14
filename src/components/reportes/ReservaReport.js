import React, { useState, useEffect, useRef } from "react";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import { useReactToPrint } from "react-to-print";

export default function ReservaReports() {
    const [reservas, setReservas] = useState([]);
    const [title, setTitle] = useState("Reservas");
    const [searchValue, setSearchValue] = useState('');

    const componentPDF = useRef();

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                if (localStorage.getItem("access_token")) {
                    const { data } = await instance.get("/intimar/reserva", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setReservas(data.data);
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error fetching reservas:", error);
            }
        };
        fetchReservas();
    }, []);

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: title,
    });

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (!searchValue) {
                return;
            }

            const response = await instance.post("/intimar/client/findByName", {
                name: searchValue
            });

            const client = response.data.clients[0];

            if (client) {
                const reservasData = await instance.post("/intimar/reserva/clientId", {
                    clientId: client.id
                });

                setReservas(reservasData.data.data);
                setTitle(`Resultados por nombre o apellido del cliente`);
            } else {
                setReservas([]);
                setTitle(`No hay resultado para el cliente ${searchValue}`);
            }
        } catch (error) {
            console.error("Error during search:", error);
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
                                <h1 className="m-0">{title}</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Dashboard v3</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content" ref={componentPDF}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <button className="btn btn-success" onClick={generatePDF}>
                                            PDF
                                        </button>
                                        <div className="row">
                                            <div className="col-md-10 offset-md-1">
                                                <div className="input-group">
                                                    <input
                                                        type="search"
                                                        className="form-control form-control-lg"
                                                        value={searchValue}
                                                        onChange={handleInputChange}

                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-lg btn-default" onClick={handleSearch}>
                                                            <i className="fa fa-search" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Fecha de reserva</th>
                                                    <th>Hora de Reserva</th>
                                                    <th>Hora de llegada</th>
                                                    <th>Hora de salida</th>
                                                    <th>Cantidad de adultos</th>
                                                    <th>Cantidad de niños</th>
                                                    <th>Estado de reserva</th>
                                                    <th>Motivo de reserva</th>
                                                    <th>Nombre del cliente</th>
                                                    <th>Nombre del empleado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    reservas.map((reserva) => {
                                                        return (
                                                            <tr key={reserva.id}>
                                                                <td>{reserva.fecha_reserva}</td>
                                                                <td>{reserva.hora_reserva}</td>
                                                                <td>{reserva.hora_llegada == null ? "----" : reserva.hora_llegada}</td>
                                                                <td>{reserva.hora_salida == null ? "----" : reserva.hora_salida}</td>
                                                                <td>{reserva.cant_adultos}</td>
                                                                <td>{reserva.cant_niños}</td>
                                                                <td>{reserva.estado_reserva}</td>
                                                                <td>{reserva.motivo_reserva}</td>
                                                                <td>{`${reserva.client.name} ${reserva.client.lastname}`}</td>
                                                                <td>{`${reserva.user.name} ${reserva.user.lastname}`}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
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