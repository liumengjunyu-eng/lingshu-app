import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata = {
 title: 'LingShu · System Analysis',
 description: 'Your system is always speaking. We help you listen.',
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en" translate="no">
 <head>
 <meta name="google" content="notranslate" />
 </head>
 <body className="antialiased">{children}</body>
 </html>
 );
}
