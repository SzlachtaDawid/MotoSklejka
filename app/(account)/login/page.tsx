"use client";
import Link from "next/link";
import { use } from "react";
import RedirectedInfo from "./RedirectedInfo";
import LoginForm from "./_components/LoginForm/LoginForm";

const Login = ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const { redirected } = use(searchParams);

  return (
    <div className="flex flex-col items-center py-6">
      {redirected === "true" && <RedirectedInfo />}
      <LoginForm />
      <div role="alert" className="alert alert-info max-w-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-center">
          Nie posiadasz jeszcze konta? <br />
          Załóż je i zyskaj dostęp do wszystkich funkcji.
        </p>
      </div>
      <Link href="/sign-up" className="btn btn-outline btn-accent mt-6">
        Zarejestruj się
      </Link>
    </div>
  );
};

export default Login;
