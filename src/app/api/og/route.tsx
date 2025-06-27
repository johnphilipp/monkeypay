import { renderQRCode, renderSwissCross } from "@/lib/swissqrbill/qr-code";
import type { Data } from "@/lib/swissqrbill/types";
import { ImageResponse } from "@vercel/og";
import Image from "next/image";
import { NextRequest } from "next/server";

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

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dataParam = searchParams.get("data");

  if (!dataParam) {
    return new Response("Missing data parameter", { status: 400 });
  }

  try {
    const decodedData = atob(dataParam.replace(/-/g, "+").replace(/_/g, "/"));
    const data: unknown = JSON.parse(decodedData);

    if (!isData(data)) {
      return new Response("Invalid data structure", { status: 400 });
    }

    const size = 512;
    let qrPaths = "";
    const renderBlock = (x: number, y: number, blockSize: number) => {
      qrPaths += `<rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" />`;
    };

    let crossPaths = "";
    const renderCrossRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      fillColor: string
    ) => {
      crossPaths += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fillColor}" />`;
    };

    renderQRCode(data, size, renderBlock);
    renderSwissCross(size, renderCrossRect);

    const qrCodeSvg = `<svg viewBox="0 0 ${size} ${size}" fill="black" xmlns="http://www.w3.org/2000/svg">${qrPaths}${crossPaths}</svg>`;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#f0f0f0",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{ width: "256px", height: "256px" }}
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Image
                src="https://monkeypay.ch/monkeypay_logo.svg"
                width="32"
                height="32"
                alt="logo"
              />
              <span style={{ fontSize: "24px", color: "#4a4a4a" }}>
                MonkeyPay
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate QR code image", { status: 500 });
  }
}
