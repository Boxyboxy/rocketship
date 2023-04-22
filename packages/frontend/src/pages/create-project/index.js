import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import styles from '../../styles/createproject.module.css';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Stepper, Step, StepLabel, Select, MenuItem, Button } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import PhotoUpload from '../../components/photoUpload';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { getNames } from 'country-list';
import { useUser } from '@auth0/nextjs-auth0/client';
import config from '../../config';
import axios from 'axios';
import { useRouter } from 'next/router';

const steps = [
  'Project name & Summary',
  'Category & Skills Required',
  'Upload images',
  'Project details'
];

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
  const [skills, setSkills] = useState([]);
  const [country, setCountry] = useState('');
  const countryNames = getNames();
  const { user, error, isLoading } = useUser();
  const [userId, setUserId] = useState();
  const router = useRouter();
  const { personalId } = router.query;

  const [formValues, setFormValues] = useState({
    name: '',
    categoryId: '',
    summary: '',
    coverImage: '',
    detail: '',
    bankAccountId: '',
    status: 'active',
    location: '',
    githubRepoUrl: '',
    fundingGoal: 0,
    pitchSlidesUrlStrings: [],
    requiredSkills: []
  });

  //get userId with email
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/users?email=${user.email}`);
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);

  //data validation
  const isNameValid = (name) => name.trim().length > 1;

  const isFundingGoalValid = (fundingGoal) =>
    fundingGoal.length >= 1 && /^[1-9][0-9]*(\.[0-9]+)?$/.test(fundingGoal);

  const isNumberValid = (bankNo) => bankNo.length === 1 && /^[1-9][0-9]*(\.[0-9]+)?$/.test(bankNo);

  const isGithubUrlValid = (url) =>
    url.length > 2 && url.includes('.') && url.startsWith('http') && url.includes('github');

  //for country selection
  const changeCountry = (selectedCountry) => {
    setCountry(selectedCountry);
    console.log(selectedCountry);
  };

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
      .post(`http://localhost:8080/createproject`, formValues, config)
      .then(function (response) {
        console.log(response);
        // openSuccessNotification('top');
      })
      .catch(function (error) {
        console.log(error);
        // openFailureNotification('top');
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
      <Head>
        <title>Launch a Rocket</title>
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
                  <div className={styles.header}>Project name & Summary</div>
                  <TextField
                    required
                    id="name"
                    onChange={handleInputChange}
                    label="Project Name"
                    value={formValues.name}
                    InputLabelProps={{ shrink: true }}
                    error={!isNameValid(formValues.name)}
                    helperText={
                      isNameValid(formValues.name) ? '' : 'Please enter your project name'
                    }
                  />
                  <TextField
                    required
                    id="summary"
                    label="Give a brief summary of what your project is about"
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    InputLabelProps={{ shrink: true }}
                    error={!isNameValid(formValues.summary)}
                    helperText={
                      isNameValid(formValues.summary)
                        ? ''
                        : 'Please enter a short description of your project'
                    }
                  />

                  <TextField
                    required
                    id="fundingGoal"
                    label="Funding Goal"
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <div>$</div>
                    }}
                    error={!isFundingGoalValid(formValues.fundingGoal)}
                    helperText={
                      isFundingGoalValid(formValues.fundingGoal) ? '' : 'Please enter only numbers'
                    }
                  />
                  <TextField
                    required
                    id="githubRepoUrl"
                    label="GitHub Repository URL"
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!isGithubUrlValid(formValues.githubRepoUrl)}
                    helperText={
                      isGithubUrlValid(formValues.githubRepoUrl) ? '' : 'Github URL is not valid'
                    }
                  />
                  <TextField
                    required
                    id="bankAccountId"
                    label="Bank Account Number"
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!isNumberValid(formValues.bankAccountId)}
                    helperText={
                      isNumberValid(formValues.bankAccountId) ? '' : 'Please enter only numbers'
                    }
                  />
                </div>

                <div className={styles.btn}>
                  <Button
                    className={styles.btn}
                    onClick={handleNext}
                    disabled={
                      !(
                        isNameValid(formValues.name) &&
                        isNameValid(formValues.summary) &&
                        isFundingGoalValid(formValues.fundingGoal) &&
                        isGithubUrlValid(formValues.githubRepoUrl) &&
                        isNumberValid(formValues.bankAccountId)
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
                  <div className={styles.header}>Category & Skills Required</div>

                  <div className={styles.category}>
                    <FormControl sx={{ minWidth: 350 }}>
                      {' '}
                      <p>Select a Category</p>
                      <Select
                        required
                        id="categoryId"
                        label="Category"
                        value={categoryId}
                        onChange={handleOptionChange}
                        InputLabelProps={{ shrink: true }}>
                        <MenuItem value="">Select an option</MenuItem>
                        <MenuItem value="1">Fintech</MenuItem>
                        <MenuItem value="2">Health Tech</MenuItem>
                        <MenuItem value="3">Social Media</MenuItem>
                        <MenuItem value="4">Games</MenuItem>
                        <MenuItem value="5">Agritech</MenuItem>
                        <MenuItem value="6">Edutech</MenuItem>
                        <MenuItem value="7">E-Commerce</MenuItem>
                        <MenuItem value="8">F&B</MenuItem>
                      </Select>{' '}
                      {!categoryId && <FormHelperText>Please select an option</FormHelperText>}
                      <p>Where is this project based in?</p>
                      <Select
                        required
                        value={country}
                        onChange={(e) => changeCountry(e.target.value)}>
                        {countryNames.map((country) => (
                          <MenuItem key={country} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </Select>{' '}
                      {!country && <FormHelperText>Please select an option</FormHelperText>}
                    </FormControl>
                    <p>Required Skill Sets</p>
                    <div className={styles.skills}>
                      {skills.map((skill, index) => (
                        <FormControlLabel
                          key={index}
                          control={<Checkbox />}
                          label={skill.skill} // Render the skill value as the label
                          value={skill.skill}
                          onChange={handleCheckboxChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.btnGroup}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext} disabled={!(categoryId && country)}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              // Render form content for step 3
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Upload images</div>
                </div>

                <div className={styles.slidesUpload}>
                  <p>Cover Image</p>
                  <PhotoUpload />
                  <p>Pitch Slide #1</p>
                  <PhotoUpload />

                  <p>Pitch Slide #2</p>
                  <PhotoUpload />

                  <p>Pitch Slide #3</p>
                  <PhotoUpload />
                </div>

                <div className={styles.btnGroup}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}
            {activeStep === 3 && (
              // Render form content for step 4
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Project Details</div>

                  <p>Share all the details about your project here:</p>

                  <TextField
                    id="details"
                    label="Details of your project"
                    multiline
                    rows={10}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                {/* <div className={styles.btn}> */}
                <div className={styles.btnGroup}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button type="submit" variant="contained" onClick={handleSubmit}>
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
                {/* </div> */}
              </div>
            )}
          </Box>
        </div>
      </ThemeProvider>
      <Footer />
    </div>
  );
}
