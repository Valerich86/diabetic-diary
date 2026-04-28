import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET (request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { userId, startDate, endDate } = Object.fromEntries(
      searchParams.entries(),
    );
    const result = await pool.query(
      `SELECT date,
      json_agg(
        json_build_object(
          'id', id,
          'record_type', record_type,
          'time', time,
          'detail', detail,
          'extra_info', extra_info,
          'carbs', carbs,
          'bread_units', bread_units,
          'comment', comment
        )
      ) AS daily_records FROM (
        SELECT
          'Приём пищи' AS record_type,
          id,
          date,
          time,
          description AS detail,
          portion_size AS extra_info,
          carbs,
          bread_units,
          comment
        FROM food_intakes
        WHERE user_id = $1 AND date >= $2 AND date <= $3
        UNION ALL
        SELECT
          'Инъекция инсулина' AS record_type,
          id,
          date,
          time,
          CAST(amount AS TEXT) AS detail,
          NULL AS extra_info,
          NULL AS carbs,
          NULL AS bread_units,
          comment
        FROM insulin_injections
        WHERE user_id = $1 AND date >= $2 AND date <= $3
        UNION ALL
        SELECT
          'Измерение глюкозы' AS record_type,
          id,
          date,
          time,
          CAST(amount AS TEXT) AS detail,
          NULL AS extra_info,
          NULL AS carbs,
          NULL AS bread_units,
          comment
        FROM glucose_measurements
        WHERE user_id = $1 AND date >= $2 AND date <= $3
        ORDER BY time
        ) AS all_records
      GROUP BY date
      ORDER BY date;
      `, [Number(userId), startDate, endDate]
    );
    return NextResponse.json({data: result.rows, status: 200});
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { userId } = Object.fromEntries(searchParams.entries());
    const numId = Number(userId);
    await pool.query("BEGIN");
    await pool.query("DELETE FROM food_intakes WHERE user_id=$1", [numId]);
    await pool.query("DELETE FROM insulin_injections WHERE user_id=$1", [numId]);
    await pool.query("DELETE FROM glucose_measurements WHERE user_id=$1", [numId]);
    await pool.query("COMMIT");
    return NextResponse.json({ status: 204 });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}