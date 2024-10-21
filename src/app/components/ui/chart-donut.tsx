"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "$/app/components/ui/card";
import { ChartContainer } from "$/app/components/ui/chart";
import { type PolarViewBox } from "recharts/types/util/types";
import { type Task } from "@prisma/client";

type ComponentProps = {
  percentage: number;
  category: string;
  tasks: Task[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B20000"];

export default function ChartDonut({
  percentage,
  category,
  tasks,
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
    <Card className="flex flex-col mt-4">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl">{category}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square h-[25vh] w-max"
          config={
            {
              /* provide valid config here */
            }
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
              <Label
                content={({ viewBox }) => {
                  // Vérifier si le viewBox est de type PolarViewBox (qui contient cx et cy)
                  if (
                    !viewBox ||
                    typeof (viewBox as PolarViewBox).cx === "undefined" ||
                    typeof (viewBox as PolarViewBox).cy === "undefined"
                  ) {
                    return null;
                  }

                  // On sait maintenant que viewBox est de type PolarViewBox
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
                        {percentage}%
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy}
                        dy="1.5em"
                        className="fill-muted-foreground text-sm"
                      >
                        Complete
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const data = payload?.[0] ? payload[0].payload : null;
                  return (
                    <div className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-950">
                      <p className="font-bold">{data.name}</p>
                      <p>Score: {data.value}</p>
                      <p>
                        Percentage:{" "}
                        {((data.value / totalScore) * 100).toFixed(2)}%
                      </p>
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
