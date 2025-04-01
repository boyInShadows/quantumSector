"use client";
import { useState } from "react";

export default function BotTestPage() {
  const [backtestResult, setBacktestResult] = useState(null);
  const [liveResult, setLiveResult] = useState(null);
  const [loading, setLoading] = useState({ backtest: false, live: false });

  const runBacktest = async () => {
    setLoading((prev) => ({ ...prev, backtest: true }));
    try {
      const res = await fetch("http://localhost:5000/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial_balance: 100, days: 30 }),
      });
      const data = await res.json();
      setBacktestResult(data);
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, backtest: false }));
    }
  };

  const runLiveTrade = async () => {
    setLoading((prev) => ({ ...prev, live: true }));
    try {
      const res = await fetch("http://localhost:5000/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial_balance: 100 }),
      });
      const data = await res.json();
      setLiveResult(data);
    } catch (error) {
      console.error("Live trade error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, live: false }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🚀 ETH/USDT Scalping Bot</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backtest Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 30-Day Backtest</h2>
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${
              loading.backtest ? "opacity-50" : ""
            }`}
            onClick={runBacktest}
            disabled={loading.backtest}
          >
            {loading.backtest ? "Running Backtest..." : "Run 30-Day Backtest"}
          </button>

          {backtestResult && (
            <div className="mt-4 bg-gray-900 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Backtest Results</h3>
              <p>Initial Balance: ${backtestResult.results.initial_balance}</p>
              <p>
                Final Balance: $
                {backtestResult.results.final_balance.toFixed(2)}
              </p>
              <p
                className={
                  backtestResult.results.total_profit >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                Profit: ${backtestResult.results.total_profit.toFixed(2)} (
                {backtestResult.results.profit_pct.toFixed(2)}%)
              </p>
              <p>Trades: {backtestResult.results.num_trades}</p>
              <p>Win Rate: {backtestResult.results.win_rate.toFixed(2)}%</p>
              <p className="text-sm text-gray-400 mt-2">
                Results saved to: {backtestResult.file}
              </p>
            </div>
          )}
        </div>

        {/* Live Trade Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔴 Live Trading</h2>
          <button
            className={`bg-red-600 text-white px-4 py-2 rounded w-full ${
              loading.live ? "opacity-50" : ""
            }`}
            onClick={runLiveTrade}
            disabled={loading.live}
          >
            {loading.live ? "Executing Trade..." : "Execute Live Trade"}
          </button>

          {liveResult && (
            <div className="mt-4 bg-gray-900 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Live Trade</h3>
              <p>
                Signal:
                <span
                  className={`ml-2 font-bold ${
                    liveResult.signal === "buy"
                      ? "text-green-400"
                      : liveResult.signal === "sell"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {liveResult.signal.toUpperCase()}
                </span>
              </p>
              <p>Price: ${liveResult.price.toFixed(2)}</p>
              <p>Executed: {liveResult.executed ? "Yes" : "No"}</p>
              <p>USDT Balance: ${liveResult.balance.toFixed(2)}</p>
              <p>ETH Balance: {liveResult.eth_balance.toFixed(6)}</p>

              {liveResult.results && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <h4 className="font-semibold">Trade Results</h4>
                  <p>Profit: ${liveResult.results.total_profit.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">
                    Results saved to: {liveResult.file}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trade History */}
      {(backtestResult?.results?.trades || liveResult?.results?.trades) && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📝 Trade History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-2">Type</th>
                  <th className="p-2">Entry Price</th>
                  <th className="p-2">Exit Price</th>
                  <th className="p-2">Profit</th>
                  <th className="p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {backtestResult?.results?.trades?.map((trade, i) => (
                  <tr
                    key={`backtest-${i}`}
                    className="border-b border-gray-700"
                  >
                    <td className="p-2">Backtest</td>
                    <td className="p-2">${trade.entry_price.toFixed(2)}</td>
                    <td className="p-2">${trade.exit_price.toFixed(2)}</td>
                    <td
                      className={`p-2 ${
                        trade.profit >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${trade.profit.toFixed(2)} ({trade.profit_pct.toFixed(2)}
                      %)
                    </td>
                    <td className="p-2">
                      {new Date(trade.entry_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {liveResult?.results?.trades?.map((trade, i) => (
                  <tr key={`live-${i}`} className="border-b border-gray-700">
                    <td className="p-2">Live</td>
                    <td className="p-2">${trade.entry_price.toFixed(2)}</td>
                    <td className="p-2">${trade.exit_price.toFixed(2)}</td>
                    <td
                      className={`p-2 ${
                        trade.profit >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${trade.profit.toFixed(2)} ({trade.profit_pct.toFixed(2)}
                      %)
                    </td>
                    <td className="p-2">
                      {new Date(trade.entry_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
