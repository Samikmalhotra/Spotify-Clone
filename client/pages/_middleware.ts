import { NextRequest, NextResponse } from "next/server";

const signinPages = ["/", "/playlist", "/library"];

export default function middleware(req: NextRequest) {
  if (signinPages.includes(req.nextUrl.pathname)) {
    const token = req.cookies.CHORDS_ACCESS_TOKEN;

    if (!token) {
      // @ts-ignore
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }
}
