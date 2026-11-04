import { AccountArea } from './AccountArea';
import { NavLinks } from './NavLinks';
import { SearchBox } from './SearchBox';
import { Wordmark } from './Wordmark';

export function Header() {
  return (
    <header className="hidden border-b border-line bg-bg lg:block">
      <div className="mx-auto flex max-w-[1440px] items-center gap-7 px-8 py-3.5 xl:px-20">
        <Wordmark />
        <NavLinks />
        <div className="flex-1" />
        <SearchBox />
        <AccountArea />
      </div>
    </header>
  );
}
