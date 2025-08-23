import { useState } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";
import MenuToggle from "./MenuToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Logo />
        </div>

        <NavLinks isMenuOpen={isMenuOpen} />

        <div className="header-actions">
          <SearchBar />
          <UserMenu />
          <CartButton />
          <MenuToggle isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>
  );
}
