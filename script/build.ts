import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  try {
    console.log("🧹 Cleaning dist folder...");
    await rm("dist", { recursive: true, force: true });

    console.log("📦 Building client (Vite)...");
    // การรัน Vite build ตรงนี้กิน RAM เยอะที่สุด
    await viteBuild(); 
    
    // ช่วยคืน Memory เล็กน้อยหลังจบงานหนัก
    if (global.gc) global.gc();

    console.log("🖥️ Building server (esbuild)...");
    const pkg = JSON.parse(await readFile("package.json", "utf-8"));
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    await esbuild({
      entryPoints: ["server/index.ts"],
      platform: "node",
      bundle: true,
      format: "cjs",
      outfile: "dist/index.cjs",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      minify: true,
      external: externals,
      logLevel: "info",
    });

    console.log("✅ MeeBotV2 Built Successfully!");
  } catch (err) {
    console.error("❌ Build process failed:");
    console.error(err);
    process.exit(1);
  }
}

buildAll();
