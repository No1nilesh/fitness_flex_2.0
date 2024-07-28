import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // if (req.nextUrl.pathname.startsWith("/")) {
    //   switch (req.nextauth.token?.role) {
    //     case "admin":
    //       NextResponse.rewrite(new URL("/admin/dashboard", req.url));
    //       break;
    //     case "user":
    //       NextResponse.rewrite(new URL("/trainer/dashboard", req.url));
    //       break;
    //     case "trainer":
    //       NextResponse.rewrite(new URL("/member/dashboard", req.url));
    //       break;

    //     default:
    //       break;
    //   }
    // }

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/member") &&
      req.nextauth.token?.role !== "user"
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/trainer") &&
      req.nextauth.token?.role !== "trainer"
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/trainer/:path*"],
};
