import { QrCode } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <Link href="/" className="flex items-center gap-2 font-medium self-center">
      <QrCode className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 shadow-inner bg-white p-1 border rounded-sm" />
      <span className="text-xl sm:text-2xl font-bold">MonkeyPay</span>
    </Link>
  );
}
