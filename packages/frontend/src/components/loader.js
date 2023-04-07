import styles from '../styles/loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loader}>
      <img
        className={styles.moon}
        src="http://www.clker.com/cliparts/8/4/7/a/12279737022024966533rg1024_Moon_in_comic_style.svg"
        alt="moon"
        width="10%"
      />
      <div className={styles.rocket}>
        <img src="/images/rocket.png" alt="rocket" width="20%" />
      </div>
    </div>
  );
}
