import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { APP_NAME } from '@/lib/constants';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans', // Use Geist Sans as the default sans-serif font
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono', // Use Geist Mono as the default mono font
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'AI-Powered Scalping Assistant for Indian Stock Markets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
