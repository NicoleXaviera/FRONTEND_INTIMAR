import instance from "../interceptors/axios";
import { useState } from "react";
import "../styles/login.css";
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    try {
      e.preventDefault();

      const user = {
        email: email,
        password: password,
      };

      const { data } = await instance.post(
        "intimar/auth/signin",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
        // { withCredentials: true }
      );

      localStorage.clear();
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      const userLogged = {
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        roles: data.roles,
        cellphone: data.cellphone,
      }
      localStorage.setItem("user", JSON.stringify(userLogged));
      instance.defaults.headers.common[
        "x-access-token"
      ] = `${data["accessToken"]}`;
      window.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="Auth-form-content login">
          <form className="form" onSubmit={submit}>
            <label className=".login label" htmlFor="labelLogin" aria-hidden="true">Iniciar Sesión</label>

            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Acceder</button>
          </form>
        </div>

        {/* <div className="Auth-form-content register">
          <form className="form">
            <label className=".login label" htmlFor="chk" aria-hidden="true">Registro</label>
            <input className="input" type="text" name="txt" placeholder="Username" required />
            <input className="input" type="email" name="email" placeholder="Email" required />
            <input className="input" type="password" name="pswd" placeholder="Password" required />
            <button>Register</button>
          </form>
        </div> */}
      </div>
    </div>

    // <div className="login-box" >
    //   <div className="login-logo">
    //     <a href="../../index2.html">
    //       <b>Admin</b>LTE
    //     </a>
    //   </div>
    //   {/* /.login-logo */}
    //   <div className="card">
    //     <div className="card-body login-card-body">
    //       <p className="login-box-msg">Sign in to start your session</p>
    //       <form action="../../index3.html" method="post">
    //         <div className="input-group mb-3">
    //           <input
    //             type="email"
    //             className="form-control"
    //             placeholder="Email"
    //           />
    //           <div className="input-group-append">
    //             <div className="input-group-text">
    //               <span className="fas fa-envelope" />
    //             </div>
    //           </div>
    //         </div>
    //         <div className="input-group mb-3">
    //           <input
    //             type="password"
    //             className="form-control"
    //             placeholder="Password"
    //           />
    //           <div className="input-group-append">
    //             <div className="input-group-text">
    //               <span className="fas fa-lock" />
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row">
    //           <div className="col-8">
    //             <div className="icheck-primary">
    //               <input type="checkbox" id="remember" />
    //               <label htmlFor="remember">Remember Me</label>
    //             </div>
    //           </div>
    //           {/* /.col */}
    //           <div className="col-4">
    //             <button type="submit" className="btn btn-primary btn-block">
    //               Sign In
    //             </button>
    //           </div>
    //           {/* /.col */}
    //         </div>
    //       </form>
    //       <div className="social-auth-links text-center mb-3">
    //         <p>- OR -</p>
    //         <a href="#" className="btn btn-block btn-primary">
    //           <i className="fab fa-facebook mr-2" /> Sign in using Facebook
    //         </a>
    //         <a href="#" className="btn btn-block btn-danger">
    //           <i className="fab fa-google-plus mr-2" /> Sign in using Google+
    //         </a>
    //       </div>
    //       {/* /.social-auth-links */}
    //       <p className="mb-1">
    //         <a href="forgot-password.html">I forgot my password</a>
    //       </p>
    //       <p className="mb-0">
    //         <a href="register.html" className="text-center">
    //           Register a new membership
    //         </a>
    //       </p>
    //     </div>
    //     {/* /.login-card-body */}
    //   </div>
    // </div>
  );
};

export default Login;