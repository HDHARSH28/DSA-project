
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export async function ll_insert_front(value) {
  const res = await axios.post(`${BASE_URL}/ll/insert_front`, { value });
  return res.data;
}

export async function ll_delete(value) {
  const res = await axios.post(`${BASE_URL}/ll/delete`, { value });
  return res.data;
}

export async function ll_search(value) {
  const res = await axios.post(`${BASE_URL}/ll/search`, { value });
  return res.data;
}

export async function arr_push(value) {
  const res = await axios.post(`${BASE_URL}/arr/push`, { value });
  return res.data;
}

export async function arr_delete(value) {
  const res = await axios.post(`${BASE_URL}/arr/delete`, { value });
  return res.data;
}

export async function arr_search(value) {
  const res = await axios.post(`${BASE_URL}/arr/search`, { value });
  return res.data;
}

export async function arrayToLL() {
  const res = await axios.post(`${BASE_URL}/convert/arrayToLL`);
  return res.data;
}

export async function llToArray() {
  const res = await axios.post(`${BASE_URL}/convert/llToArray`);
  return res.data;
}
export async function getFrontDatabase() {
  const res = await axios.get(`${BASE_URL}/frontend/array`);
  return res.data;
}


