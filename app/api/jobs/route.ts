import { NextResponse } from "next/server";

// Note: In a real app, this would connect to a database
// For MVP, jobs are stored client-side in Zustand with localStorage persistence

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Jobs are stored client-side. Use the Zustand store.",
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Jobs are stored client-side. Use the Zustand store.",
  });
}
