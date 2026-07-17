import { redirect } from "next/navigation";
import { ROUTES } from "@/types/constants";

// Root entry: AuthWrapper sends unauthenticated visitors on to /login.
const page = () => {
  redirect(ROUTES.DASHBOARD);
};

export default page;
