import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppLayout() {
  const location = useLocation();
  useEffect(() => { if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" }), 0); }, [location]);
  return <><Navbar/><main className="min-h-[calc(100vh-5rem)]"><Outlet/></main><Footer/><ScrollRestoration/></>;
}
