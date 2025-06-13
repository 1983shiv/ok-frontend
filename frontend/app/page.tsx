"use client"
import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ChartNavigation from '@/components/ChartNavigation';
import Footer from '@/components/Footer';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTheme } from '@/context/ThemeContext';

const Home: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <Head>
        <title>O1 Data - Most Advanced Options Analysis Tool</title>
        <meta name="description" content="Advanced options trading analysis tool with in-depth charts and data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero />
      <ChartNavigation />
      <Footer />
      <ThemeSwitcher />
    </div>
  );
};

export default Home;