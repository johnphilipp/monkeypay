import { renderQRCode, renderSwissCross } from "@/lib/swissqrbill/qr-code";
import type { Data } from "@/lib/swissqrbill/types";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ data: string }>;
};

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { data: encodedData } = await params;
  const data = getData(encodedData);

  if (!data) {
    return {
      title: "Invalid QR Bill",
    };
  }

  const title = "MonkeyPay Swiss QR Bill";
  const description = `QR bill for ${data.creditor.name}${
    data.amount ? ` for CHF ${data.amount.toFixed(2)}` : ""
  }.`;
  const url = `https://monkeypay.ch/qr/${encodedData}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: "website",
      images: [
        {
          url: `/api/og?data=${encodedData}`,
          width: 1200,
          height: 630,
          alt: "Swiss QR Bill",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`/api/og?data=${encodedData}`],
    },
  };
}

export default async function QrPage({ params }: PageProps) {
  const { data: encodedData } = await params;
  const data = getData(encodedData);

  if (!data) {
    notFound();
  }

  const size = 256;
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

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6 md:max-w-3xl">
        <Link
          href="/"
          className="flex items-baseline gap-2 self-center font-medium"
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
            <Image
              src="/monkeypay_logo.svg"
              alt="MonkeyPay Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
              width={48}
              height={48}
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold">MonkeyPay</span>
        </Link>

        <div className="flex flex-col items-center gap-6 rounded-2xl border bg-background p-8 shadow-xl">
          <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">Swiss QR Bill</h1>
            <p className="text-balance text-muted-foreground text-sm sm:text-base">
              Scan the code below with your banking app to pay.
            </p>
          </div>
          <div className="bg-muted h-52 w-52 p-4 rounded-lg shadow-inner flex flex-col items-center justify-center">
            <div
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
              className="h-40 w-40"
            />
          </div>
          <div className="w-full text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Payable to:</span>
              <span className="font-medium text-right">
                {data.creditor.name}
                <br />
                {data.creditor.address}
                <br />
                {`${data.creditor.zip} ${data.creditor.city}`}
              </span>
            </div>
            {data.amount && (
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  CHF {data.amount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">IBAN:</span>
              <span className="font-mono font-medium">
                {data.creditor.account}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 transition-colors hover:bg-muted/50"
          >
            <Image
              src="/monkeypay_logo.svg"
              alt="MonkeyPay Logo"
              width={20}
              height={20}
            />
            <span>Create your own QR bill with MonkeyPay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
