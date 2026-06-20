"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

type Props = {
  onLinkClick?: () => void;
};

const NavBarList = ({ onLinkClick }: Props) => {
  const { data: session } = useSession();

  return (
    <>
      <li>
        <Link href="/" onClick={onLinkClick}>
          Główna
        </Link>
      </li>
      <li>
        <Link href="/map" onClick={onLinkClick}>
          Mapa Sklejek
        </Link>
      </li>
      <li>
        <Link href="/teams" onClick={onLinkClick}>
          Zespoły
        </Link>
      </li>
      <li>
        <Link href="/about-project" onClick={onLinkClick}>
          O projekcie
        </Link>
      </li>
      <li>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="rounded-full">
              <img
                alt="Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-primary rounded-box z-1 mt-3 w-52 space-y-2 p-2 shadow"
          >
            {session ? (
              <>
                <li>
                  <span className="font-semibold">{session.user?.name}</span>
                </li>
                <li>
                  <button onClick={() => signOut({ callbackUrl: "/" })}>Wyloguj</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" onClick={onLinkClick}>
                    Logowanie
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" onClick={onLinkClick}>
                    Rejestracja
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </li>
    </>
  );
};

export default NavBarList;
