import axios from "axios";
import BASE_URL from "../../config";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/users/register/`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `http://expensify-lb-1960358705.ap-south-1.elb.amazonaws.com/api/users/login/`,
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
