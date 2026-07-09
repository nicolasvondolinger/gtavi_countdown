'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Box, Typography, Stack, Autocomplete, TextField, CircularProgress } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export default function TimezoneSelector({
  selectedTimezone,
  onTimezoneChange,
}: TimezoneSelectorProps) {
  const { translations } = useLanguage();
  const [timezones, setTimezones] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const zones = Intl.supportedValuesOf('timeZone');
    setTimezones(zones);

    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (zones.includes(userTimezone)) {
        onTimezoneChange(userTimezone);
      }
    } catch (e) {
      console.error('Could not detect timezone:', e);
    } finally {
      setIsDetecting(false);
    }
  }, [onTimezoneChange]);

  if (isDetecting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, py: 2 }}>
        <CircularProgress size={18} sx={{ color: '#FF0066' }} />
        <Typography>{translations.detectingTz}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: { xs: 2, sm: 3 }, px: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center' }}>
      <Stack direction="column" spacing={1.5} alignItems="center" sx={{ maxWidth: 420, width: '100%' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PublicIcon sx={{ fontSize: 20, color: '#FF5E94' }} />
          <Typography component="label" htmlFor="timezone" variant="subtitle1">
            {translations.selectTz}
          </Typography>
        </Stack>

        <Autocomplete
          id="timezone"
          fullWidth
          size="small"
          options={timezones}
          value={selectedTimezone}
          onChange={(_, newValue) => {
            if (newValue) onTimezoneChange(newValue);
          }}
          disableClearable
          getOptionLabel={(option) => option.replace(/_/g, ' ')}
          renderInput={(params) => (
            <TextField {...params} placeholder={translations.searchTz} />
          )}
          sx={{
            backgroundColor: 'rgba(20,20,28,0.85)',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.45)' },
              '&.Mui-focused fieldset': { borderColor: '#FF0066' },
            },
            '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' },
          }}
        />
      </Stack>
    </Box>
  );
}
