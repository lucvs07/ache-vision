import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card, CardContent, Typography } from "@mui/material";

const mockData = [
  { x: 1, y: 20 },
  { x: 2, y: 35 },
  { x: 3, y: 30 },
  { x: 4, y: 45 },
  { x: 5, y: 40 },
];

export default function MockLineChart() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Mock Line Chart
        </Typography>
        <LineChart
          xAxis={[{ dataKey: "x", label: "X Axis" }]}
          series={[
            {
              data: mockData.map((point) => point.y),
              label: "Sample Series",
            },
          ]}
          width={500}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
