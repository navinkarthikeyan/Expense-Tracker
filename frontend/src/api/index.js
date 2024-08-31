import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/users/";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}login/`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
