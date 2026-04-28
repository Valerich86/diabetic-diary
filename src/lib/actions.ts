import { pool } from "./db";

export async function getAllEntriesPerDate(userId: number, targetDate: string) {
  try {
    const result = await pool.query(
      `SELECT
        'Приём пищи' AS record_type,
        date,
        time,
        description AS detail,
        portion_size AS extra_info,
        carbs,
        bread_units,
        comment
      FROM food_intakes
      WHERE user_id = $1 AND date = $2

      UNION ALL

      SELECT
        'Инъекция инсулина' AS record_type,
        date,
        time,
        CAST(amount AS TEXT) AS detail,
        NULL AS extra_info,
        NULL AS carbs,
        NULL AS bread_units,
        comment
      FROM insulin_injections
      WHERE user_id = $1 AND date = $2

      UNION ALL

      SELECT
        'Измерение глюкозы' AS record_type,
        date,
        time,
        CAST(amount AS TEXT) AS detail,
        NULL AS extra_info,
        NULL AS carbs,
        NULL AS bread_units,
        comment
      FROM glucose_measurements
      WHERE user_id = $1 AND date = $2

      ORDER BY time;
      `,
      [Number(userId), targetDate],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
  }
}
