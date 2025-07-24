import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🔥 Middleware running for path:", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("🔥 User in middleware:", user?.email || "No user");
    console.log("🔥 Auth error:", error);

    // Protected routes
    const protectedPaths = ["/dashboard", "/profile", "/business-ideas"];
    const authPaths = ["/signin", "/signup"];

    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    console.log("🔥 Is protected path:", isProtectedPath);
    console.log("🔥 Is auth path:", isAuthPath);

    // Redirect to signin if accessing protected route without auth
    if (!user && isProtectedPath) {
      console.log("🔥 Redirecting to signin - no user on protected path");
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (user && isAuthPath) {
      console.log(
        "🔥 Redirecting to dashboard - user trying to access auth page"
      );
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("🔥 Middleware error:", error);
  }

  return supabaseResponse;
}

// Update the matcher to be more specific
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/business-ideas/:path*",
    "/signin",
    "/signup",
  ],
};
