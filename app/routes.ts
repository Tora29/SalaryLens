import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/dashboard/route.tsx"),
  route("/payslips/upload", "routes/payslips/upload/route.tsx"),
] satisfies RouteConfig;
