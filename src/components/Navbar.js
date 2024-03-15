import React, { useState, useEffect } from "react";

export default function Navbar() {
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
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="/" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/home" className="nav-link">
            Home
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/cliente" className="nav-link">
            Clientes
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/reserva" className="nav-link">
            Reserva
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/asignarMesa" className="nav-link">
            Asignar Mesa
          </a>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}
        {/* <li className="nav-item">
          <a
            className="nav-link"
            data-widget="navbar-search"
            href="/"
            role="button"
          >
            <i className="fas fa-search" />
          </a>
          <div className="navbar-search-block">
            <form className="form-inline">
              <div className="input-group input-group-sm">
                <input
                  className="form-control form-control-navbar"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <div className="input-group-append">
                  <button className="btn btn-navbar" type="submit">
                    <i className="fas fa-search" />
                  </button>
                  <button
                    className="btn btn-navbar"
                    type="button"
                    data-widget="navbar-search"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li> */}
      </ul>
      <div className="navbar-custom-menu">
        <ul className="nav navbar-nav">
          <li className="dropdown user user-menu">
            <a
              href="/"
              className="dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="../dist/img/user2-160x160.jpg"
                className="user-image"
                alt="User Image"
              />
              <span className="hidden-xs">     {user ? `${user.name} ${user.lastname}` : 'Nombre del Usuario'}
              </span>
            </a>
            <ul className="dropdown-menu">
              <li className="user-header">
                <img
                  src="../dist/img/user2-160x160.jpg"
                  className="img-circle"
                  alt="User Image"
                />
                <p>
                  {user ? `${user.name} ${user.lastname}` : 'Nombre del Usuario'}
                  <small>Member since Nov. 2023</small>
                </p>
              </li>
              <li className="user-body">
                <div className="row">
                  {user && user.roles && user.roles.length > 0 ? (
                    user.roles.map((rol) => (
                      <div className="col-12 text-center" key={rol}>
                        <a href="/">{rol}</a>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center">
                      No se encontraron roles.
                    </div>
                  )}
                </div>

              </li>
              <li className="user-footer">
                <div className="pull-left">
                  <a
                    href="/"
                    className="btn btn-block btn-outline-secondary btn-flat"
                  >
                    Perfil
                  </a>
                  <a
                    href="/logout"
                    className="btn btn-block btn-outline-secondary btn-flat"
                  >
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <a href="/" data-toggle="control-sidebar">
              <i className="fa fa-gears" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
