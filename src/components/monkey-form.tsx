"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationError } from "@/lib/swissqrbill/errors";
import { renderQRCode, renderSwissCross } from "@/lib/swissqrbill/qr-code";
import type { Data } from "@/lib/swissqrbill/types";
import { cn } from "@/lib/utils";
import { ChevronDown, QrCode } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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

export function MonkeyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    fullname: "",
    street: "",
    zipcode: "",
    city: "",
    iban: "",
    amount: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateQrCodeSvg = useCallback((data: Data): string => {
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

    return `<svg viewBox="0 0 ${size} ${size}" fill="black" xmlns="http://www.w3.org/2000/svg">${qrPaths}${crossPaths}</svg>`;
  }, []);

  useEffect(() => {
    const savedDataString = localStorage.getItem("monkeypay_form_data");
    if (savedDataString) {
      try {
        const savedData: unknown = JSON.parse(savedDataString);
        if (isData(savedData)) {
          const svg = generateQrCodeSvg(savedData);
          setQrCodeSvg(svg);
          setFormState({
            fullname: savedData.creditor.name,
            street: savedData.creditor.address,
            zipcode: String(savedData.creditor.zip),
            city: savedData.creditor.city,
            iban: savedData.creditor.account,
            amount: savedData.amount ? String(savedData.amount) : "",
          });
        } else {
          console.error("Invalid data structure in localStorage");
          localStorage.removeItem("monkeypay_form_data");
        }
      } catch (e: unknown) {
        console.error("Failed to load or process data from localStorage", e);
        localStorage.removeItem("monkeypay_form_data");
      }
    }
  }, [generateQrCodeSvg]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setQrCodeSvg(null);

    const { fullname, street, zipcode, city, iban, amount } = formState;

    const data: Data = {
      currency: "CHF",
      creditor: {
        name: fullname,
        address: street,
        zip: zipcode,
        city: city,
        account: iban,
        country: "CH",
      },
    };

    if (amount) {
      data.amount = parseFloat(amount);
    }

    try {
      const svg = generateQrCodeSvg(data);
      setQrCodeSvg(svg);
      localStorage.setItem("monkeypay_form_data", JSON.stringify(data));
      toast.success("QR code generated successfully!");
    } catch (e) {
      if (e instanceof ValidationError) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
        console.error(e);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid md:grid-cols-2">
          <form className="p-2 sm:p-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">
                  No Twint? No problem.
                </h1>
                <p className="text-balance text-muted-foreground text-sm sm:text-base">
                  Generate and share Swiss QR-bills with MonkeyPay.
                </p>
              </div>

              {/* Mobile QR Preview */}
              <div className="flex justify-center md:hidden">
                <div className="bg-muted h-52 w-52 p-4 rounded-lg shadow-inner flex flex-col items-center justify-center gap-2">
                  {qrCodeSvg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                      className="h-40 w-40"
                    />
                  ) : (
                    <>
                      <QrCode className="h-28 w-28 text-muted-foreground" />
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-xs text-muted-foreground text-center">
                          Get started below
                        </p>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={formState.fullname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="Enter your street"
                  required
                  value={formState.street}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zipcode">ZIP Code</Label>
                  <Input
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    placeholder="8001"
                    required
                    value={formState.zipcode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Zurich"
                    required
                    value={formState.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Banking information
                </span>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  name="iban"
                  type="text"
                  placeholder="CH93 0000 0000 0000 0000 0"
                  required
                  value={formState.iban}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">
                  Amount{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    (optional)
                  </span>
                </Label>
                <div className="flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <div className="shrink-0 text-muted-foreground select-none">
                    CHF
                  </div>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    className="block min-w-0 grow bg-transparent pl-2 text-base sm:text-sm placeholder:text-muted-foreground focus:outline-none"
                    value={formState.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Generate
              </Button>

              {/* <div className="text-center text-sm">
                Powered by{" "}
                <Link
                  href="https://monkeypay.ch"
                  className="underline underline-offset-4"
                >
                  MonkeyPay
                </Link>
              </div> */}
            </div>
          </form>

          {/* Desktop QR Preview */}
          <div className="relative hidden bg-muted md:block -my-6 -mr-6 ml-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white h-60 w-60 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center gap-3">
                {qrCodeSvg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    className="h-full w-full"
                  />
                ) : (
                  <>
                    <QrCode className="h-28 w-28 text-gray-400" />
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-gray-500 text-center max-w-34">
                        Get started by filling out the form
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
