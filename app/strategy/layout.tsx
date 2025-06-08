"use client"

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTheme } from '@/context/ThemeContext';
import Head from 'next/head';

export default function OptionLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { theme } = useTheme();
    return (
        <>
            <div
                style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                }}
            >
                <Head>
                    <title>O1 Data - Most Advanced Options Analysis Tool</title>
                    <meta
                        name="description"
                        content="Advanced options trading analysis tool with in-depth charts and data"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Navbar />
                {children}
                <Footer />
                <ThemeSwitcher />
            </div>
        </>
    );
}
