import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import styles from '../../styles/createprofile.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import config from '../../config';
import { useRouter } from 'next/router';

const steps = ['Personal Details', 'Social Links', 'Skill Sets'];

export default function CreateProfile() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#21325e' // Replace with your desired primary color
      }
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif' // Replace with your desired font family
    }
  });

  const [skills, setSkills] = useState([]);
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userDetails, setUserDetails] = useState();

  const router = useRouter();
  const { personalId } = router.query;
  const [presentUserSkills, setPresentUserSkills] = useState({});

  const { user, error, isLoading } = useUser();
  const [userId, setUserId] = useState();

  const [userSkillsCheckBox, setUserSkillsCheckBox] = useState({});
  const [formValues, setFormValues] = useState({
    name: fullName,
    mobile: '',
    email: '',
    githubUrl: '',
    linkedinUrl: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState('User Profile failed. Please try again.');

  //fetch userid
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/users?email=${user.email}`);
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchUserId();
  }, [user]);

  //get full name
  useEffect(() => {
    if (user) {
      const fullName = `${user.given_name} ${user.family_name}`;
      setFullName(fullName);
    }
  }, [user]);

  //get email
  useEffect(() => {
    if (user) {
      const email = `${user.email}`;
      setUserEmail(email);
    }
  }, [user]);

  //data validation
  const isNameValid = (name) =>
    name.trim().includes(' ') && name.trim().length > 3 && name.trim().split(' ').length == 2;

  const isMobileValid = (mobile) => mobile.length == 8 && mobile.match(/^\d{8}$/);

  const isEmailValid = (email) => email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  const isGithubUrlValid = (url) =>
    url.length > 2 && url.includes('.') && url.startsWith('http') && url.includes('github');

  const isLinkedinUrlValid = (url) =>
    url.length > 2 && url.includes('.') && url.startsWith('http') && url.includes('linkedin');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/users/${personalId}`);

        setFormValues({
          name: response.data.name,
          // mobile: response.data.mobile,
          email: response.data.email
          // linkedinUrl: response.data.linkedinUrl,
          // githubUrl: response.data.githubUrl
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (personalId) fetchUserData();
  }, [personalId]);
  console.log(formValues);
  console.log(fullName);

  //get skills
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`${config.apiUrl}/skills`); // Fetch data from the skills db route
  //       const data = await response.json();
  //       setSkills(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error('Failed to fetch skills:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const [checkedSkills, setCheckedSkills] = useState([]);
  // const handleCheckboxChange = (event) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     // Add the skill to the checkedSkills array if it's checked
  //     setCheckedSkills([...checkedSkills, value]);
  //     console.log(checkedSkills);
  //   } else {
  //     // Remove the skill from the checkedSkills array if it's unchecked
  //     setCheckedSkills(checkedSkills.filter((skill) => skill !== value));
  //   }
  // };

  // requiredSkills
  const [skillsCheckbox, setSkillsCheckbox] = useState({});

  useEffect(() => {
    axios.get(`${config.apiUrl}/skills`).then(({ data }) => {
      let skillObjectsArray = Object.values(data);
      const checkBoxBoolean = {};
      skillObjectsArray
        .map((item) => item.skill)
        .map((element, index) => (checkBoxBoolean[element] = false));
      setSkillsCheckbox(checkBoxBoolean);
    });
  }, []);
  const handleCheckboxChange = (event) => {
    setSkillsCheckbox({
      ...skillsCheckbox,
      [event.target.name]: event.target.checked
    });
    console.log(skillsCheckbox);
    // Maps checkbox boolean object into an array of skills to interface with backend
    Object.keys(skillsCheckbox).filter((skill) => skillsCheckbox[skill]);
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  // form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = {
      ...formValues,
      skills: Object.keys(skillsCheckbox).filter((skill) => skillsCheckbox[skill])
    };
    axios
      .post(`http://localhost:8080/users`, { ...formData })
      .then(function (response) {
        console.log(response.data);
        setShowSuccess(true);
        const handleRedirect = async () => {
          let preConstructPath = `/projects`;
          router.push({
            pathname: preConstructPath
          });
        };
        handleRedirect();
      })
      .catch(function (error) {
        console.log(error);
        setShowFailure(true);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false); // Close success snackbar
    setShowFailure(false); // Close failure snackbar
  };

  //check if user has logged in before
  useEffect(() => {
    // Check if user has created a profile
    // const hasCreatedProfile = localStorage.getItem('hasCreatedProfile');

    if (!isLoading && user) {
      // Call the API to check if the user already exists in the database
      axios
        .get(`http://localhost:8080/users?email=${userEmail}`)
        .then((response) => {
          const userExists = response.data.length > 0;
          if (userExists) {
            // Redirect to dashboard if profile exists or user already exists in the database
            router.push('/projects');
          } else {
            // Redirect to create profile page if profile does not exist and user does not exist in the database
            router.push('/create-profile');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, isLoading]);

  return (
    <div>
      <Head>
        {' '}
        <title>Create Profile</title>
      </Head>
      <NavBar />
      <Category />
      <ThemeProvider theme={theme}>
        <div className={styles.form}>
          <div>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '50ch' }
            }}
            noValidate
            autoComplete="off">
            {activeStep === 0 && (
              // Render form content for step 1
              <div className={styles.stepsBox}>
                <div className={styles.steps}>
                  <div className={styles.header}>Personal details</div>
                  <TextField
                    required
                    id="name"
                    onChange={handleInputChange}
                    label="Name"
                    value={formValues.name}
                    placeholder={fullName}
                    InputLabelProps={{ shrink: true }}
                    error={!isNameValid(formValues.name)}
                    helperText={
                      isNameValid(formValues.name)
                        ? ''
                        : 'Please enter a full name with a space in between your first and last name'
                    }
                  />

                  <TextField
                    required
                    id="mobile"
                    label="Mobile Number"
                    onChange={handleInputChange}
                    inputProps={{
                      maxLength: 10,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    value={formValues.mobile}
                    InputLabelProps={{ shrink: true }}
                    error={!isMobileValid(formValues.mobile)}
                    helperText={
                      isMobileValid(formValues.mobile)
                        ? ''
                        : 'Please enter an 8 digit mobile number'
                    }
                  />
                  <TextField
                    required
                    id="email"
                    onChange={handleInputChange}
                    placeholder={userEmail}
                    label="Email address"
                    value={formValues.email}
                    InputLabelProps={{ shrink: true }}
                    error={!isEmailValid(formValues.email)}
                    helperText={isEmailValid(formValues.email) ? '' : 'Email is not valid'}
                  />
                </div>
                <div className={styles.btn}>
                  <Button
                    onClick={handleNext}
                    disabled={
                      !(
                        isNameValid(formValues.name) &&
                        isMobileValid(formValues.mobile) &&
                        isEmailValid(formValues.email)
                      )
                    }>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              // Render form content for step 2
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Social Links</div>
                  <TextField
                    id="githubUrl"
                    onChange={handleInputChange}
                    label="Github Link"
                    value={formValues.githubUrl}
                    InputLabelProps={{ shrink: true }}
                    error={!isGithubUrlValid(formValues.githubUrl)}
                    helperText={
                      isGithubUrlValid(formValues.githubUrl) ? '' : 'Github URL is not valid'
                    }
                  />
                  <TextField
                    id="linkedinUrl"
                    onChange={handleInputChange}
                    label="LinkedIn Profile Link"
                    value={formValues.linkedinUrl}
                    InputLabelProps={{ shrink: true }}
                    error={!isLinkedinUrlValid(formValues.linkedinUrl)}
                    helperText={
                      isLinkedinUrlValid(formValues.linkedinUrl) ? '' : 'Linkedin URL is not valid'
                    }
                  />
                </div>
                <div className={styles.btnGroup}>
                  <Button onClick={handleBack} sx={{ marginRight: '20px' }}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={
                      !(
                        isGithubUrlValid(formValues.githubUrl) &&
                        isLinkedinUrlValid(formValues.linkedinUrl)
                      )
                    }>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              // Render form content for step 3
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Tick all the skill sets that you possess!</div>
                  <FormGroup>
                    {Object.keys(skillsCheckbox).length > 0 ? (
                      Object.entries(skillsCheckbox).map(([k, v]) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={v}
                              onChange={handleCheckboxChange}
                              name={k}
                              key={k}
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
                </div>
                <div className={styles.btnGroup}>
                  <Button onClick={handleBack} sx={{ marginRight: '20px' }}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    variant="contained"
                    disabled={
                      !(
                        isNameValid(formValues.name) &&
                        isMobileValid(formValues.mobile) &&
                        isEmailValid(formValues.email) &&
                        isGithubUrlValid(formValues.githubUrl) &&
                        isLinkedinUrlValid(formValues.linkedinUrl)
                      )
                    }>
                    Submit
                  </Button>
                </div>
                <Snackbar
                  open={showSuccess}
                  autoHideDuration={3000}
                  onClose={handleSnackbarClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                  <Alert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="success">
                    User creation successful!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={showFailure}
                  autoHideDuration={3000}
                  onClose={handleSnackbarClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                  <Alert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="error">
                    User creation failed. Please try again.
                  </Alert>
                </Snackbar>
              </div>
            )}
          </Box>
        </div>
      </ThemeProvider>
      <Footer />
    </div>
  );
}
