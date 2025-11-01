import { ImageResponse } from "next/og";
import { generateQRData } from "@/lib/swissqrbill/qr-code";
import type { Data } from "@/lib/swissqrbill/types";
import QRCode from "qrcode";

export const runtime = "edge";

function isData(obj: unknown): obj is Data {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const data = obj as Data;
  return (
    typeof data.creditor?.name === "string" &&
    typeof data.creditor?.address === "string" &&
    (typeof data.creditor?.zip === "string" ||
      typeof data.creditor?.zip === "number") &&
    typeof data.creditor?.city === "string" &&
    typeof data.creditor?.account === "string" &&
    (data.amount === undefined || typeof data.amount === "number")
  );
}

function getData(encodedData: string): Data | null {
  try {
    const decodedData = atob(encodedData.replace(/-/g, "+").replace(/_/g, "/"));
    const data: unknown = JSON.parse(decodedData);
    if (isData(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

type RouteContext = {
  params: Promise<{ data: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { data: encodedData } = await context.params;
  const data = getData(encodedData);

  if (!data) {
    return new Response("Invalid QR data", { status: 400 });
  }

  try {
    // Generate QR code as SVG string (works in Edge runtime)
    const qrData = generateQRData(data);
    const qrCodeSvg = await QRCode.toString(qrData, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 0,
      width: 800,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Convert SVG to data URL using btoa (works in Edge runtime)
    const qrCodeDataUrl = `data:image/svg+xml;base64,${btoa(qrCodeSvg)}`;

    // Create Open Graph image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            padding: "60px",
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "#000000",
              }}
            >
              MonkeyPay
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "20px",
              border: "4px solid #e5e7eb",
              marginBottom: "40px",
            }}
          >
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              width="400"
              height="400"
              style={{
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Payment Details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              fontSize: "28px",
              color: "#374151",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 600,
                color: "#000000",
              }}
            >
              {data.creditor.name}
            </div>
            <div
              style={{
                display: data.amount ? "flex" : "none",
                fontSize: "36px",
                fontWeight: 700,
                color: "#059669",
              }}
            >
              CHF {data.amount ? data.amount.toFixed(2) : "0.00"}
            </div>
            <div style={{ fontSize: "24px", color: "#6b7280" }}>
              Scan to pay with your banking app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
