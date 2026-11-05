import { AccountArea } from './AccountArea';
import { DiscordLink } from './DiscordButton';
import { LocaleSwitch } from './LocaleSwitch';
import { NavLinks } from './NavLinks';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';

export function Header() {
  return (
    <header className="hidden border-b border-line bg-bg lg:block">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-8 py-3.5 xl:gap-7 xl:px-20">
        <Wordmark />
        <NavLinks />
        <div className="flex-1" />
        <SearchBox />
        <DiscordLink />
        <LocaleSwitch />
        <ThemeToggle />
        <AccountArea />
      </div>
    </header>
  );
}
