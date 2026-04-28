import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { pool } from "@/lib/db";

const InsulinInjectionsFormSchema = z.object({
  user_id: z.number().int().positive(),
  measurement_date: z.string().date(),
  measurement_time: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/),
  amount: z.number(),
  comment: z
    .string()
    .max(1000, "Комментарий не должен превышать 1000 символов")
    .optional()
    .default(""),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedFields =
    await InsulinInjectionsFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { user_id, measurement_date, measurement_time, amount, comment } =
    validatedFields.data;
  try {
    const result = await pool.query(
      `INSERT INTO glucose_measurements 
      (user_id, date, time, amount, comment) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [user_id, measurement_date, measurement_time, amount, comment],
    );
    const newItemId = result.rows[0].id;
    return NextResponse.json({ newItemId: newItemId }, { status: 200 });
  } catch (error) {
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json(
      { error: "ошибка добавления данных" },
      { status: 500 },
    );
  }
}
