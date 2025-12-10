"use client";

import { useEffect, useState } from "react";
import { SensorData } from "@/types/sensor-values";

export default function ApiTest() {
  const [data, setData] = useState<SensorData | null>(null);
  const [lastReply, setLastReply] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<string>("");

  // send command

  const sendHello = async () => {
    try {
      const res = await fetch("/api/arduino/send-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "hello" }),
      });
      if (!res.ok) throw new Error("Server error");
      setMessageStatus('✅ Sent command "hello"');
    } catch (err) {
      console.error(err);
      setMessageStatus("❌ Error sending command");
    }
  };

  // fetch data every 6 seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/arduino/send-data", { cache: "no-store" });
        const json: SensorData & { lastReply?: string } = await res.json();
        setData(json);

        if (json.lastReply) setLastReply(json.lastReply);
      } catch (err) {
        console.error(err);
        setData(null);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>
        Device Status: {data?.connected ? "✅ Connected" : "❌ Disconnected"}
      </h1>
      <h2>🕒 Time: {data?.time ?? "N/A"}</h2>
      <h2>📅 Date: {data?.date ?? "N/A"}</h2>
      <h2>💧 Turbidity: {data?.turbid ?? "N/A"}</h2>
      <h2>🧪 pH Level: {data?.ph ?? "N/A"}</h2>
      <h2>🌡️ Water Temperature: {data?.water_temp ?? "N/A"} °C</h2>
      <h2>
        Water Level Normal:{" "}
        {data ? (data.float_switch ? "✅ Yes" : "❌ No") : "N/A"}
      </h2>
      <h2>TDS: {data?.tds ?? "N/A"} ppm</h2>
      <h2>NH3 Gas: {data?.nh3_gas ?? "N/A"} ppm</h2>
      <h2>
        Web Time:{" "}
        {data?.created_at ? new Date(data.created_at).toLocaleTimeString() : "N/A"}
      </h2>

      <button
        onClick={sendHello}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg mt-4"
      >
        Send Hello
      </button>

      {messageStatus && <p>{messageStatus}</p>}
      {lastReply && <p>🤖 Arduino last replied: {lastReply}</p>}
    </main>
  );
}
