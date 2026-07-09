'use client';

import { Box } from '@mui/material';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import LinkHub from '@/components/LinkHub';
import GameFacts from '@/components/GameFacts';
import PreOrderSection from '@/components/PreOrderSection';
import WorldGallery from '@/components/WorldGallery';
import CharacterGallery from '@/components/CharacterGallery';
import Trailers from '@/components/Trailers';
import ShareBox from '@/components/ShareBox';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <Box id="top" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <LinkHub />
        <GameFacts />
        <PreOrderSection />
        <WorldGallery />
        <CharacterGallery />
        <Trailers />
        <ShareBox />
      </Box>
      <Footer />
    </Box>
  );
}
