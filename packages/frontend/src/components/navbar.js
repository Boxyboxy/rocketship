import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import styles from '../styles/navbar.module.css';

export default function NavBar() {
  const { logout } = useAuth0();
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navbarHeader}>
          <Link href="/">
            <img className={styles.logo} src="/images/logo.png" alt="logo" />
          </Link>
        </ul>

        <div className={styles.searchBox}>
          <input
            className={styles.txt}
            id="standard-basic"
            placeholder="Search for projects or categories"
            variant="standard"
          />
          <div className={styles.btn}>
            <SearchRoundedIcon />
          </div>
        </div>

        <ul className={styles.navbarRight}>
          <li className={styles.navli}>
            <Link className={styles.linkName} href="/projects">
              Discover
            </Link>
          </li>
          <li className={styles.navli}>
            <Link className={styles.linkName} href="/create-project">
              Launch a Rocket
            </Link>
          </li>
          <li className={styles.navli}>
            <Link className={styles.linkName} href="/profile">
              My Launchpad
            </Link>
          </li>

          <div className={styles.navli}>
            <Link className={styles.linkName} href="/chat">
              <SmsRoundedIcon />{' '}
            </Link>
          </div>
          <li className={styles.navli}>
            <button className={styles.logout} onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
