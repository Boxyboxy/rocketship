import Link from 'next/link';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import styles from '../styles/navbar.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BACKEND_URL } from '../constants/backendUrl';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function NavBar() {
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const [inputValue, setinputValue] = useState('');
  const { user } = useUser();
  const [userId, setUserId] = useState();
  const [requestsCount, setRequestsCount] = useState(0);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users?email=${user.email}`);
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);
  // console.log(user);
  // console.log(userId);
  const handleChange = (e) => {
    setinputValue(e.target.value);
  };

  //to search when enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Trigger search when Enter key is pressed
      handleSearch();
    }
  };

  //for search function
  const handleSearch = () => {
    axios
      .get(`${BACKEND_URL}/projects?categoryName=${inputValue}`)
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
    console.log(searchResults);
  };

  //fetch contributions data
  useEffect(() => {
    if (userId) {
      axios
        // .get(`${BACKEND_URL}/contributions?userId=${userId}`)
        .get(`${BACKEND_URL}/contributions`)
        .then((response) => {
          const contributions = response.data;
          //project.userId -> project owner (the one that should be approving contributors' requests)
          console.log(response.data);
          // Filter contributions based on status and userId
          const pendingRequests = contributions.filter(
            (contribution) => contribution.status === 'pending'
          );

          const pendingProjects = pendingRequests.filter(
            (project) => project.project.userId === userId
          );
          console.log(pendingProjects);

          // Update the requests count in state
          setRequestsCount(pendingProjects.length);
          setPendingProjects(pendingProjects);
          console.log(pendingRequests.length);
          console.log(pendingRequests);
        })
        .catch((error) => {
          console.error('Error fetching contributions:', error);
        });
    }
  }, []);

  //control dialog component
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
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
            <Link className={styles.linkName} href={`/profile/${userId}/personal`}>
              My Launchpad
            </Link>
          </li>

          <div className={styles.navli}>
            <Link className={styles.linkName} href="/chat">
              <Badge className={styles.linkName} badgeContent={4} max={10} color="primary">
                <SmsRoundedIcon />{' '}
              </Badge>
            </Link>
          </div>
          <div className={styles.navli}>
            <Badge
              className={styles.linkName}
              badgeContent={requestsCount}
              max={10}
              color="primary"
              onClick={handleOpen}>
              <MailIcon />
            </Badge>

            <Dialog open={open} onClose={handleClose}>
              {requestsCount === 0 ? (
                <DialogTitle>No contributors' requests</DialogTitle>
              ) : (
                <DialogTitle>Review contributors' requests!</DialogTitle>
              )}
              {requestsCount === 0 ? (
                <></>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 300 }}>
                  <Tabs
                    value={selectedTab}
                    // onChange={handleTabChange}
                    onChange={(event, newValue) => setSelectedTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto">
                    {/* Render a tab for each request */}
                    {pendingProjects.map((request, index) => (
                      <Tab key={index} label={request.project.name} />
                    ))}
                  </Tabs>
                  <Box sx={{ flexGrow: 1, p: 2 }}>
                    {pendingProjects.map((request, index) => (
                      <Typography
                        key={index}
                        component="div"
                        role="tabpanel"
                        hidden={selectedTab !== index}>
                        {/* display request details only for the selected tab */}
                        {selectedTab === index && (
                          <DialogContent>
                            <DialogContentText>
                              Contributor:{' '}
                              <Link
                                className={styles.contributorName}
                                href={`/profile/${request.userSkill.user.id}`}>
                                {request.userSkill.user.name}
                              </Link>
                            </DialogContentText>
                            <DialogContentText>
                              Skill: {request.userSkill.skill.skill}
                            </DialogContentText>
                            <DialogContentText>Message: {request.message}</DialogContentText>
                          </DialogContent>
                        )}
                      </Typography>
                    ))}
                    <DialogActions>
                      <Button onClick={handleClose} color="success" variant="contained">
                        Approve
                      </Button>
                      <Button onClick={handleClose} color="error" variant="contained">
                        {' '}
                        Reject
                      </Button>
                    </DialogActions>
                  </Box>
                </Box>
              )}
            </Dialog>
          </div>
          <li className={styles.navli}>
            <a className={styles.logout} href="/api/auth/logout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
