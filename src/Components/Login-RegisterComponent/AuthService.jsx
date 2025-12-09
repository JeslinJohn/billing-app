import api from "../Login-RegisterComponent/axios.jsx";

export const loginUser = async ({ username, password }) => {
  const { data } = await api.post("/auth/login", {
    username,
    password
  });
  return data;
};

export const registerUser = async (payload) => {
  const token = sessionStorage.getItem("authToken");
  const { data } = await api.post("/auth/signup", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};
