"use client";
/**
 * This code was partially generated by v0 by Vercel.
 * @see https://v0.dev/t/gEGOOKuKJNI
 */
import Link from "next/link";
import { SVGAttributes, useState } from "react";
import FetchInstanceInfo from "./fetch-instance-info";

const knownInstances = ["voyager.lemmy.ml", "lemmy.ml"];

export function InstanceList(props: { domain: string }) {
  const [searchInput, setSearchInput] = useState("");
  const instances = [...knownInstances];
  if (!knownInstances.includes(props.domain)) instances.push(props.domain);
  return (
    <>
      <div className="grid h-screen min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="border-r bg-gray-100/40 lg:block dark:bg-gray-800 dark:border-black">
          <div className="flex flex-col gap-2">
            <div className="flex h-[60px] items-center px-6">
              <Link className="flex items-center gap-2 font-semibold" href="#">
                <Package2Icon className="h-6 w-6" />
                <span className="">Query Instance</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-4 text-sm font-medium">
                {instances.map((i) => (
                  <Link
                    className={
                      "flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-gray-900 dark:hover:text-gray-50 " +
                      (i === props.domain
                        ? "text-gray-900 dark:text-gray-50 font-bold border"
                        : "text-gray-500 dark:text-gray-400")
                    }
                    href={`/site?domain=${i}`}
                    key={i}
                  >
                    <HomeIcon className="h-4 w-4" />
                    {i}
                  </Link>
                ))}
                <div
                  className={
                    "flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-gray-900 dark:hover:text-gray-50 " +
                    (true
                      ? "text-gray-900 dark:text-gray-50"
                      : "text-gray-500 dark:text-gray-400")
                  }
                >
                  <HomeIcon className="h-4 w-4" />
                  <input
                    className="flex-grow flex-shrink w-0 dark:bg-gray-600 p-1"
                    value={searchInput}
                    placeholder="Other domain..."
                    onChange={(e) => setSearchInput(e.target.value)}
                  ></input>{" "}
                  <Link
                    href={`/site?domain=${searchInput}`}
                    className="border p-1"
                  >
                    Go
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col dark:bg-gray-900">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <h2 className="text-xl">State of outgoing federation from {props.domain}</h2>
            <FetchInstanceInfo domain={props.domain} />
          </main>
        </div>
      </div>
    </>
  );
}

function HomeIcon(props: SVGAttributes<{}>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function Package2Icon(props: SVGAttributes<{}>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
