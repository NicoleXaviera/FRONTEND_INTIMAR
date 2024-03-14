import React, { useState, useEffect } from "react";
import instance from "../../interceptors/axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";


const ReservasPorMeses = () => {
  const [reservas, setReservas] = useState([]);

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
        console.error('Error fetching reservas:', error);
      }
    };

    fetchReservas();
  }, []);

  // Procesar los datos para el gráfico
  const procesarDatosParaGrafico = () => {
    const meses = Array.from({ length: 12 }, (_, i) => i + 1);
    const reservasPorMes = meses.map((mes) =>
      reservas.filter(
        (reserva) =>
          new Date(reserva.fecha_reserva).getMonth() + 1 === mes
      ).length
    );
    return {
      labels: meses.map((mes) => `Mes ${mes}`),
      datasets: [
        {
          label: "Reservas por Mes",
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,192,192,0.4)",
          hoverBorderColor: "rgba(75,192,192,1)",
          data: reservasPorMes,
        },
      ],
    };
  };

  return (
    <div>
    <Navbar />
    <Aside />
    <div className="content-wrapper">
      {/* Encabezado de la página */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Reservas por Meses</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Graficos</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className="reservas-por-meses">
      {/* <h2>Reservas por Meses</h2> */}
      <Bar
        data={procesarDatosParaGrafico()}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        }}
      />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReservasPorMeses;
