"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables, annotationPlugin);

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
  startDate: string;
  endDate: string;
}

const RANGE_NORMAL = { min: 3, max: 7 };
const RANGE_UNSATISFACTORY = { min: 7, max: 10 };
const RANGE_CRITICAL = { below: 3, above: 10 };

// Вспомогательная функция для форматирования даты
const getFormattedDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    fDate: date.toISOString().split("T")[0], // формат YYYY-MM-DD
  };
};

export default function GlucoseChart({
  data,
  startDate,
  endDate,
}: GlucoseChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!chartRef.current) return;

    // Сортируем данные по дате
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    const labels = sortedData.map(
      (record) =>
        `${new Date(record.date).toLocaleDateString('ru-RU')} ${record.time.substring(0, 5)}`,
    );
    const values = sortedData.map((record) => record.amount);

    // const fixedOffset = 10;
    // chartRef.current.style.width = `${fixedOffset*sortedData.length}%`;
    // console.log(chartRef.current.style.width)

    // Уничтожаем предыдущий график, если он есть
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Создаём новый график
    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Уровень глюкозы",
            data: values,
            borderColor: "#CE1F26", // фиксированный цвет линии
            fill: false,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#CE1F26",
            pointBorderColor: "white",
            pointBorderWidth: 2,
            tension: 0.4, // плавность линии
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          annotation: {
            annotations: {
              // Фон: зоны с разными цветами
              background1: {
                type: "box",
                yMin: 0,
                yMax: 3,
                backgroundColor: "#CE1F2670",
                z: -1,
              },
              background2: {
                type: "box",
                yMin: 3,
                yMax: 7,
                backgroundColor: "#27F53C70",
                z: -1,
              },
              background3: {
                type: "box",
                yMin: 7,
                yMax: 10,
                backgroundColor: "#F1D32370",
                z: -1,
              },
              background4: {
                type: "box",
                yMin: 10,
                backgroundColor: "#CE1F2670",
                z: -1,
              },
              // Пунктирные линии на границах
              line1: {
                type: "line",
                yMin: 3,
                yMax: 3,
                borderColor: "#CE1F26",
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: "3 ммоль/л",
                  position: "end",
                },
              },
              line2: {
                type: "line",
                yMin: 7,
                yMax: 7,
                borderColor: "#75C0C0",
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: "7 ммоль/л",
                  position: "end",
                },
              },
              line3: {
                type: "line",
                yMin: 10,
                yMax: 10,
                borderColor: "#F1D323",
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: "10 ммоль/л",
                  position: "end",
                },
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Дата и время" },
            ticks: { maxRotation: 90, minRotation: 45 },
          },
          y: {
            title: { display: true, text: "Уровень глюкозы (ммоль/л)" },
          },
        },
        onClick: (event, elements, chart) => {
          if (elements.length === 0) return;

          const elementIndex = elements[0].index;

          // Безопасное получение меток с проверкой
          const labels = chart.data?.labels;
          if (!labels || !labels[elementIndex]) {
            console.error(
              "Не удалось получить метку для индекса:",
              elementIndex,
            );
            return;
          }

          const label = String(labels[elementIndex]);

          // Извлекаем дату из метки (формат: «ДД.ММ.ГГГГ ЧЧ:ММ»)
          const dateString = label.split(" ")[0]; // Получаем часть до первого пробела

          // Проверка корректности формата даты
          if (!dateString || !dateString.includes(".")) {
            console.error("Некорректный формат метки:", label);
            return;
          }

          // Преобразуем в формат YYYY-MM-DD
          const dateParts = dateString.split(".");
          if (dateParts.length !== 3) {
            console.error("Некорректное разбиение даты:", dateString);
            return;
          }

          const [day, month, year] = dateParts;

          // Дополнительная проверка: убедимся, что все части — числа
          if (
            !/^\d{1,2}$/.test(day) ||
            !/^\d{1,2}$/.test(month) ||
            !/^\d{4}$/.test(year)
          ) {
            console.error("Некорректные числовые значения даты:", {
              day,
              month,
              year,
            });
            return;
          }

          const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

          const url = `/daily-records?startDate=${formattedDate}&endDate=${formattedDate}`;
          router.push(url);
        },
      },
    });
  }, [data, startDate, endDate]);

  return (
    <div className="w-full min-h-[70vh]">
      <canvas ref={chartRef} />
    </div>
  );
}
