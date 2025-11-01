import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

const TEAM = [
  {
    name: "Raffaello",
    linkedin: "https://www.linkedin.com/in/raffaello-erculiani-8186a1113/",
    image: "/raffaello.jpeg",
  },
  {
    name: "Fabian",
    linkedin: "https://www.linkedin.com/in/fabian-wueest/",
    image: "/fabian.jpeg",
  },
  {
    name: "Philipp",
    linkedin: "https://www.linkedin.com/in/philipp-john/",
    image: "/philipp.jpeg",
  },
  {
      name: "Bryan",
      linkedin: "https://www.linkedin.com/btr-dev",
      image: "/bryan.jpg"
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <Header />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">
            Why we built MonkeyPay
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            MonkeyPay was born out of a real problem: splitting a restaurant
            bill in Switzerland when one person doesn&apos;t have TWINT. We
            wanted a simple, secure way to share and pay bills—no app installs,
            no accounts, just a QR code anyone can scan with their banking app.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/twint-vs-monkeypay.png"
            alt="Trying to pay a restaurant bill with and without TWINT"
            width={400}
            height={600}
            className="rounded-xl border shadow-lg"
            priority
          />
          <span className="text-xs text-muted-foreground">
            Splitting a bill in Switzerland: not everyone has TWINT!
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            Secure by design
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Your data always stays on your device. We never store or transmit
            your payment details to any server. Everything happens right in your
            browser. If you want to dig even deeper, take a look at our open
            source code on{" "}
            <Link
              href="https://github.com/johnphilipp/monkeypay"
              className="underline"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Meet the Team
          </h2>
          <div className="grid grid-cols-3 gap-8 sm:gap-12">
            {TEAM.map((member) => (
              <Link
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={69}
                  height={69}
                  className="h-20 w-20 rounded-full group-hover:shadow-lg group-hover:scale-105 transition-transform object-cover"
                />
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm sm:text-base group-hover:underline">
                    {member.name}
                  </span>
                  <FaLinkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-105 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
