import { ReactQueryProvider } from "@components/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Loading from "./loading";
import React from "react";
import "./globals.css"; // Global styles

export const metadata = {
  title: "Dev Connect",
  description: "Connect with developers worldwide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Suspense fallback={<Loading />}>
            {children}
            <Toaster position="top-right" />
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
