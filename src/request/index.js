import axios from "axios";
let service = axios.create({
  baseURL: "http://43.143.0.76:8889/api/private/v1/",
  timeout: 3000,
});

export default service;
