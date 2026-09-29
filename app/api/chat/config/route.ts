import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../../auth";

/**
 * This API is to get config from the backend envs and expose them to the frontend
 */
export async function GET(request: NextRequest) {
  const denied = checkAuth(request.headers);
  if (denied) return denied;

  const config = {
    starterQuestions: process.env.CONVERSATION_STARTERS?.trim().split("\n"),
  };
  return NextResponse.json(config, { status: 200 });
}
