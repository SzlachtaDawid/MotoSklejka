"use client";

import { signOut, useSession } from "next-auth/react";

const AccountPage = () => {
  const { data: session } = useSession();
  return (
    <div className="my-10 flex flex-col items-center">
      <div className="aura aura-glow aura-xs">
        <div className="card bg-base-100 card-xl w-96 shadow-sm">
          <div className="card-body">
            <h1 className="card-title">Twoje konto</h1>
            <p>Nazwa: {session?.user.name}</p>
            <p>Email: {session?.user.email}</p>
          </div>
          <div className="card-actions m-3 justify-end">
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-primary">
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
