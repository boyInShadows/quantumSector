"use client";
import { useState } from "react";
import TradingViewWidget from "./tradingview";

export default function BotTestPage() {
  const [result, setResult] = useState(null);

  const triggerBot = async () => {
    const res = await fetch("http://localhost:5000/simulate", {
      method: "POST",
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 BTC/USDT Bot Test</h1>
      <TradingViewWidget />

      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={triggerBot}
        >
          Run Bot Strategy
        </button>

        {result && (
          <div className="mt-4 bg-gray-900 text-white p-4 rounded">
            <p>
              <strong>Signal:</strong> {result.signal}
            </p>
            {result.entry && (
              <>
                <p>
                  <strong>Entry:</strong> ${result.entry.toFixed(2)}
                </p>
                <p>
                  <strong>Stop Loss:</strong> ${result.stop_loss.toFixed(2)}
                </p>
                <p>
                  <strong>Take Profit:</strong> ${result.take_profit.toFixed(2)}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
