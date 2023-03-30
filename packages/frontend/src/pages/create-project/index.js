import Head from 'next/head';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import styles from '../../styles/createprofile.module.css';
import Box from '@mui/material/Box';
import { Input, Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedOption(selectedOption);
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
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' }
            }}
            noValidate
            autoComplete="off">
            {activeStep === 0 && (
              // Render form content for step 1
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Project name & Summary</div>
                  <p>Project Name</p>
                  <TextField
                    required
                    id="outlined-required"
                    // onChange={handleProjectNameChange}
                    // label="Project Name"
                  />
                  <p>Give a brief summary of what your Rocket is about</p>
                  <TextField
                    id="outlined-multiline-static"
                    label="Brief Summary"
                    multiline
                    rows={4}
                  />
                  <p>Project Category</p>
                  <Select value={selectedOption} onChange={handleOptionChange}>
                    <MenuItem value="">Select an option</MenuItem>
                    <MenuItem value="fintech">Fintech</MenuItem>
                    <MenuItem value="healthtech">Health Tech</MenuItem>
                    <MenuItem value="fnb">F&B</MenuItem>
                    <MenuItem value="socialmedia">Social Media</MenuItem>
                    <MenuItem value="games">Games</MenuItem>
                    <MenuItem value="agritech">Agritech</MenuItem>
                  </Select>

                  <p>Bank Account Number</p>
                  <TextField
                    required
                    id="outlined-required"
                    // onChange={handleProjectNameChange}
                    // label="Project Name"
                  />
                  <p>Location</p>
                  <TextField
                    required
                    id="outlined-required"
                    // onChange={handleProjectNameChange}
                    // label="Project Name"
                  />
                  <p>Funding Goal</p>
                  <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Amount"
                  />
                </div>
                <Button onClick={handleNext}>Next</Button>
              </div>
            )}

            {activeStep === 1 && (
              // Render form content for step 2
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Cover image</div>
                  {/* to be replaced by cloudinary file upload widget */}
                  <Input type="file" />

                  <Button variant="contained" color="primary">
                    Upload
                  </Button>
                </div>
                <Button onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            )}

            {activeStep === 2 && (
              // Render form content for step 3
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>
                    This is where you key in SPECIFIC DETAILS OF THE PROJECT
                  </div>
                  <p>Pitch Slide #1</p>
                  <Input type="file" />
                  <Button variant="contained" color="primary">
                    Upload
                  </Button>
                  <p>Pitch Slide #2</p>
                  <Input type="file" />
                  <Button variant="contained" color="primary">
                    Upload
                  </Button>
                  <p>Pitch Slide #3</p>
                  <Input type="file" />
                  <Button variant="contained" color="primary">
                    Upload
                  </Button>

                  <p>Share all the details about your project here:</p>
                  <TextField
                    id="outlined-multiline-static"
                    label="Brief Summary"
                    multiline
                    rows={10}
                  />
                </div>
                <Button onClick={handleBack}>Back</Button>
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </div>
            )}
          </Box>
        </div>
      </ThemeProvider>
      <Footer />
    </div>
  );
}
