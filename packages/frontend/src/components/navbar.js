import Link from "next/link";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "../styles/navbar.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import config from "../config";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useUser } from "@auth0/nextjs-auth0/client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function NavBar() {
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const [inputValue, setinputValue] = useState("");
  const { user } = useUser();
  const [userId, setUserId] = useState();
  const [requestsCount, setRequestsCount] = useState(0);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // console.log(user);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users?email=${user.email}`
        );
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);

  const handleChange = (e) => {
    setinputValue(e.target.value);
  };

  //to search when enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Trigger search when Enter key is pressed
      handleSearch();
    }
  };

  //for search function
  const handleSearch = () => {
    axios
      .get(`${config.apiUrl}/projects?categoryName=${inputValue}`)
      .then((response) => {
        // Update state with search results
        setSearchResults(response.data);

        router.push({
          pathname: "/searchResults",
          query: { inputValue: inputValue }, // Pass search results as query parameter
        });
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Search term:", inputValue);
    console.log(searchResults);
  };

  //fetch contributions data
  useEffect(() => {
    if (userId) {
      axios
        .get(`${config.apiUrl}/contributions`)
        .then((response) => {
          const contributions = response.data;
          //project.userId -> project owner (the one that should be approving contributors' requests)

          // console.log(response.data);

          // Filter contributions based on status and userId
          const pendingRequests = contributions.filter(
            (contribution) => contribution.status === "pending"
          );

          const pendingProjects = pendingRequests.filter(
            (project) => project.project.userId === userId
          );
          // console.log(pendingProjects);

          // Update the requests count in state
          setRequestsCount(pendingProjects.length);
          setPendingProjects(pendingProjects);
          // console.log(pendingProjects);
          // console.log(pendingRequests);
        })
        .catch((error) => {
          console.error("Error fetching contributions:", error);
        });
    }
  }, [userId]);

  //control dialog component
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // function handleCloseSnackbar() {
  //   setSnackbarOpen(false);
  // }
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); //close snackbar
  };

  //handle approve/reject
  function handleApprove(id) {
    axios
      .patch(`${config.apiUrl}/contributions/${id}`, { status: "accepted" })
      .then((response) => {
        console.log(response);
        console.log("updated status successfully");
        setOpen(false);
        setSnackbarMessage("Contribution approved successfully.");
        setSnackbarOpen(true);
        setRequestsCount(requestsCount - 1);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage(
          "An error occurred while approving the contribution."
        );
        setSnackbarOpen(true);
      });
  }

  function handleReject(id) {
    axios
      .patch(`${config.apiUrl}/contributions/${id}`, { status: "cancelled" })
      .then((response) => {
        console.log(response);
        console.log("updated status successfully");
        setOpen(false);
        setSnackbarMessage("Contribution cancelled successfully.");
        setSnackbarOpen(true);
        setRequestsCount(requestsCount - 1);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage(
          "An error occurred while cancelling the contribution."
        );
        setSnackbarOpen(true);
      });
  }

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
            <Link
              className={styles.linkName}
              href={`/profile/${userId}/personal`}
            >
              My Launchpad
            </Link>
          </li>

          <div className={styles.navli}>
            <Badge
              className={styles.linkName}
              badgeContent={requestsCount}
              max={10}
              color="primary"
              onClick={handleOpen}
            >
              <MailIcon />
            </Badge>

            <Dialog open={open} onClose={handleClose}>
              {requestsCount === 0 ? (
                <DialogTitle sx={{ fontFamily: "Montserrat" }}>
                  No contributors' requests
                </DialogTitle>
              ) : (
                <DialogTitle sx={{ fontFamily: "Montserrat" }}>
                  Review contributors' requests!
                </DialogTitle>
              )}
              {requestsCount === 0 ? (
                <></>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 300,
                  }}
                >
                  <Tabs
                    value={selectedTab}
                    // onChange={handleTabChange}
                    onChange={(event, newValue) => setSelectedTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
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
                        hidden={selectedTab !== index}
                      >
                        {/* display request details only for the selected tab */}
                        {selectedTab === index && (
                          <DialogContent>
                            <DialogContentText
                              sx={{ fontFamily: "Montserrat" }}
                            >
                              Contributor:{" "}
                              <Link
                                className={styles.contributorName}
                                href={`/profile/${request.userSkill.user.id}`}
                              >
                                {request.userSkill.user.name}
                              </Link>
                            </DialogContentText>
                            <DialogContentText
                              sx={{ fontFamily: "Montserrat" }}
                            >
                              Skill: {request.userSkill.skill.skill}
                            </DialogContentText>
                            <DialogContentText
                              sx={{ fontFamily: "Montserrat" }}
                            >
                              Message: {request.message}
                            </DialogContentText>
                          </DialogContent>
                        )}
                        <DialogActions>
                          <Button
                            onClick={() => handleApprove(request.id)}
                            color="success"
                            variant="contained"
                          >
                            Approve
                          </Button>{" "}
                          {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
                          <Button
                            onClick={() => handleReject(request.id)}
                            color="error"
                            variant="contained"
                          >
                            {" "}
                            Reject
                          </Button>
                        </DialogActions>
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Dialog>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                elevation={6}
                variant="filled"
                onClose={handleCloseSnackbar}
                severity="success"
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
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
