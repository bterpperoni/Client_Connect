"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "$/app/_components/ui/card";
import { ChartContainer } from "$/app/_components/ui/chart";
import { type PolarViewBox } from "recharts/types/util/types";
import { type Task } from "@prisma/client";

type ComponentProps = {
  children: React.ReactNode;
  category: string;
  tasks: Task[];
  classList: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B20000"];

export default function ChartDonut({
  children,
  category,
  tasks,
  classList,
}: ComponentProps) {
  const chartData = React.useMemo(() => {
    return tasks.map((task) => ({
      name: task.title,
      value: task.importanceScore,
      fill: COLORS[task.importanceScore - 1],
    }));
  }, [tasks]);

  const totalScore = React.useMemo(() => {
    return tasks.reduce((acc, curr) => acc + curr.importanceScore, 0);
  }, [tasks]);

  return (
    <Card className={`flex flex-col mt-4 ${classList}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl">{category}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square h-[25vh] w-max"
          config={
            // Add your chart configuration
            // https://recharts.org/api/api
            // https://recharts.org/api/api#piechart
            {}
          }
        >
          <PieChart width={350} height={200}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}

              {/* Label animé avec vérifications pour le rendu */}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null;
                  }

                  const { cx, cy } = viewBox as PolarViewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        dy="-0.5em"
                        className="fill-foreground text-2xl font-bold"
                      >
                        {children}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy}
                        dy="1.5em"
                        className="fill-muted-foreground text-sm"
                      >
                        Completed
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <Tooltip
              accessibilityLayer={true}
              labelStyle={{ color: "black" }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const data = payload[0]?.payload;
                  return (
                    <div className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-950">
                      <div className="font-bold">{data?.name}</div>
                      <div>Score: {data?.value}</div>
                      {Math.floor((data?.value / totalScore) * 100)}%
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
