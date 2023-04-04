import Head from "next/head";
import NavBar from "../../components/navbar";
import Category from "../../components/category";
import Footer from "../../components/footer";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import styles from "../../styles/createprofile.module.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import axios from 'axios';

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

const steps = ["Personal Details", "Social Links", "Skill Sets"];

export default function CreateProfile() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleMobileNumberChange = (e) => {
    const inputMobileNumber = e.target.value;

    setMobileNumber(inputMobileNumber);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const [userSkillsCheckBox, setUserSkillsCheckBox] = useState({});

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

  // useEffect(() => {
  //   axios.get(`http://localhost:8080/skills`).then(({ data }) => {
  //     let skillObjectsArray = Object.values(data);
  //     const checkBoxBoolean = {};
  //     skillObjectsArray
  //       .map((item) => item.skill)
  //       .map((element, index) => (checkBoxBoolean[element] = false));
  //     setUserSkillsCheckBox(checkBoxBoolean);
  //   });
  // }, []);

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
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            {activeStep === 0 && (
              // Render form content for step 1
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Personal details</div>
                  <TextField
                    required
                    id="outlined-required"
                    onChange={handleNameChange}
                    label="Name"
                    // defaultValue="" -> to put from users database
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="Mobile Number"
                    onChange={handleMobileNumberChange}
                    inputProps={{
                      maxLength: 10,
                      pattern: "^0[1-9]\\d{8}$", // Restrict input to only numbers
                    }}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    onChange={handleNameChange}
                    label="Email address"
                    // defaultValue="" -> to put from users database
                  />
                </div>

                <Button onClick={handleNext}>Next</Button>
              </div>
            )}

            {activeStep === 1 && (
              // Render form content for step 2
              <div>
                <div className={styles.steps}>
                  <div className={styles.header}>Social Links</div>
                  <TextField
                    // required
                    id="outlined"
                    onChange={handleNameChange}
                    label="Github Link"
                    // defaultValue="" -> to put from users database
                  />
                  <TextField
                    // required
                    id="outlined"
                    onChange={handleNameChange}
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
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="UX/UI skills"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Software Engineering"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Project Management"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Cybersecurity"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Data Enginering"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Data Science/ Artificial Intelligence"
                    />
                  </FormGroup>
                  {/* <FormGroup>
                    {Object.keys(userSkillsCheckBox).length > 0 ? (
                      Object.entries(userSkillsCheckBox).map(([k, v]) => (
                        <FormControlLabel
                          control={
                            <Checkbox checked={v} onChange={handleCheckboxChange} name={k} />
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
                  </FormGroup> */}
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
