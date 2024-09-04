import Link from "next/link";
import React from "react";

export default function NotAllowed() {
  return (
    <div className="flex h-[90vh] items-center justify-center">
      <div className="flex flex-col justify-center gap-2">
        <h1 className="text-5xl font-bold text-primary-green">
          Not Authenticated
        </h1>
        <p className=" text-center text-lg">
          You&apos;re not allowed to view this page.
        </p>
        <Link
          href="/admin"
          className=" mx-auto rounded-md bg-primary-green px-10 py-2 text-white"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
