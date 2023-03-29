import Link from 'next/link';
import styles from '../styles/category.module.css';

export default function Category() {
  return (
    <div className={styles.categoryHead}>
      <ul className={styles.categoryUL}>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/">
            All |
          </Link>
        </li>

        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/fintech">
            {' '}
            Fintech |
          </Link>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/healthtech">
            {' '}
            HealthTech |
          </Link>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/fnb">
            {' '}
            F&B |
          </Link>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/social-media">
            {' '}
            Social media |
          </Link>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/games">
            {' '}
            Games |
          </Link>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/agritech">
            {' '}
            Agritech
          </Link>
        </li>
      </ul>
    </div>
  );
}
