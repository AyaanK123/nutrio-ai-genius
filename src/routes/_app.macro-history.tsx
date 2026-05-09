import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


export const Route = createFileRoute("/_app/macro-history")({
  component: MacroHistoryPage,
});

function MacroHistoryPage() {

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/macro-history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="space-y-6 p-6">
        <div className="rounded-2xl border bg-card p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Calories Trend
            </h2>

            <div className="h-[300px]">

                <ResponsiveContainer width="100%" height="100%">

                <LineChart data={history}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="id" />

                    <YAxis />

                    <Tooltip />

                    <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#22c55e"
                    strokeWidth={3}
                    />

                </LineChart>

                </ResponsiveContainer>

            </div>

        </div>


      <div>
        <h1 className="text-3xl font-bold">
          Macro History
        </h1>

        <p className="text-muted-foreground">
          Your previous macro calculations
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">

        <table className="w-full">

          <thead className="border-b bg-muted/50">

            <tr>

              <th className="p-4 text-left">
                Calories
              </th>

              <th className="p-4 text-left">
                Protein
              </th>

              <th className="p-4 text-left">
                Carbs
              </th>

              <th className="p-4 text-left">
                Fats
              </th>

              <th className="p-4 text-left">
                Goal
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map((entry) => (

              <tr
                key={entry.id}
                className="border-b"
              >

                <td className="p-4">
                  {entry.calories}
                </td>

                <td className="p-4">
                  {entry.protein}g
                </td>

                <td className="p-4">
                  {entry.carbs}g
                </td>

                <td className="p-4">
                  {entry.fats}g
                </td>

                <td className="p-4 capitalize">
                  {entry.goal}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}