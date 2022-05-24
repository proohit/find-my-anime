export const SERVER_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : `https://${window.location.host}`;
export const SERVER_PATH = "/api";
