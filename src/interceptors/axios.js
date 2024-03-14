import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const instance = axios.create({
    baseURL: apiUrl
})

let refresh = false;

instance.defaults.headers.common['x-access-token'] = localStorage.getItem('access_token');

instance.interceptors.response.use(
    (resp) => resp,
    async (error) => {
        if (error.response.status === 401 && !refresh) {
            refresh = true;
            try {
                const response = await axios.post(
                    `${apiUrl}/intimar/auth/refreshtoken`,
                    {
                        refreshToken: localStorage.getItem('refresh_token'),
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    axios.defaults.headers.common['x-access-token'] = `${response.data['accessToken']}`;
                    localStorage.setItem('access_token', response.data.accessToken);
                    localStorage.setItem('refresh_token', response.data.refreshToken);
                    const user = {
                        id: response.data.id,
                        name: response.data.name,
                        lastname: response.data.lastname,
                        email: response.data.email,
                        roles: response.data.roles,
                        cellphone: response.data.cellphone,
                    }
                    localStorage.setItem("user", JSON.stringify(user));

                    return axios(error.config);
                }
            } catch (refreshError) {
                // Si la renovación falla y la respuesta es 403 (Forbidden),
                // redirige al usuario al login.
                if (refreshError.response && refreshError.response.status === 403) {
                    window.location.href = '/login';
                }
            }
        }

        refresh = false;
        return Promise.reject(error);
    }
);

export default instance; 