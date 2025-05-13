import { NavLink } from 'react-router-dom';
import './Navigation.css';

export function Navigation() {
  return (
    <nav className="main-nav">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/google-photos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Google Photos
          </NavLink>
        </li>
        <li>
          <NavLink to="/playing-cards" className={({ isActive }) => (isActive ? 'active' : '')}>
            Playing Cards
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
