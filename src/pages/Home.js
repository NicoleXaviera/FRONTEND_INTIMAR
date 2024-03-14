import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Aside from "../components/Aside";
import Content from "../components/Content";
import Footer from "../components/Footer";
// import TagMesas from "../components/mesas/ListadoMesa";

export default function Home() {
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    }
  });
  return (
    <div className="wrapper">
      <Navbar />
      <Aside />
      <Content />

      <Footer />
    </div>
  );
}
