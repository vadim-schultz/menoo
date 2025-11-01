export function Navigation() {
  return (
    <nav className="navigation">
      <div className="navigation__brand">
        <a href="/" className="navigation__logo">
          Menoo
        </a>
      </div>
      <ul className="navigation__menu">
        <li>
          <a href="/ingredients">Ingredients</a>
        </li>
        <li>
          <a href="/recipes">Recipes</a>
        </li>
      </ul>
    </nav>
  );
}
