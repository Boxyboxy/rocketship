import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styles from '../styles/github.module.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function Github({ project }) {
  const [code, setCode] = useState('');
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    async function fetchCode() {
      const response = await fetch(
        // `https://api.github.com/repos/:owner/:repo/contents/${filePath}`
        `http://api.github.com/repos/Boxyboxy/rocketship/contents/packages/frontend/src/components/category.js`
      );
      const data = await response.json();
      const decodedContent = atob(data.content);
      setCode(decodedContent);
    }
    fetchCode();
  }, []);

  console.log(project);
  return (
    <div>
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.copyContainer}>
            <h3>code snippet</h3>
            {!copy ? (
              <button
                className={styles.btn}
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopy(true);
                  setTimeout(() => {
                    setCopy(false);
                  }, 3000);
                }}>
                <span className={styles.copy}>
                  <ContentCopyIcon />
                </span>
                Copy code
              </button>
            ) : (
              <button className={styles.btn}>
                <span className={styles.copy}>
                  <CheckIcon />
                </span>
                Copied!
              </button>
            )}
          </div>
          <SyntaxHighlighter
            language="jsx"
            style={style}
            customStyle={{ padding: '25px' }}
            wrapLongLines={true}>
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
