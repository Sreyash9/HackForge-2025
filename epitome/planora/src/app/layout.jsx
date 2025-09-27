import { Inter } from "next/font/google";
import "./globals.css"; // Make sure you have this file for Tailwind CSS
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduPlanner - College Savings",
  description: "Your personal guide to college savings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
