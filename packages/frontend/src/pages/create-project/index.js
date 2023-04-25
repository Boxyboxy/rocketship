import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import styles from '../../styles/createproject.module.css';

import { useState, useEffect } from 'react';
import {
  TextField,
  Snackbar,
  Alert,
  Checkbox,
  FormLabel,
  FormGroup,
  FormControl,
  CircularProgress,
  Box
} from '@mui/material';
import {
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  Button,
  Input,
  FormControlLabel,
  FormHelperText
} from '@material-ui/core';

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
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [skills, setSkills] = useState([]);

  const [formValues, setFormValues] = useState({
    name: '',
    summary: '',
    coverImage: '',
    details: '',
    bankAccountNumber: '',
    bank: '',
    status: 'active',
    githubRepoUrl: '',
    fundingGoal: 0,
    pitchSlidesUrlStrings: [],
    requiredSkills: []
  });

  //get userId with email
  const { user, error, isLoading } = useUser();
  const [userId, setUserId] = useState();
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

  const isNumberValid = (bankNo) => bankNo.length === 10 && /^[1-9][0-9]*(\.[0-9]+)?$/.test(bankNo);

  const isGithubUrlValid = (url) =>
    url.length > 2 && url.includes('.') && url.startsWith('http') && url.includes('github');
  // project category
  const [categoryId, setCategoryId] = useState('');
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setCategoryId(categoryId);
  };

  //for country selection
  const countryNames = getNames();
  const [country, setCountry] = useState('');
  const changeCountry = (selectedCountry) => {
    setCountry(selectedCountry);
  };

  // requiredSkills
  const [requiredSkillsCheckbox, setRequiredSkillsCheckbox] = useState({});

  useEffect(() => {
    axios.get(`${config.apiUrl}/skills`).then(({ data }) => {
      let skillObjectsArray = Object.values(data);
      const checkBoxBoolean = {};
      skillObjectsArray
        .map((item) => item.skill)
        .map((element, index) => (checkBoxBoolean[element] = false));
      setRequiredSkillsCheckbox(checkBoxBoolean);
    });
  }, []);
  const handleCheckboxChange = (event) => {
    setRequiredSkillsCheckbox({
      ...requiredSkillsCheckbox,
      [event.target.name]: event.target.checked
    });
    console.log(requiredSkillsCheckbox);
    // Maps checkbox boolean object into an array of skills to interface with backend
    Object.keys(requiredSkillsCheckbox).filter((skill) => requiredSkillsCheckbox[skill]);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // upload specific components
  const [showUploadAlert, setShowUploadAlert] = useState();
  const [coverImage, setCoverImage] = useState();
  const [pitchSlide1, setPitchSlide1] = useState();
  const [pitchSlide2, setPitchSlide2] = useState();
  const [pitchSlide3, setPitchSlide3] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);
  const handleCoverImageChange = (e) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handlePitchSlide1Change = (e) => {
    if (e.target.files) {
      setPitchSlide1(e.target.files[0]);
    }
  };

  const handlePitchSlide2Change = (e) => {
    if (e.target.files) {
      setPitchSlide2(e.target.files[0]);
    }
  };

  const handlePitchSlide3Change = (e) => {
    if (e.target.files) {
      setPitchSlide3(e.target.files[0]);
    }
  };

  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUploadFailure, setShowUploadFailure] = useState(false);
  const handleUploadSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowUploadSuccess(false); // Close success snackbar
    setShowUploadFailure(false); // Close failure snackbar
  };

  const handleUploadClick = async () => {
    if (!coverImage || !pitchSlide1 || !pitchSlide2 || !pitchSlide3) {
      setShowUploadAlert(true);
      return;
    }
    setShowUploadAlert(false);
    setUploadLoading(true);
    const coverImageFD = new FormData();
    coverImageFD.append('file', coverImage);
    coverImageFD.append('upload_preset', 'rocketship');

    const pitchSlide1FD = new FormData();
    pitchSlide1FD.append('file', pitchSlide1);
    pitchSlide1FD.append('upload_preset', 'rocketship');

    const pitchSlide2FD = new FormData();
    pitchSlide2FD.append('file', pitchSlide2);
    pitchSlide2FD.append('upload_preset', 'rocketship');

    const pitchSlide3FD = new FormData();
    pitchSlide3FD.append('file', pitchSlide3);
    pitchSlide3FD.append('upload_preset', 'rocketship');
    try {
      const [coverImageResponse, pitchSlide1Response, pitchSlide2Response, pitchSlide3Response] =
        await Promise.all([
          await axios.post('https://api.cloudinary.com/v1_1/dbq7yg58d/image/upload/', coverImageFD),
          await axios.post(
            'https://api.cloudinary.com/v1_1/dbq7yg58d/image/upload/',
            pitchSlide1FD
          ),
          await axios.post(
            'https://api.cloudinary.com/v1_1/dbq7yg58d/image/upload/',
            pitchSlide2FD
          ),
          await axios.post('https://api.cloudinary.com/v1_1/dbq7yg58d/image/upload/', pitchSlide3FD)
        ]);

      setFormValues({
        ...formValues,
        coverImage: coverImageResponse.data['secure_url'],
        pitchSlidesUrlStrings: [
          pitchSlide1Response.data['secure_url'],
          pitchSlide2Response.data['secure_url'],
          pitchSlide3Response.data['secure_url']
        ]
      });

      setShowUploadSuccess(true);
      console.log({
        ...formValues,
        coverImage: pitchSlide1Response.data['secure_url'],
        pitchSlidesUrlStrings: [
          pitchSlide1Response.data['secure_url'],
          pitchSlide2Response.data['secure_url'],
          pitchSlide3Response.data['secure_url']
        ]
      });
      setUploadLoading(false);
    } catch (err) {
      console.log(err);
      setUploadLoading(false);
      setShowUploadFailure(true);
    }
  };

  // form input change
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
    console.log(formValues);
  };
  // form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = {
      ...formValues,
      location: country,
      categoryId: categoryId,
      userId: userId,
      requiredSkills: Object.keys(requiredSkillsCheckbox).filter(
        (skill) => requiredSkillsCheckbox[skill]
      )
    };
    axios
      .post(`${config.apiUrl}/projects`, { ...formData })
      .then(function (response) {
        console.log(response.data);
        setShowSuccess(true);
        const handleRedirect = async () => {
          let preConstructPath = `/projects/${response.data.id}`;
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

  // snackbar
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
                    value={formValues.summary}
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
                    value={formValues.fundingGoal}
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
                    value={formValues.githubRepoUrl}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!isGithubUrlValid(formValues.githubRepoUrl)}
                    helperText={
                      isGithubUrlValid(formValues.githubRepoUrl) ? '' : 'Github URL is not valid'
                    }
                  />
                  <TextField
                    required
                    id="bankAccountNumber"
                    label="Bank Account Number"
                    value={formValues.bankAccountNumber}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!isNumberValid(formValues.bankAccountNumber)}
                    helperText={
                      isNumberValid(formValues.bankAccountNumber)
                        ? ''
                        : 'Please enter a valid 10 digit bank account number without hyphens'
                    }
                  />
                  <TextField
                    required
                    id="bank"
                    label="Bank"
                    value={formValues.bank}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!isNameValid(formValues.bank)}
                    helperText={isNameValid(formValues.bank) ? '' : 'Please enter your bank'}
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
                        isNumberValid(formValues.bankAccountNumber) &&
                        isNameValid(formValues.bank)
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
                        onChange={handleCategoryChange}
                        InputLabelProps={{ shrink: true }}>
                        <MenuItem value="">Select an option</MenuItem>
                        <MenuItem value="1">Fintech</MenuItem>
                        <MenuItem value="2">Health Tech</MenuItem>
                        <MenuItem value="3">Social Media</MenuItem>
                        <MenuItem value="4">Games</MenuItem>
                        <MenuItem value="5">Agritech</MenuItem>
                        <MenuItem value="6">Edutech</MenuItem>
                        <MenuItem value="7">E-Commerce</MenuItem>
                        <MenuItem value="8">FnB</MenuItem>
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
                      <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Select required skills</FormLabel>
                        <FormGroup>
                          {Object.keys(requiredSkillsCheckbox).length > 0 ? (
                            Object.entries(requiredSkillsCheckbox).map(([k, v]) => (
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
                      </FormControl>
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
                  <div>
                    <Input type="file" onChange={handleCoverImageChange} />

                    <div>{coverImage && `${coverImage.name} - ${coverImage.type}`}</div>
                  </div>
                  <p>Pitch Slide #1</p>
                  <div>
                    <Input type="file" onChange={handlePitchSlide1Change} />

                    <div>{pitchSlide1 && `${pitchSlide1.name} - ${pitchSlide1.type}`}</div>
                  </div>

                  <p>Pitch Slide #2</p>
                  <div>
                    <Input type="file" onChange={handlePitchSlide2Change} />

                    <div>{pitchSlide2 && `${pitchSlide2.name} - ${pitchSlide2.type}`}</div>
                  </div>

                  <p>Pitch Slide #3</p>
                  <div>
                    <Input type="file" onChange={handlePitchSlide3Change} />

                    <div>{pitchSlide3 && `${pitchSlide3.name} - ${pitchSlide3.type}`}</div>

                    <Button variant="contained" color="primary" onClick={handleUploadClick}>
                      Upload
                    </Button>
                    {showUploadAlert && (
                      <Alert variant="filled" severity="error">
                        Please upload a cover page and 3 pitch slides. Only image files will be
                        accepted.
                      </Alert>
                    )}
                  </div>
                  <div>{uploadLoading && <CircularProgress />}</div>
                  <Snackbar
                    open={showUploadSuccess}
                    autoHideDuration={3000}
                    onClose={handleUploadSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert
                      elevation={6}
                      variant="filled"
                      onClose={handleSnackbarClose}
                      severity="success">
                      Upload of images successful.
                    </Alert>
                  </Snackbar>
                  <Snackbar
                    open={showUploadFailure}
                    autoHideDuration={3000}
                    onClose={handleUploadSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert
                      elevation={6}
                      variant="filled"
                      onClose={handleUploadSnackbarClose}
                      severity="error">
                      Failed to upload images.
                    </Alert>
                  </Snackbar>
                </div>

                <div className={styles.btnGroup}>
                  <Button onClick={handleBack} disabled={uploadLoading}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={uploadLoading}>
                    Next
                  </Button>
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
                    Project creation successful!
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
                    Project creation failed. Please try again.
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
