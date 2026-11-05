export const THEME_KEY = 'gta-wiki-theme';

// Runs before the first paint, so a saved choice never flashes the other theme.
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;
