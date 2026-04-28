import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { userId } = Object.fromEntries(
      searchParams.entries(),
    );
    await pool.query("DELETE FROM users WHERE id=$1", [Number(userId)]);
    return NextResponse.json({
      status: 204,
      headers: {
        "Set-Cookie":
          "dragon_bazar_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}