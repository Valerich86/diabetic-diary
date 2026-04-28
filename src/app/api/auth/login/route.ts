import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

async function validateUserCredentials(phone: string, password: string): Promise<{
  isValid: boolean;
  userId?: number;
  userName?: string;
}> {
  try {
    const result = await pool.query(
      `SELECT id, name, password FROM users WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return { isValid: false }; // Пользователь не найден
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return {
      isValid: isPasswordValid,
      userId: user.id,
      userName: user.name
    };
  } catch (error) {
    console.error("Ошибка проверки учётных данных:", error);
    throw new Error("Ошибка проверки данных авторизации.");
  }
}

export async function POST(req: Request) {
  const { phone, password } = await req.json();
  try {
    const validationResult = await validateUserCredentials(phone, password);

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }
    // Создаём токен сессии
    const token = await createSessionToken(validationResult.userId, validationResult.userName);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `dia-dia_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json(
      { error: "Ошибка авторизации" },
      { status: 500 }
    );
  }
}