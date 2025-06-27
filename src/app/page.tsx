import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-3xl">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/monkeypay_logo.svg"
              alt="MonkeyPay Logo"
              className="h-8 w-8"
              width={32}
              height={32}
            />
          </div>
          MonkeyPay
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
