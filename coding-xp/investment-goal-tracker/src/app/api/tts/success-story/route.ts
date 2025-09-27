import { NextRequest } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export const runtime = "nodejs"; // ensure Node runtime

export async function POST(req: NextRequest) {
  try {
  const requestBody = await req.json();
  const { name, text } = requestBody as { name?: string; text?: string };

    if (!name || !text) {
      return new Response(JSON.stringify({ error: "name and text are required" }), { status: 400 });
    }

    const workspaceRoot = process.cwd();
    const scriptPath = path.join(workspaceRoot, "scripts", "tts_success_story.py");
    const outDir = path.join(workspaceRoot, "public", "audio", "success-stories");

    await fs.promises.mkdir(outDir, { recursive: true });

    // Spawn Python process
    // Try multiple python commands for better Windows compatibility
    const pythonCandidates = [process.env.PYTHON, "python", "py", "python3"].filter(Boolean) as string[];
    let proc: ReturnType<typeof spawn> | null = null;
    let lastErr: string | null = null;
    const args = [scriptPath, "--name", name, "--text", text, "--outDir", outDir];
    for (const cmd of pythonCandidates) {
      proc = spawn(cmd, args, { cwd: workspaceRoot });
      if (proc) break;
    }
    if (!proc) {
      return new Response(JSON.stringify({ error: "No Python interpreter found", details: lastErr }), { status: 500 });
    }

  let stdout = "";
  let stderr = "";
  if (proc.stdout) proc.stdout.on("data", (d) => (stdout += d.toString()));
  if (proc.stderr) proc.stderr.on("data", (d) => (stderr += d.toString()));

    const exitCode: number = await new Promise((resolve, reject) => {
      proc!.on("error", reject);
      proc!.on("close", resolve);
    }) as number;

    if (exitCode !== 0) {
      const message = (stderr || stdout || "TTS script error").toString();
      console.error("TTS script failed:", message);
      return new Response(JSON.stringify({ error: "TTS failed", details: message }), { status: 500 });
    }

    const filePath = stdout.trim();
    if (!filePath || !(await fs.promises.stat(filePath).then(() => true).catch(() => false))) {
      return new Response(JSON.stringify({ error: "Audio file not generated" }), { status: 500 });
    }
    const ext = path.extname(filePath).toLowerCase();
    const nodeBuffer = await fs.promises.readFile(filePath);
    const contentType = ext === ".wav" ? "audio/wav" : "audio/mpeg";
    // Create a fresh ArrayBuffer copy to avoid SharedArrayBuffer typing issues
    const ab = new Uint8Array(nodeBuffer).slice().buffer as ArrayBuffer;
    return new Response(ab, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), { status: 500 });
  }
}
