"use client";

import { useEffect, useRef, useState } from "react";
import { getFormattedDateTime } from "@/lib/time-date-formatter";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { font_headline } from "@/lib/fonts";

interface GlucoseRecord {
  id: number;
  date: string;
  time: string;
  amount: number;
  comment: string | null;
  created_at: string;
}

interface GlucoseChartProps {
  data: GlucoseRecord[];
}

const RANGE_NORMAL = { min: 3, max: 7 };
const RANGE_UNSATISFACTORY = { min: 7, max: 10 };
const RANGE_CRITICAL = { below: 3, above: 10 };

export default function GlucoseChart({
  data,
}: GlucoseChartProps) {
  const router = useRouter();
  const chartWidth = `${data.length * 100}px`;

  // Сортируем данные по дате
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Форматируем метки
  const formattedData = sortedData.map((record) => ({
    ...record,
    label: `${new Date(record.date).toLocaleDateString("ru-RU")}, ${record.time.substring(0, 5)}`,
    formattedDate: getFormattedDateTime(record.date).fDate,
  }));

  // Вычисляем min и max из данных
  const yValues = formattedData.map((point) => point.amount);
  const maxY = Math.ceil(Math.max(...yValues)) + 3; // с запасом вверх

  // Определяем зоны для фона
  const glucoseZones = [
    {
      y1: 0,
      y2: RANGE_CRITICAL.below,
      color: "#CE1F26",
      opacity: 0.3,
    },
    {
      y1: RANGE_CRITICAL.below,
      y2: RANGE_NORMAL.min,
      color: "#F1D323",
      opacity: 0.2,
    },
    {
      y1: RANGE_NORMAL.min,
      y2: RANGE_NORMAL.max,
      color: "#27F53C",
      opacity: 0.15,
    },
    {
      y1: RANGE_NORMAL.max,
      y2: RANGE_UNSATISFACTORY.max,
      color: "#F1D323",
      opacity: 0.2,
    },
    {
      y1: RANGE_UNSATISFACTORY.max,
      y2: maxY > 11 ? maxY : 11,
      color: "#CE1F26",
      opacity: 0.3,
    },
  ];
  // Генерируем массив тиков с шагом 1
  const yTicks = Array.from({ length: maxY - 1 }, (_, i) => i);

  const CustomPoint = ({ cx, cy, payload, index }: any) => {
    const router = useRouter();

    const handleClick = () => {
      if (!payload?.date) return;
      const targetDate = payload.date.split("T")[0];
      const url = `/daily-records?startDate=${targetDate}&endDate=${targetDate}`;
      router.push(url);
    };

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#CE1F26"
        stroke="white"
        strokeWidth={2}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
    );
  };

  return (
    <div className="w-full min-h-[70vh] overflow-x-auto border border-secondary-blue bg-primary-milk rounded-xl">
      <div className={`${font_headline.className}`} style={{ minWidth: chartWidth }}>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={formattedData}
            margin={{ top: 20, left: 20, bottom: 60 }}
          >
            {/* Фон: зоны с разными цветами */}
            {glucoseZones.map((zone, index) => (
              <ReferenceArea
                key={index}
                y1={zone.y1}
                y2={zone.y2}
                stroke="none"
                fill={zone.color}
                fillOpacity={zone.opacity}
              />
            ))}

            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="label"
              tick={{ angle: -60, textAnchor: "end", fontSize: 12, fill: "#DC2626", fontWeight: "bolder" }}
              height={60}
              interval={0}
              padding={{ left: 10, right: 10 }}
              style={{fill: "black", fontWeight: "bolder", fontSize: 12}}
            />
            <YAxis
              label={{
                value: "Уровень глюкозы (ммоль/л)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#DC2626", fontWeight: "bolder", fontSize: 16 },
              }}
              interval={1}
              domain={[0, maxY]}
              tick={{fill: "#DC2626", fontWeight: "bolder", fontSize: 12}}
              ticks={yTicks}
            />
            <Tooltip
              labelFormatter={(label) => label}
              formatter={(value) => {
                if (value == null) return ["", ""]; // обрабатываем null и undefined
                return [`${Number(value).toFixed(1)} ммоль/л`, ""];
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#CE1F26"
              fill="url(#colorAmount)"
              strokeWidth={2}
              dot={<CustomPoint />}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
