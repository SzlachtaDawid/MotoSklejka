import { auth } from "@/auth";

const protectedPaths = ["/map", "/teams"];

export const proxy = auth((req) => {
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !req.auth) {
    return Response.redirect(new URL("/login?redirected=true", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
