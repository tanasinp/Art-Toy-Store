import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ เปิด React Compiler (optional)
  reactCompiler: true,

  // ✅ ปิด LightningCSS (แก้ error Cannot find module 'unknown')
  env: {
    NEXT_DISABLE_LIGHTNINGCSS: "true",
  },

  // ✅ optimize imports สำหรับ performance
  experimental: {
    optimizePackageImports: ["@radix-ui", "lucide-react"],
  },
};

export default nextConfig;
