'use client';

import { Box, Typography } from '@mui/material';
import { useLanguage } from '@/hooks/useLanguage';
import { asset } from '@/lib/asset';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

// Stable proper nouns (identical across locales). Order matches galleryItems.
const NAMES = [
  'Jason Duval',
  'Lucia Caminos',
  'Cal Hampton',
  'Boobie Ike',
  "Dre'Quan Priest",
  'Real Dimez',
  'Raul Bautista',
  'Brian Heder',
];

const IMAGES = [
  'media/characters/jason.webp',
  'media/characters/lucia.webp',
  'media/characters/cal.webp',
  'media/characters/boobie.webp',
  'media/characters/drequan.webp',
  'media/characters/real_dimez.webp',
  'media/characters/raul.webp',
  'media/characters/brian.webp',
];

function DuoBio({ name, title, description }: { name: string; title: string; description: string }) {
  return (
    <Box sx={{ flex: '1 1 260px' }}>
      <Typography
        className="gta-display"
        sx={{
          fontSize: { xs: '1.7rem', md: '2.1rem' },
          background: 'var(--grad-brand)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          mb: 0.5,
        }}
      >
        {name}
      </Typography>
      <Typography sx={{ color: 'var(--c-teal)', fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--text-mid)', lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Box>
  );
}

export default function CharacterGallery() {
  const { translations: t, getTranslatedGalleryItems } = useLanguage();
  const items = getTranslatedGalleryItems();
  const crew = items.slice(2);

  return (
    <Box
      component="section"
      id="characters"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 7, md: 11 }, maxWidth: 1240, mx: 'auto' }}
    >
      <SectionHeader kicker="Characters" title={t.galleryTitle} subtitle={t.galleryDescription} />

      {/* Featured protagonists */}
      <Reveal>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
            border: '1px solid var(--hairline)',
            mb: { xs: 2.5, md: 3 },
          }}
        >
          <Box sx={{ position: 'relative', aspectRatio: { xs: '16 / 11', md: '16 / 7' } }}>
            <Box
              component="img"
              src={asset('media/characters/feature.webp')}
              alt="Jason & Lucia"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(7,6,13,0.1) 30%, rgba(7,6,13,0.9) 100%)',
              }}
            />
            <Box sx={{ position: 'absolute', left: 0, bottom: 0, p: { xs: 2.5, md: 4 } }}>
              <Typography className="font-kicker" sx={{ color: 'var(--c-teal)', fontSize: '0.8rem', mb: 1 }}>
                {t.charactersFeatured}
              </Typography>
              <Typography className="gta-display" sx={{ fontSize: { xs: '2.2rem', md: '3.4rem' }, color: '#fff' }}>
                Jason &amp; Lucia
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 3, md: 5 },
              p: { xs: 2.5, md: 4 },
              background: 'var(--surface)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <DuoBio name={NAMES[0]} title={items[0].title} description={items[0].description} />
            <DuoBio name={NAMES[1]} title={items[1].title} description={items[1].description} />
          </Box>
        </Box>
      </Reveal>

      {/* Crew grid */}
      <Typography
        className="font-kicker"
        sx={{ color: 'var(--text-lo)', fontSize: '0.8rem', mt: { xs: 5, md: 7 }, mb: 2.5, textAlign: 'center' }}
      >
        {t.meetTheCrew}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.75, md: 2.25 },
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {crew.map((item, idx) => {
          const globalIdx = idx + 2;
          return (
            <Reveal key={NAMES[globalIdx]} delay={(idx % 3) * 80} sx={{ display: 'flex' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  background: 'var(--surface)',
                  border: '1px solid var(--hairline)',
                  transition: 'transform 0.3s var(--ease-out), border-color 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: 'rgba(255,30,122,0.5)',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.45), 0 0 22px rgba(255,30,122,0.25)',
                  },
                  '&:hover img': { transform: 'scale(1.05)' },
                }}
              >
                <Box sx={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={asset(IMAGES[globalIdx])}
                    alt={NAMES[globalIdx]}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      transition: 'transform 0.6s var(--ease-out)',
                    }}
                  />
                  <Box
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 45%, rgba(18,16,28,0.95) 100%)',
                    }}
                  />
                  <Typography
                    className="gta-display"
                    sx={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: 10,
                      fontSize: { xs: '1.15rem', md: '1.5rem' },
                      color: '#fff',
                      textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                      lineHeight: 1,
                    }}
                  >
                    {NAMES[globalIdx]}
                  </Typography>
                </Box>
                <Box sx={{ p: { xs: 1.75, md: 2.25 }, flexGrow: 1 }}>
                  <Typography sx={{ color: 'var(--c-pink)', fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-mid)',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            </Reveal>
          );
        })}
      </Box>
    </Box>
  );
}
