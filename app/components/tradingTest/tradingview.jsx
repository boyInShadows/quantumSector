// tradingview.jsx
"use client";
import { useEffect } from "react";

const TradingViewWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        container_id: "tv_chart_container",
        symbol: "BINANCE:BTCUSDT",
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        allow_symbol_change: true,
        autosize: true,
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <div id="tv_chart_container" style={{ height: "100%" }}></div>
    </div>
  );
};

export default TradingViewWidget;
