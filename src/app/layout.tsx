import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // Import Next.js Script component
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page metadata
export const metadata: Metadata = {
  title: "Dashboard - Mazer Admin Dashboard",
  description: "Generated by Create Next App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="/assets/vendors/feather/feather.css" />
        <link rel="stylesheet" href="/assets/vendors/mdi/css/materialdesignicons.min.css" />
        <link rel="stylesheet" href="/assets/vendors/ti-icons/css/themify-icons.css" />
        <link rel="stylesheet" href="/assets/vendors/font-awesome/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/assets/vendors/typicons/typicons.css" />
        <link rel="stylesheet" href="/assets/vendors/simple-line-icons/css/simple-line-icons.css" />
        <link rel="stylesheet" href="/assets/vendors/css/vendor.bundle.base.css" />
        <link rel="stylesheet" href="/assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.css" />
        <link rel="stylesheet" href="/assets/vendors/datatables.net-bs4/dataTables.bootstrap4.css" />
        <link rel="stylesheet" type="text/css" href="/assets/js/select.dataTables.min.css" />

        <link rel="stylesheet" href="/assets/css/style.css"></link>

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}


        {/* Vendor Scripts */}
        <Script src="/assets/vendors/js/vendor.bundle.base.js" strategy="lazyOnload" />
        <Script src="/assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js" strategy="lazyOnload" />

        {/* Plugin Scripts */}
        <Script src="/assets/vendors/chart.js/chart.umd.js" strategy="lazyOnload" />
        <Script src="/assets/vendors/progressbar.js/progressbar.min.js" strategy="lazyOnload" />

        {/* Core JS */}
        <Script src="/assets/js/off-canvas.js" strategy="lazyOnload" />
        <Script src="/assets/js/template.js" strategy="lazyOnload" />
        <Script src="/assets/js/settings.js" strategy="lazyOnload" />
        <Script src="/assets/js/hoverable-collapse.js" strategy="lazyOnload" />
        <Script src="/assets/js/todolist.js" strategy="lazyOnload" />

        {/* Custom Scripts */}
        <Script src="/assets/js/jquery.cookie.js" strategy="lazyOnload" />
        <Script src="/assets/js/dashboard.js" strategy="lazyOnload" />
        
      </body>
      
       
    </html>
  );
}
