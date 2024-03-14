import { useEffect, useState } from "react";
import instance from "../interceptors/axios";

const Logout = () => {
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.post(
          "/intimar/auth/logout",
          {
            refreshToken: localStorage.getItem("refresh_token"),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
          { withCredentials: true }
        );

        console.log("logout", data);
        localStorage.clear();
        instance.defaults.headers.common["x-access-token"] = null;
        window.location.href = "/login";
      } catch (e) {
        console.log(e,"logout not working");
      }
    })();
  }, []);

  // console.log(data)
  // localStorage.clear();
  // localStorage.setItem('token', data.access);
  // localStorage.setItem('refresh_token', data.refresh);
  // axios.defaults.headers.common['x-access-token'] = `${data['access']}`;
  // window.location.href = '/'

  return <div></div>;
};

export default Logout;