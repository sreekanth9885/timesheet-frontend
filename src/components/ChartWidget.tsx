// src/components/ChartWidget.tsx
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface ChartWidgetProps {
  type: "bar" | "doughnut";
  labels: string[];
  data: number[];
  title?: string;
  className?: string;
}

const ChartWidget = ({
  type,
  labels,
  data,
  title,
  className = "",
}: ChartWidgetProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart instance to prevent memory leaks
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const isBar = type === "bar";

    chartRef.current = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: isBar
              ? "rgba(74, 123, 176, 0.75)"
              : ["#4a7bb0", "#2e9e82", "#d98c2b", "#5a78c2", "#e05353"],
            borderColor: isBar ? "rgba(74, 123, 176, 1)" : "#e6ebf0",
            borderWidth: isBar ? 1.5 : 3,
            borderRadius: isBar ? 6 : 0,
            hoverBackgroundColor: isBar
              ? "rgba(74, 123, 176, 0.95)"
              : undefined,
            hoverOffset: isBar ? undefined : 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: isBar ? undefined : "68%",
        plugins: {
          legend: {
            display: !isBar,
            position: "bottom",
            labels: {
              color: "#263238",
              font: { family: "Inter", size: 12, weight: 500 },
              padding: 14,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: "#263238",
            titleColor: "#ffffff",
            bodyColor: "#e6ebf0",
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: isBar
          ? {
              y: {
                beginAtZero: true,
                grid: { color: "rgba(163, 177, 198, 0.35)" },
                ticks: {
                  color: "#68737d",
                  font: { family: "Inter", size: 12 },
                },
              },
              x: {
                grid: { display: false },
                ticks: {
                  color: "#68737d",
                  font: { family: "Inter", size: 12 },
                },
              },
            }
          : undefined,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, labels, data, title]);

  return (
    <div className={`relative w-full h-64 ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ChartWidget;
