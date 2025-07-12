"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NavigationLink({ text, path }) {
  return (
    <div className="w-full flex justify-center mt-8">
      <Link
        href={path}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full shadow hover:bg-blue-700 transition"
      >
        {text} <ArrowRight size={18} />
      </Link>
    </div>
  );
}
