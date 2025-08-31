import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography } from "@mui/material";

export default function MockLineChart() {
  return (
    <div className="w-full h-full bg-transparent shadow-none rounded-lg flex flex-col min-w-0 min-h-0">
      <Typography variant="h6" gutterBottom>
        Mock Line Chart
      </Typography>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            color: "oklch(0.62 0.28 20)",
          },
        ]}
        height={350}
      />
    </div>
  );
}
