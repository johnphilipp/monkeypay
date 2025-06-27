import { MonkeyForm } from "@/components/monkey-form";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6 md:max-w-3xl">
        <Link
          href="#"
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
        <MonkeyForm />
      </div>
    </div>
  );
}
