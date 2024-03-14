import React, { useState, useEffect } from "react";
import instance from "../interceptors/axios";
import mesaImagen from "../assets/mesa-imagen.png";

export default function Content() {
  const [mesas, setMesas] = useState([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          const { data } = await instance.get("/intimar/test/user", {
            headers: {
              "Content-Type": "application/json",
            },
          });
          setMessage(data.message);
        } catch (e) {
          console.log("not auth");
        }
      })();
    }
  }, []);

  return (
 
    <div class="content-wrapper">
    {/* <!-- Content Header (Page header) --> */}
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">INTIMAR</h1>
          </div>
          {/* <!-- /.col --> */}
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Tablero Intimar</li>
            </ol>
          </div>
          {/* <!-- /.col --> */}
        {/* </div><!-- /.row --> */}
      </div>
      {/* <!-- /.container-fluid --> */}
    </div>
    {/* <!-- /.content-header --> */}
  
    {/* <!-- Main content --> */}
    <section class="content">
      <div class="container-fluid">
        {/* <!-- Small boxes (Stat box) --> */}
        <div class="row">
          <div class="col-lg-3 col-6">
            {/* <!-- small box --> */}
            <div class="small-box bg-info">
              <div class="inner">
                <h3>20</h3>
  
                <p>Total de reservaciones </p>
              </div>
              <div class="icon">
                <i class="ion ion-bag"></i>
              </div>
              <a href="#" class="small-box-footer">Ver mas <i class="fas fa-arrow-circle-right"></i></a>


            </div>
          </div>
          {/* <!-- ./col --> */}
          <div class="col-lg-3 col-6">
            {/* <!-- small box --> */}
            <div class="small-box bg-success">
              <div class="inner">
                <h3>5<sup style={{ fontSize: '20px' }}></sup></h3>
  
                <p>mesas disponibles</p>
              </div>
              <div class="icon">
                <i class="ion ion-stats-bars"></i>
              </div>
              <a href="#" class="small-box-footer">Ver mas <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          {/* <!-- ./col --> */}
          <div class="col-lg-3 col-6">
            {/* <!-- small box --> */}
            <div class="small-box bg-warning">
              <div class="inner">
                <h3>3</h3>
  
                <p>Comensales en espera</p>
              </div>
              <div class="icon">
                <i class="ion ion-person-add"></i>
              </div>
              <a href="#" class="small-box-footer">Ver mas <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          {/* <!-- ./col --> */}
          <div class="col-lg-3 col-6">
            {/* <!-- small box --> */}
            <div class="small-box bg-danger">
              <div class="inner">
                <h3>50</h3>
  
                <p>Aforo</p>
              </div>
              <div class="icon">
                <i class="ion ion-pie-graph"></i>
              </div>
              <a href="#" class="small-box-footer">Ver mas <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          {/* <!-- ./col --> */}
        </div>
        {/* <!-- /.row --> */}
  
        
      {/* <!-- Main content --> */}
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header border-0">
                  <div class="d-flex justify-content-between">
                    <h3 class="card-title">Reserva Intimar por meses</h3>
                    <a href="javascript:void(0);">View Report</a>
                  </div>
                </div>
                <div class="card-body">
                  <div class="d-flex">
                    <p class="d-flex flex-column">
                      <span class="text-bold text-lg">820</span>
                      <span>Visitantes a lo largo del tiempo</span>
                    </p>
                    <p class="ml-auto d-flex flex-column text-right">
                      <span class="text-success">
                        <i class="fas fa-arrow-up"></i> 12.5%
                      </span>
                      <span class="text-muted">Desde la semana pasada</span>
                    </p>
                  </div>
                  {/* <!-- /.d-flex --> */}
  
                  <div class="position-relative mb-4">
                    <canvas id="visitors-chart" height="200"></canvas>
                  </div>
  
                  <div class="d-flex flex-row justify-content-end">
                    <span class="mr-2">
                      <i class="fas fa-square text-primary"></i> Esta semana
                    </span>
  
                    <span>
                      <i class="fas fa-square text-gray"></i> semana pasada
                    </span>
                  </div>
                </div>
              </div>
              {/* <!-- /.card --> */}
            
            </div>
            {/* <!-- /.col-md-6 --> */}
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header border-0">
                  <div class="d-flex justify-content-between">
                    <h3 class="card-title">Flujo de restaurante semanal</h3>
                    <a href="javascript:void(0);">View Report</a>
                  </div>
                </div>
                <div class="card-body">
                  <div class="d-flex">
                    <p class="d-flex flex-column">
                      <span class="text-bold text-lg">110 clientes</span>
                      <span>Toda esta semana</span>
                    </p>
                    <p class="ml-auto d-flex flex-column text-right">
                      <span class="text-success">
                        <i class="fas fa-arrow-up"></i> 54
                      </span>
                      <span class="text-muted">Desde lunes</span>
                    </p>
                  </div>
                  {/* <!-- /.d-flex --> */}
  
                  <div class="position-relative mb-4">
                    <canvas id="sales-chart" height="200"></canvas>
                  </div>
  
                  <div class="d-flex flex-row justify-content-end">
                    <span class="mr-2">
                      <i class="fas fa-square text-primary"></i> Esta semana 
                    </span>
  
                    <span>
                      <i class="fas fa-square text-gray"></i> Semana pasada
                    </span>
                  </div>
                </div>
              </div>
              {/* <!-- /.card --> */}
  
  
            </div>
            {/* <!-- /.col-md-6 --> */}
  
  
            <div class="container-fluid">
              <div class="col-12 col-sm-12 col-md-12 ">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Lista de Reservas</h3>
                    </div>
                    {/* <!-- /.card-header --> */}
                    <div class="card-body">
                        <table id="example2" class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>ID de Reserva</th>
                                    <th>Nombre del Cliente</th>
                                    <th>Cantidad de Personas</th>
                                    <th>Fecha de Reserva</th>
                                    <th>Estado de Reserva</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>John Doe</td>
                                    <td>4</td>
                                    <td>2023-11-01</td>
                                    <td>Confirmada</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jane Smith</td>
                                    <td>2</td>
                                    <td>2023-11-05</td>
                                    <td>Pendiente</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Bob Johnson</td>
                                    <td>3</td>
                                    <td>2023-11-10</td>
                                    <td>Cancelada</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* <!-- /.card-body --> */}
                </div>
                {/* <!-- /.card --> */}
            </div>
          </div>
  
  
             {/* <!-- Default box --> */}
        {/* <div class="card card-solid">
          <div class="card-body pb-0">
            <div class="row">
            <section className="content">
            <div className="card card-solid">
            <div className="card-body pb-0">
                <div className="row">
                {mesas.map((mesa) => (
                    <div
                    className="col-12 col-sm-6 col-md-3 d-flex align-items-stretch flex-column"
                    key={mesa.id}
                    >
                    <div className="card bg-light d-flex flex-fill">
                        <img
                        src={mesa.imagen_url || mesaImagen}
                        alt={`Mesa #${mesa.numero_mesa}`}
                        className="img-fluid"
                        />
                        <div className="card-body pt-0">
                        <div className="row">
                            <div className="col-7">
                            <h2 className="lead" style={{ fontWeight: "bold" }}>
                                <b>{`Mesa #${mesa.numero_mesa}`}</b>
                            </h2>
                            <ul className="ml-4 mb-0 fa-ul text-muted">
                                <li className="medium" style={{ padding: "0.1rem" }}>
                                <span className="fa-li">
                                    <i className="fas fa-lg fa-map-marker-alt" />
                                </span>
                                {`${mesa.ubicacion_mesa}`}
                                </li>
                                <li className="medium" style={{ padding: "0.1rem" }}>
                                <span className="fa-li">
                                    <i className="fas fa-lg fa-check-circle" />
                                </span>
                                {`${mesa.estado_mesa ? "Disponible" : "No disponible"}`}
                                </li>
                            </ul>
                            </div>
                        </div>
                        </div>
                        <div className="card-footer">
                        <div className="text-right">
                            <a href="/" className="btn btn-sm bg-teal">
                            <i className="fas fa-comments" />
                            </a>
                            <a href="/" className="btn btn-sm btn-primary">
                            <i className="fas fa-info-circle" /> Ver detalles
                            </a>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>  
  
          </div>
          {/* <!-- /.row --> */}
        {/* </div> */}
        {/* <!-- /.container-fluid --> */}
      {/* </div>  */}
      {/* <!-- /.content --> */}
    </div>
    {/* <!-- /.content-wrapper --> */}
    </div>
</div>
</div>
</section>
</div>
</div>
  );
}

