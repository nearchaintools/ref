import { useQuery } from "react-query";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/`;

export const fetchData = async (apiRoute = "hello", type = "api") => {
  const apiUrl = API_URL;
  try {
    const response = await fetch(`${apiUrl}${apiRoute}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errMessage = `HTTP-Error: ${response.status}`;
      throw new Error(errMessage);
    }
  } catch (e) {
    const errMessage = `API-Error: ${e.message}`;
    throw new Error(errMessage);
  }
};

export const useGet = (name, apiRoute, enabled) => {
  return useQuery(
    name,
    async () => {
      const { data } = await axios.get(`${API_URL}${apiRoute}`);
      return data;
    },
    { ...enabled }
  );
};
