import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!userId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `SELECT
        id,
        date,
        time,
        amount,
        comment,
        created_at
      FROM glucose_measurements
      WHERE user_id = $1
        AND date >= $2
        AND date <= $3
      ORDER BY date, time`,
      [Number(userId), startDate, endDate]
    );

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching glucose data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
