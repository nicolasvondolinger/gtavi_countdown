'use client';

import { useState } from 'react';
import {
  Menu,
  MenuItem,
  Button,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Box,
  type ButtonProps,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useLanguage } from '@/hooks/useLanguage';
import { asset } from '@/lib/asset';

type CalendarButtonProps = Omit<ButtonProps, 'onClick'>;

export default function CalendarButton(props: CalendarButtonProps) {
  const { translations } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const addToGoogleCalendar = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=GTA+VI+Release&dates=20261119T000000Z/20261119T010000Z&details=GTA+6+is+releasing!&sf=true&output=xml`;
    window.open(calendarUrl, '_blank');
    handleClose();
  };

  const addToAppleCalendar = () => {
    const calendarContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GTA VI Countdown//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@gtavi.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'DTSTART:20261119T000000Z',
      'DTEND:20261119T010000Z',
      'SUMMARY:GTA VI Release',
      'DESCRIPTION:GTA 6 is releasing!',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gta-vi-release.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    handleClose();
  };

  const { startIcon, children, variant = 'outlined', ...rest } = props;

  return (
    <>
      <Tooltip title={translations.addToCalendar}>
        <Button
          onClick={handleClick}
          variant={variant}
          startIcon={startIcon ?? <EventIcon />}
          {...rest}
        >
          {children ?? translations.addToCalendar}
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            background: 'rgba(12,10,20,0.96)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--hairline)',
            color: '#fff',
          },
        }}
      >
        <MenuItem onClick={addToGoogleCalendar}>
          <ListItemIcon>
            <Box component="img" src={asset('assets/google-calendar.png')} alt="" sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          <ListItemText>Google Calendar</ListItemText>
        </MenuItem>
        <MenuItem onClick={addToAppleCalendar}>
          <ListItemIcon>
            <Box component="img" src={asset('assets/apple-calendar.png')} alt="" sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          <ListItemText>Apple Calendar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
