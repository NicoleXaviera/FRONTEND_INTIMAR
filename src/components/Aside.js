import React, { useState, useEffect } from "react";
import logo from '../assets/AdminLTELogo.png'
import perfil from '../assets/user2-160x160.jpg'

export default function Aside() {
  const [user, setUser] = useState();

  useEffect(() => {
    try {
      if (localStorage.getItem("access_token") === null) {
        window.location.href = "/login";
      } 
      
      const jsonString = localStorage.getItem('user');

      const parsedObject = JSON.parse(jsonString);

      setUser(parsedObject);
    } catch (e) {
      console.log(e)
    }

  }, []);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="/home" className="brand-link">
        <img
          src={logo}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">Inti-Mar</span>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src={perfil}
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <a href="/" className="d-block">
            {user ? `${user.name} ${user.lastname}` : 'Nombre del Usuario'}
            </a>
          </div>
        </div>
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >

            <li className="nav-item">
              <a href="/home" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>
                  Tablero
                  {/* <span className="right badge badge-danger">New</span> */}
                </p>
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-table" />
                <p>
                  Clientes
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/cliente" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Listado Clientes</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/cliente/create" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Registrar Cliente</p>
                  </a>
                </li>
              </ul>
            </li>


            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-table" />
                <p>
                  Reservas
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/reserva" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Listado Reserva</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/reserva/create" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Registrar Reserva</p>
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-table" />
                <p>
                  Asignar mesa
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/asignarMesa" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Listado Asignar Mesa</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/asignarMesa/create" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Registrar Asinacion</p>
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-table" />
                <p>
                  Mesas
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/mesa" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Listado Mesas</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/mesa/create" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Registrar Mesa</p>
                  </a>
                </li>
              </ul>
            </li>


            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-table" />
                <p>
                  Empleados
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/empleado" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Listado Empleados</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/empleado/create" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Registrar Empleados</p>
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="/consultas" className="nav-link">
                <i className="nav-icon fas fa-search" />
                <p>
                  Consultas
                </p>
              </a>
            </li>

            <li className="nav-item">
              <a href="/calendar" className="nav-link">
                <i className="nav-icon fas fa-calendar-alt" />
                <p>
                  Calendario Reservas
                  <span className="badge badge-info right">10</span>                </p>
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-file" />
                <p>
                  Reportes
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/cliente/reporte" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Reporte Clientes</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/reserva/reporte" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Reporte Reservas</p>
                  </a>
                </li>
                </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-chart-pie" />
                <p>
                  Graficas
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/grafica/ReservasPorMeses" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Grafica Reservas por meses</p>
                  </a>
                </li>
                </ul>
            </li>

            <li className="nav-item">
              <a href="/configuracion" className="nav-link">
                <i className="nav-icon far fa-plus-square" />
                <p>
                  Configuracion
                </p>
              </a>
            </li>
    
                {/* <li className="nav-item">
                  <a href="/mesa/reporte" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Reporte Mesas</p>
                  </a>
                </li> */}

          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
}
