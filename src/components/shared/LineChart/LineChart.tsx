// React import não necessário com JSX automatic runtime
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography } from "@mui/material";
/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  title?: string;
  xAxis?: any[];
  series?: any[];
  height?: number;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function MockLineChart({
  title = "Gráfico",
  xAxis = [{ data: [] }],
  series = [],
  height = 300,
}: Props) {
  return (
    <div className="w-full h-full bg-transparent shadow-none rounded-lg flex flex-col min-w-0 min-h-0">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <LineChart xAxis={xAxis} series={series} height={height} />
    </div>
  );
}
