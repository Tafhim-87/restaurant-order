"use client";

import SidebarLayout from "@/app/components/ui/SideNav";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Provider store={store}>
          <SidebarLayout>{children}</SidebarLayout>
        </Provider>
      </body>
    </html>
  );
}
