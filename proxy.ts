import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const publicRoutes = ["/login"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = publicRoutes.includes(path);
  const session = await decrypt(req.cookies.get("session")?.value);

  if (!isPublic && !session)
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  if (isPublic && session)
    return NextResponse.redirect(new URL("/", req.nextUrl));
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico)$).*)",
  ],
};
