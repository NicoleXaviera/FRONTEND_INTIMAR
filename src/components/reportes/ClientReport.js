import React, { useState, useEffect, useRef } from "react";
import instance from "../../interceptors/axios";
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
import { useReactToPrint } from "react-to-print";

export default function Clients() {
    const [clients, setClients] = useState([]);
    const componentPDF = useRef();

    useEffect(() => {
        if (localStorage.getItem("access_token") === null) {
            window.location.href = "/login";
        } else {
            (async () => {
                try {
                    const { data } = await instance.get("/intimar/client", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setClients(data.data);
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    });

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Clients",
    });

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
                                <h1 className="m-0">Clientes</h1>
                            </div>
                            {/* /.col */}
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Reporte Clientes </li>
                                </ol>
                            </div>
                            {/* /.col */}
                        </div>
                        {/* /.row */}
                    </div>
                    {/* /.container-fluid */}
                </div>
                {/* /.content-header */}
                {/* Main content */}
                <section className="content" ref={componentPDF}>
                    <div className="card card-solid">
                        <button className="btn btn-success" onClick={generatePDF}>
                            PDF
                        </button>
                        <div className="card-body pb-0">
                            <div className="row">
                                {
                                    clients.map((client) => {
                                        return (
                                            <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column" key={client.id}>
                                                <div className="card bg-light d-flex flex-fill" >
                                                    <div className="card-header text-muted border-bottom-0">
                                                        Digital Strategist
                                                    </div>
                                                    <div className="card-body pt-0">
                                                        <div className="row">
                                                            <div className="col-7">
                                                                <h2 className="lead" style={{ fontWeight: "bold" }}><b>{`${client.name} ${client.lastname}`}</b></h2>
                                                                <ul className="ml-4 mb-0 fa-ul text-muted">
                                                                    <li className="medium" style={{ padding: "0.1rem" }}><span className="fa-li"><i className="fas fa-lg fa-envelope" /></span>{`${client.email}`}</li>
                                                                    <li className="medium" style={{ padding: "0.1rem" }}><span className="fa-li"><i className="fas fa-lg fa-building" /></span>{`${client.address}`}</li>
                                                                    <li className="medium" style={{ padding: "0.1rem" }}><span className="fa-li"><i className="fas fa-lg fa-phone" /></span> {`${client.cellphone}`}</li>
                                                                    <li className="medium" style={{ padding: "0.1rem" }}> Alergias : {`${client.allergies == null ? "No hay alergias" : client.allergies}`}</li>
                                                                    <li className="medium" style={{ padding: "0.1rem" }}> Edad : {`${client.age}`}</li>
                                                                </ul>
                                                            </div>
                                                            <div className="col-5 text-center">
                                                                <img src="../../dist/img/user1-128x128.jpg" alt="user-avatar" className="img-circle img-fluid" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer">
                                                        <div className="text-right">
                                                            <a href="/" className="btn btn-sm bg-teal">
                                                                <i className="fas fa-comments" />
                                                            </a>
                                                            <a href="/" className="btn btn-sm btn-primary">
                                                                <i className="fas fa-user" /> View Profile
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </section>
                {/* /.content */}
            </div>
            <Footer />
        </div>
    );
}