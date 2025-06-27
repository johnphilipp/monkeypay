import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { QrCode } from "lucide-react";
import Link from "next/link";
import type React from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">No Twint? No problem.</h1>
                <p className="text-balance text-muted-foreground">
                  Generate and share Swiss QR-bills with MonkeyPay.
                </p>
              </div>

              {/* Mobile QR Preview */}
              <div className="flex justify-center md:hidden">
                <div className="bg-muted h-32 w-32 rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  type="text"
                  placeholder="Enter your street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zipcode">ZIP Code</Label>
                  <Input id="zipcode" type="text" placeholder="8001" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" type="text" placeholder="Zurich" required />
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
                  type="text"
                  placeholder="CH93 0000 0000 0000 0000 0"
                  required
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
                    className="block min-w-0 grow bg-transparent pl-2 text-sm placeholder:text-muted-foreground focus:outline-none"
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
          <div className="relative hidden bg-muted md:block -my-6 -mr-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white h-42 w-42 p-8 rounded-lg shadow-sm flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-400" />
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
