"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import Image from "next/image";

export default function Home() {
  const { t, dir } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24" dir={dir}>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {t.landing.title}
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          {t.landing.subtitle}
        </p>
        <div className="flex justify-center">
          <Link href="/invoice">
            <Button size="lg" className="text-lg px-8 py-6">
              {t.landing.cta}
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 9H8.5C8.22386 9 8 9.22386 8 9.5C8 9.77614 8.22386 10 8.5 10H15.5C15.7761 10 16 9.77614 16 9.5C16 9.22386 15.7761 9 15.5 9Z"
                  fill="currentColor"
                />
                <path
                  d="M8.5 11H12.5C12.7761 11 13 11.2239 13 11.5C13 11.7761 12.7761 12 12.5 12H8.5C8.22386 12 8 11.7761 8 11.5C8 11.2239 8.22386 11 8.5 11Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.5 5H17.5C18.3284 5 19 5.67157 19 6.5V17.5C19 18.3284 18.3284 19 17.5 19H6.5C5.67157 19 5 18.3284 5 17.5V6.5C5 5.67157 5.67157 5 6.5 5ZM17.5 6H6.5C6.22386 6 6 6.22386 6 6.5V17.5C6 17.7761 6.22386 18 6.5 18H17.5C17.7761 18 18 17.7761 18 17.5V6.5C18 6.22386 17.7761 6 17.5 6Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t.landing.features.quick.title}
            </h3>
            <p className="text-muted-foreground">
              {t.landing.features.quick.description}
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5 4H15V8H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V4ZM6 5V19H18V9H14C13.4477 9 13 8.55228 13 8V5H6Z"
                  fill="currentColor"
                />
                <path d="M15 4L19 8H15V4Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t.landing.features.professional.title}
            </h3>
            <p className="text-muted-foreground">
              {t.landing.features.professional.description}
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.8571 12C14.8571 13.578 13.578 14.8571 12 14.8571C10.422 14.8571 9.14286 13.578 9.14286 12C9.14286 10.422 10.422 9.14286 12 9.14286C13.578 9.14286 14.8571 10.422 14.8571 12Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM6.85714 12C6.85714 9.39689 9.39689 6.85714 12 6.85714C14.6031 6.85714 17.1429 9.39689 17.1429 12C17.1429 14.6031 14.6031 17.1429 12 17.1429C9.39689 17.1429 6.85714 14.6031 6.85714 12Z"
                  fill="currentColor"
                />
                <path
                  d="M12 0C11.4477 0 11 0.447715 11 1V3C11 3.55228 11.4477 4 12 4C12.5523 4 13 3.55228 13 3V1C13 0.447715 12.5523 0 12 0Z"
                  fill="currentColor"
                />
                <path
                  d="M12 20C11.4477 20 11 20.4477 11 21V23C11 23.5523 11.4477 24 12 24C12.5523 24 13 23.5523 13 23V21C13 20.4477 12.5523 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M3 11C3.55228 11 4 11.4477 4 12C4 12.5523 3.55228 13 3 13H1C0.447715 13 0 12.5523 0 12C0 11.4477 0.447715 11 1 11H3Z"
                  fill="currentColor"
                />
                <path
                  d="M23 11C23.5523 11 24 11.4477 24 12C24 12.5523 23.5523 13 23 13H21C20.4477 13 20 12.5523 20 12C20 11.4477 20.4477 11 21 11H23Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t.landing.features.share.title}
            </h3>
            <p className="text-muted-foreground">
              {t.landing.features.share.description}
            </p>
          </div>
        </div>

        <div className="mt-10 relative">
          <h1 className="text-[41px] font-bold">Why use facturo.africa?</h1>
          <h3 className="text-[26px] font-bold mt-5">⚡ Fast & Simple</h3>
          <p className="text-[18px] mt-4">
            Fill a short form in seconds and download your invoice instantly.
          </p>
          <div className="md:flex items-center">
            <div
              className="relative flex  justify-center items-center mt-[4rem] w-[250px]    mx-auto "
              style={{ minHeight: 300 }}
            >
              <Image
                src="/screen2.svg"
                alt="Invoice Preview"
                width={1000}
                height={1000}
                className=" absolute top-0 left-0 -translate-x-9 -translate-y-9 rounded-xl shadow-lg  "
                style={{ zIndex: 0 }}
              />
              <Image
                src="/screen1.svg"
                alt="Invoice Form"
                width={1000}
                height={1000}
                className="relative rounded-xl shadow-2xl  "
                style={{ zIndex: 10 }}
              />
            </div>
            {/* BUTTONS */}
            <div className="flex text-white mt-[3rem] gap-4 text-sm whitespace-nowrap max-w-[400px] mx-auto md:w-[400px]">
              <div className="bg-[#18181b] w-full py-2 rounded-sm">
                Download PDF
              </div>
              <div className="bg-[#18181b] w-full py-2 rounded-sm">
                Share via WhatsApp
              </div>
            </div>
            {/* INSTANTLY */}
            <Image
              src="/arrow.png"
              alt="arrow"
              width={100}
              height={100}
              className="absolute hidden md:block right-[8rem] translate-y-[6rem]"
            />
            <Image
              className="w-[300px] mx-auto mt-10 md:absolute -right-[5rem] md:w-[200px] translate-y-[5rem]"
              src="/instantly.png"
              alt="Instantly"
              width={500}
              height={500}
            />
          </div>
          {/* MOBILE FIRST */}
          <div className="mt-10 space-y-5">
            <h3 className="text-[26px] font-bold">📲 Mobile-First</h3>
            <p className="text-[18px]">
              Designed for African micro-entrepreneurs. No laptop needed.
            </p>
            <div className="relative max-w-[350px] mx-auto">
              <Image
                src="/mapofafrica.png"
                alt="Mobile"
                width={500}
                height={500}
              />
              <Image
                className="absolute top-0 left-0 -translate-x-[5rem] translate-y-[5rem]"
                src="/phonewithscreen.png"
                alt="Mobile"
                width={500}
                height={500}
              />
            </div>
          </div>
          {/* START NOW */}
          <div className="mt-[7rem]">
            <h3 className="text-[41px] font-bold">
              Start now — it's completely free.
            </h3>
            <div className="flex justify-center mt-5 md:mt-10">
              <Link href="/invoice">
                <Button size="lg" className="text-lg px-8 py-6">
                  {t.landing.cta}
                </Button>
              </Link>
            </div>
          </div>
          {/* WANT MORE POWER */}
          <div className="mt-16">
            <h3 className="text-[32px] font-bold">
              Want more power? Upgrade to Pro.
            </h3>
            <ul className="text-[18px] mt-10 flex flex-col gap-10 font-medium md:flex-row md:items-start md:justify-center">
              <li className="flex flex-col items-center gap-2 md:w-[200px]">
                <div className="w-[191px] h-[191px] flex items-center justify-center">
                  <Image
                    className="w-full h-full object-contain"
                    src="/history.png"
                    alt="history"
                    width={191}
                    height={191}
                  />
                </div>
                <p className="text-center">Access all your past invoices</p>
              </li>
              <li className="flex flex-col items-center gap-2 md:w-[200px]">
                <div className="w-[191px] h-[191px] flex items-center justify-center">
                  <Image
                    className="w-full h-full object-contain"
                    src="/download.png"
                    alt="download"
                    width={191}
                    height={191}
                  />
                </div>
                <p className="text-center">Add your business logo</p>
              </li>
              <li className="flex flex-col items-center gap-2 md:w-[200px]">
                <div className="w-[191px] h-[191px] flex items-center justify-center">
                  <Image
                    className="w-full h-full object-contain"
                    src="/infinity.png"
                    alt="infinity"
                    width={191}
                    height={191}
                  />
                </div>
                <p className="text-center">Unlimited invoices</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
