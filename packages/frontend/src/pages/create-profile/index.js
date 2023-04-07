import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import styles from '../../styles/createprofile.module.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import axios from 'axios';

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

const steps = ['Personal Details', 'Social Links', 'Skill Sets'];
const skillsList = [
  'UI/UX Design',
  'Data Analytics',
  'Data Engineering',
  'Data Science',
  'DevOps',
  'Web Development',
  'Application Development',
  'Game Development',
  'Project Management',
  'Product Management',
  'Digital Marketing',
  'Graphic Design'
];

export default function CreateProfile() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [formValues, setFormValues] = useState({});

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
    console.log(formValues);
  };

  const [selectedSkills, setSelectedSkills] = useState([]);
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSkills([...selectedSkills, value]); // Add selected skill to state
      console.log(selectedSkills);
    } else {
      setSelectedSkills(selectedSkills.filter((skill) => skill !== value)); // Remove unselected skill from state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8080/createUser`, formValues, configs)
      .then(function (response) {
        console.log(response);
        setShowSuccess(true);
      })
      .catch(function (error) {
        console.log(error);
        setShowFailure(true);
      });
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false); // Close success snackbar
    setShowFailure(false); // Close failure snackbar
  };

  return (
    <div>
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
                  <p>Your Name</p>
                  <TextField
                    required
                    id="name"
                    onChange={handleInputChange}
                    label="Name"
                    // defaultValue="" -> to pull from users database
                  />
                  <p>Contact Number</p>
                  <TextField
                    required
                    id="mobile"
                    label="Mobile Number"
                    onChange={handleInputChange}
                    inputProps={{
                      maxLength: 10,
                      pattern: '^0[1-9]\\d{8}$' // Restrict input to only numbers
                    }}
                  />
                  <p>Email Address</p>
                  <TextField
                    required
                    id="email"
                    onChange={handleInputChange}
                    label="Email address"
                    // defaultValue="" -> to put from users database
                  />
                </div>
                <div className={styles.btn}>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              // Render form content for step 2
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Social Links</div>
                  <TextField
                    // required
                    id="githubUrl"
                    onChange={handleInputChange}
                    label="Github Link"
                    // defaultValue="" -> to put from users database
                  />
                  <TextField
                    // required
                    id="linkedinUrl"
                    onChange={handleInputChange}
                    label="LinkedIn Profile Link"
                    // defaultValue="" -> to put from users database
                  />
                </div>
                <Button onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            )}

            {activeStep === 2 && (
              // Render form content for step 3
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Skill Sets</div>
                  <FormGroup>
                    {skillsList.map((skill) => (
                      <FormControlLabel
                        key={skill}
                        control={
                          <Checkbox
                            checked={selectedSkills.includes(skill)}
                            onChange={handleCheckboxChange}
                            value={skill}
                          />
                        }
                        label={skill}
                      />
                    ))}
                  </FormGroup>
                </div>
                <Button onClick={handleBack}>Back</Button>
                <Button onClick={handleSubmit} type="submit" variant="contained">
                  Submit
                </Button>
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
