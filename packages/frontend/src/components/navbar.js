import Link from 'next/link';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import styles from '../styles/navbar.module.css';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NavBar() {
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const [inputValue, setinputValue] = useState('');

  const handleChange = (e) => {
    setinputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Trigger search when Enter key is pressed
      handleSearch();
    }
  };

  const handleSearch = () => {
    axios
      .get(`http://localhost:8080/projects?categoryName=${inputValue}`)
      .then((response) => {
        // Update state with search results
        setSearchResults(response.data);
        console.log(response.data);
        router.push({
          pathname: '/searchResults',
          query: { inputValue: inputValue } // Pass search results as query parameter
        });
      })
      .catch((error) => {
        console.error(error);
      });
    console.log('Search term:', inputValue);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navbarHeader}>
          <Link href="/projects">
            <img className={styles.logo} src="/images/logo.png" alt="logo" />
          </Link>
        </ul>

        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.txt}
            id="standard-basic"
            placeholder="Search for projects here"
            variant="standard"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <SearchRoundedIcon className={styles.btn} />
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
            {/* <button className={styles.logout}> */}
            <a className={styles.logout} href="/api/auth/logout">
              Logout
            </a>
            {/* </button> */}
          </li>
        </ul>
      </div>
    </nav>
  );
}
