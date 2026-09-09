import type { NextConfig } from "next";

function supabaseHost() {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://x.supabase.co");
    return u.hostname;
  } catch {
    return "*.supabase.co";
  }
}

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: supabaseHost() },
    ],
  },
};

export default nextConfig;