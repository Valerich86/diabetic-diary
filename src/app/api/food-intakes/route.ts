import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { pool } from "@/lib/db";

const FoodIntakeFormSchema = z.object({
  user_id: z.number().int().positive(),
  meal_date: z.string().date(),
  meal_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/),
  description: z
    .string()
    .min(1, "Описание не может быть пустым")
    .max(500, "Описание не должен превышать 500 символов"),
  portion_size: z.enum(["обычный", "меньше обычного", "больше обычного"]),
  carbs: z.number().optional(),
  bread_units: z.number().optional(),
  comment: z
    .string()
    .max(1000, "Комментарий не должен превышать 1000 символов")
    .optional()
    .default(""),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedFields = await FoodIntakeFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const {
    user_id,
    meal_date,
    meal_time,
    description,
    portion_size,
    carbs,
    bread_units,
    comment,
  } = validatedFields.data;
  try {
    const result = await pool.query(
      `INSERT INTO food_intakes 
      (user_id, date, time, description, portion_size, carbs, bread_units, comment) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        user_id,
        meal_date,
        meal_time,
        description,
        portion_size,
        carbs,
        bread_units,
        comment,
      ],
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
