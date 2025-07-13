import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/documents/:documentId", "./routes/documents/delete.tsx"),
    route("/documents/upload", "./routes/documents/upload.tsx"),
] satisfies RouteConfig;
