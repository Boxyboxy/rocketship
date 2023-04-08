import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import styles from '../../styles/createproject.module.css';
import Box from '@mui/material/Box';
import { Input, Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import PhotoUpload from '../../components/photoUpload';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
// import Loader from '../../components/loader';

const steps = ['Project name & Summary', 'Cover image', 'Project details'];

export default function CreateProject() {
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

  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/skills'); // Fetch data from the skills db route
        const data = await response.json();
        setSkills(data);
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
    fetchData();
  }, []);

  const [checkedSkills, setCheckedSkills] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      // Add the skill to the checkedSkills array if it's checked
      setCheckedSkills([...checkedSkills, value]);
      console.log(checkedSkills);
    } else {
      // Remove the skill from the checkedSkills array if it's unchecked
      setCheckedSkills(checkedSkills.filter((skill) => skill !== value));
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [categoryId, setCategoryId] = useState('');

  const handleOptionChange = (e) => {
    const categoryId = e.target.value;
    setCategoryId(categoryId);
    console.log(categoryId);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
    console.log(formValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8080/createproject`, formValues, configs)
      .then(function (response) {
        console.log(response);
        openSuccessNotification('top');
      })
      .catch(function (error) {
        console.log(error);
        openFailureNotification('top');
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
                  <div className={styles.header}>Project name & Summary</div>
                  <p>Project Name</p>
                  <TextField
                    required
                    onChange={handleInputChange}
                    id="name"
                    variant="outlined"
                    // label="Project Name"
                  />
                  <p>Brief summary of your Project</p>
                  <TextField
                    id="summary"
                    label="Give a brief summary of what your Rocket is about"
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                  <p>Project Category</p>
                  <Select id="categoryId" value={categoryId} onChange={handleOptionChange}>
                    <MenuItem value="">Select an option</MenuItem>
                    <MenuItem value="1">Fintech</MenuItem>
                    <MenuItem value="2">Health Tech</MenuItem>
                    <MenuItem value="3">Social Media</MenuItem>
                    <MenuItem value="4">Games</MenuItem>
                    <MenuItem value="5">Agritech</MenuItem>
                    <MenuItem value="6">Edutech</MenuItem>
                    <MenuItem value="7">E-Commerce</MenuItem>
                    <MenuItem value="8">F&B</MenuItem>
                  </Select>
                  <p>Required Skill Sets</p>
                  {skills.map((skill, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Checkbox />}
                      label={skill.skill} // Render the skill value as the label
                      value={skill.skill}
                      onChange={handleCheckboxChange}
                    />
                  ))}
                  <p>Github Repo URL</p>
                  <TextField required id="githubRepoUrl" onChange={handleInputChange} />
                  <p>Bank Account Number</p>
                  <TextField required id="bankAccountId" onChange={handleInputChange} />
                  <p>Location</p>
                  <TextField required id="location" onChange={handleInputChange} />
                  <p>Funding Goal</p>
                  <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                  <OutlinedInput
                    id="fundinggoal"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Amount"
                    onChange={handleInputChange}
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
                  <div className={styles.header}>Cover image</div>
                  <PhotoUpload />
                </div>
                <div className={styles.btn}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              // Render form content for step 3
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Key in SPECIFIC DETAILS of your project</div>
                  <div className={styles.slidesUpload}>
                    <p>Pitch Slide #1</p>
                    <PhotoUpload />

                    <p>Pitch Slide #2</p>
                    <PhotoUpload />

                    <p>Pitch Slide #3</p>
                    <PhotoUpload />
                  </div>
                  <p>Share all the details about your project here:</p>
                  <TextField
                    id="details"
                    label="Details of your project"
                    multiline
                    rows={10}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.btn}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button type="submit" variant="contained" onClick={handleSubmit}>
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
              </div>
            )}
          </Box>
        </div>
      </ThemeProvider>
      <Footer />
    </div>
  );
}
