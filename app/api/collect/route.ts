import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Gọi ip-api để lấy thông tin từ IP
    const ipInfoRes = await fetch(
      `http://ip-api.com/json/${data.ip}?fields=status,message,country,regionName,city,lat,lon,isp,org,as,query`
    );
    const ipInfo = await ipInfoRes.json();

    const googleMapLink = ipInfo.lat && ipInfo.lon
      ? `https://www.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}`
      : "unknown";

    const message = `
🌐 *New Visit*
📡 IP: ${data.ip}
🏳️ Country: ${ipInfo.country || "unknown"}
🏙️ City: ${ipInfo.city || "unknown"}
🏢 ISP: ${ipInfo.isp || "unknown"}
🏛️ Org: ${ipInfo.org || "unknown"}
🔢 ASN: ${ipInfo.as || "unknown"}
🗺️ Location: [Google Maps](${googleMapLink})

🖥️ User Agent: ${data.userAgent}
🗣️ Language: ${data.language}
🕒 Timezone: ${data.timezone}
🖼️ Screen: ${data.screenWidth}x${data.screenHeight}
↩️ Referrer: ${data.referrer || "none"}
📶 Network: ${data.network || "unknown"}
💻 Platform: ${data.platform}
⏰ Visit Time: ${new Date().toLocaleString("vi-VN")}
`;

    // Gửi message qua Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
