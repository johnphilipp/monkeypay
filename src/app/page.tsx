import { Header } from "@/components/header";
import { QRForm } from "@/components/qr-form";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6 md:max-w-3xl">
        <Header />
        <QRForm />
        <div className="items-center gap-1 flex flex-col md:flex-row self-center">
          <ShieldCheck className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm sm:text-base text-muted-foreground flex flex-col md:block items-center md:items-start">
            Your data always stays on your device.{" "}
            <Link href="/learn-more" className="underline hover:cursor-pointer">
              Learn more
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
