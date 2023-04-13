import Box from "@mui/material/Box";
import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Footer from "../../../../components/footer";
import axios from "axios";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import styles from "../../../../styles/editprofile.module.css";
import { BACKEND_URL } from "../../../../constants/backendUrl";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function EditProfilPage({}) {
  const router = useRouter();
  const { personalId } = router.query;
  const [presentUserSkills, setPresentUserSkills] = useState({});

  const [userSkillsCheckBox, setUserSkillsCheckBox] = useState({});
  const [formValues, setFormValues] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const [errorMessage, setErrorMessage] = useState(
    "User Profile failed. Please try again."
  );

  const [validateName, setValidName] = useState({
    name: "john doe",
    tempName: "",
  });
  const [validateMobile, setValidMobile] = useState({
    mobile: "88888888",
    tempMobile: "",
  });
  const [validateEmail, setValidEmail] = useState({
    email: "abcdefg@gmail.com",
    tempEmail: "",
  });

  const [validateGithubUrl, setValidGithub] = useState({
    url: "https://github.com",
    tempUrl: "",
  });
  const [validateLinkedinUrl, setValidLinkedin] = useState({
    url: "https://linkedin.com",
    tempUrl: "",
  });
  const isNameValid = (name) =>
    !name.trim().includes(" ") ||
    name.trim().length < 3 ||
    name.trim().split(" ").length - 1 > 2;

  const isMobileValid = (mobile) =>
    mobile.length > 8 || !mobile.match(/^\d{8}$/);

  const isEmailValid = (email) =>
    !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  const isGithubUrlValid = (url) =>
    url.length < 2 ||
    !url.includes(".") ||
    !url.startsWith("http") ||
    !url.includes("github");

  const isLinkedinUrlValid = (url) =>
    url.length < 2 ||
    !url.includes(".") ||
    !url.startsWith("http") ||
    !url.includes("linkedin");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#21325e", // Replace with your desired primary color
      },
    },
    typography: {
      fontFamily: "Montserrat, sans-serif", // Replace with your desired font family
    },
  });
  useEffect(() => {
    axios.get(`${BACKEND_URL}/skills`).then(({ data }) => {
      let skillObjectsArray = Object.values(data);
      const checkBoxBoolean = {};
      skillObjectsArray
        .map((item) => item.skill)
        .map((element, index) => (checkBoxBoolean[element] = false));
      setUserSkillsCheckBox(checkBoxBoolean);
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/${personalId}`);

        setFormValues({
          name: response.data.name,
          mobile: response.data.mobile,
          email: response.data.email,
          linkedinUrl: response.data.linkedinUrl,
          githubUrl: response.data.githubUrl,
        });

        setValidName({ name: "john doe", tempName: response.data.name });
        setValidMobile({
          mobile: "88888888",
          tempMobile: response.data.mobile,
        });
        setValidEmail({
          email: "abcdefg@gmail.com",
          tempEmail: response.data.email,
        });
        setValidGithub({
          url: "https://github.com",
          tempUrl: response.data.githubUrl,
        });
        setValidLinkedin({
          url: "https://linkedin.com",
          tempUrl: response.data.linkedinUrl,
        });

        let skillObjectsArray = Object.values(response.data.skills);

        const checkBoxBoolean = {};
        skillObjectsArray
          .map((item) => item.skill)
          .map((element, index) => {
            // obtain already present user skills to display as disabled check boxes
            checkBoxBoolean[element] = true;
            // remove already present user skills from userSkillsCheckBox
            delete userSkillsCheckBox[element];
          });
        setPresentUserSkills(checkBoxBoolean);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [personalId]);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
    if (e.target.id == "name") {
      setValidName({ name: "john doe", tempName: e.target.value });
    }

    if (e.target.id == "mobile") {
      setValidMobile({ mobile: "88888888", tempMobile: e.target.value });
    }

    if (e.target.id == "email") {
      setValidEmail({ email: "abcdefg@gmail.com", tempEmail: e.target.value });
    }
    if (e.target.id == "githubUrl") {
      setValidGithub({ url: "https://github.com", tempUrl: e.target.value });
    }
    if (e.target.id == "linkedinUrl") {
      setValidLinkedin({
        url: "https://linkedin.com",
        tempUrl: e.target.value,
      });
    }
  };
  const trimWhitespaces = (obj) => {
    for (let [key, value] of Object.entries(obj)) {
      obj[key] = value.trim();
    }
    return obj;
  };

  const handleCheckboxChange = (event) => {
    setUserSkillsCheckBox({
      ...userSkillsCheckBox,
      [event.target.name]: event.target.checked,
    });
    console.log(userSkillsCheckBox);
    // Maps checkbox boolean object into an array of skills to interface with backend
    const skills = Object.keys(userSkillsCheckBox).filter(
      (skill) => userSkillsCheckBox[skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValuesTrimmed = trimWhitespaces(formValues);
    console.log({
      ...formValuesTrimmed,
      newSkills: Object.keys(userSkillsCheckBox).filter(
        (key) => userSkillsCheckBox[key]
      ),
    });

    setValidName({
      name: validateName.tempName,
      tempName: validateName.name,
    });
    setValidMobile({
      mobile: validateMobile.tempMobile,
      tempMobile: validateMobile.mobile,
    });
    setValidEmail({
      email: validateEmail.tempEmail,
      tempEmail: validateEmail.email,
    });
    setValidGithub({
      url: validateGithubUrl.tempUrl,
      tempUrl: validateGithubUrl.url,
    });

    setValidLinkedin({
      url: validateLinkedinUrl.tempUrl,
      tempUrl: validateLinkedinUrl.url,
    });

    axios
      .patch(`${BACKEND_URL}/users/${personalId}`, {
        ...formValues,
        newSkills: Object.keys(userSkillsCheckBox).filter(
          (key) => userSkillsCheckBox[key]
        ),
      })
      .then(function (response) {
        console.log(response);
        setShowSuccess(true);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        setShowFailure(true);
        setErrorMessage(error.response.data.error);
      });

    // TODO: redirect and add in autho layer
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccess(false); // Close success snackbar
    setShowFailure(false); // Close failure snackbar
  };
  return (
    <div className={styles.majorDiv}>
      <NavBar />
      <Category />
      <ThemeProvider theme={theme}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "50ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div className={styles.form}>
            <div className={styles.header}>Personal details</div>

            <TextField
              required
              id="name"
              onChange={handleInputChange}
              label="Name"
              value={formValues.name}
              InputLabelProps={{ shrink: true }}
              error={isNameValid(validateName.name)}
              helperText={
                isNameValid(validateName.name) ? "Name is not valid" : ""
              }
            />
            <br />
            <TextField
              required
              id="mobile"
              label="Mobile Number"
              onChange={handleInputChange}
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
                pattern: "[0-9]*",
                // Restrict input to only numbers
              }}
              value={formValues.mobile}
              InputLabelProps={{ shrink: true }}
              error={isMobileValid(validateMobile.mobile)}
              helperText={
                isMobileValid(validateMobile.mobile)
                  ? "Please enter an 8 digit mobile number."
                  : ""
              }
            />
            <br />
            <TextField
              required
              id="email"
              onChange={handleInputChange}
              label="Email address"
              value={formValues.email}
              InputLabelProps={{ shrink: true }}
              error={isEmailValid(validateEmail.email)}
              helperText={
                isEmailValid(validateEmail.email) ? "Email is not valid" : ""
              }
            />
            <div className={styles.header}>Social Links</div>
            <TextField
              // required
              id="githubUrl"
              onChange={handleInputChange}
              label="Github Link"
              value={formValues.githubUrl}
              InputLabelProps={{ shrink: true }}
              error={isGithubUrlValid(validateGithubUrl.url)}
              helperText={
                isGithubUrlValid(validateGithubUrl.url)
                  ? "Github URL is not valid."
                  : ""
              }
            />
            <br />
            <TextField
              // required
              id="linkedinUrl"
              onChange={handleInputChange}
              label="LinkedIn Profile Link"
              value={formValues.linkedinUrl}
              InputLabelProps={{ shrink: true }}
              error={isLinkedinUrlValid(validateLinkedinUrl.url)}
              helperText={
                isLinkedinUrlValid(validateLinkedinUrl.url)
                  ? "Linkedin URL is not valid."
                  : ""
              }
            />
            <div className={styles.header}>Skills</div>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Present Skills</FormLabel>
              <FormGroup>
                {Object.keys(presentUserSkills).length > 0 ? (
                  Object.entries(presentUserSkills).map(([k, v]) => (
                    <FormControlLabel
                      control={<Checkbox checked={v} disabled name={k} />}
                      label={k}
                    />
                  ))
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        onChange={handleCheckboxChange}
                        name="rendering"
                      />
                    }
                    label="Rendering"
                  />
                )}
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Select more skills</FormLabel>
              <FormGroup>
                {Object.keys(userSkillsCheckBox).length > 0 ? (
                  Object.entries(userSkillsCheckBox).map(([k, v]) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={v}
                          onChange={handleCheckboxChange}
                          name={k}
                        />
                      }
                      label={k}
                    />
                  ))
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={false}
                        onChange={handleCheckboxChange}
                        name="rendering"
                      />
                    }
                    label="Rendering"
                  />
                )}
              </FormGroup>
            </FormControl>
            <br />
            <Button onClick={handleSubmit} type="submit" variant="contained">
              Submit
            </Button>
            <Snackbar
              open={showSuccess}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity="success"
              >
                User Profile updated successfully.
              </Alert>
            </Snackbar>
            <Snackbar
              open={showFailure}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity="error"
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          </div>
        </Box>
      </ThemeProvider>
      <Footer />
    </div>
  );
}
