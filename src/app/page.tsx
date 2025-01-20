"use client";

import { ACCESS_TOKEN_VARIABLE } from "@/lib/utils/auth-token";
import useAuthStore from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function Home() {
  const token = localStorage.getItem(ACCESS_TOKEN_VARIABLE);
  const { profile } = useAuthStore();

  if (!token || !profile) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}

