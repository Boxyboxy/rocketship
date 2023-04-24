import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  TextField,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import NavBar from "../../../../components/navbar";

import { useRouter } from "next/router";
import axios from "axios";

import { Select, MenuItem, Input } from "@material-ui/core";

import styles from "../../../../styles/editproject.module.css";
import config from "../../../../config";

import { getNames } from "country-list";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function EditProjectPage() {
  const router = useRouter();

  const { user, error, isLoading } = useUser();
  const [userId, setUserId] = useState();
  console.log(userId);
  const [specificProject, setSpecificProject] = useState();
  const [formData, setFormData] = useState({});
  const [projectOwnerId, setProjectOwnerId] = useState();

  const [projectId, setProjectId] = useState();
  const [allCategories, setAllCategories] = useState();
  const [requiredSkillsCheckbox, setRequiredSkillsCheckbox] = useState({});

  const countryNames = getNames();
  const [country, setCountry] = useState("");
  const changeCountry = (selectedCountry) => {
    let updatedFormData = formData;
    updatedFormData.location = selectedCountry;
    setFormData({ ...updatedFormData });
  };

  const [coverImage, setCoverImage] = useState();
  const [showUploadAlert, setShowUploadAlert] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUploadFailure, setShowUploadFailure] = useState(false);
  const [skillsLoaded, setSkillsLoaded] = useState(false);

  // const isFundingGoalValid = (fundingGoal) => {
  //   if (fundingGoal) {
  //     fundingGoal.length >= 1 && /^[1-9][0-9]*(\.[0-9]+)?$/.test(fundingGoal);
  //     console.log(fundingGoal);
  //   }
  // };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users?email=${user.email}`
        );
        setUserId(response.data[0].id);
        console.log(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);

  console.log(userId);
  console.log(projectOwnerId);

  const handleCoverImageChange = (e) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleBackButtonClick = () => {
    router.push({
      pathname: `/projects`,
    });
  };

  useEffect(() => {
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.projectId]);

  // useEffect(() => {
  //   const fetchSkills = async () => {

  //     setSkillsLoaded(true);
  //   };
  //   fetchSkills();
  // }, [router.query.projectId]);

  useEffect(() => {
    const fetchSkills = async () => {};
    //     setSkillsLoaded(true);
    //   };

    const fetchProject = async () => {
      try {
        // fetch skills
        await axios.get(`${config.apiUrl}/skills`).then(({ data }) => {
          let skillObjectsArray = Object.values(data);
          const checkBoxBoolean = {};
          skillObjectsArray
            .map((item) => item.skill)
            .map((element, index) => (checkBoxBoolean[element] = false));
          setRequiredSkillsCheckbox(checkBoxBoolean);
        });
        // fetch projects & categories
        const [projectResponse, allCategoriesResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/projects/${projectId}`),
          axios.get(`${config.apiUrl}/categories`),
        ]);

        let skillObjectsArray = Object.values(projectResponse.data.skills);
        const checkBoxBoolean = requiredSkillsCheckbox;
        skillObjectsArray
          .map((item) => item.skill)
          .map((element, index) => {
            checkBoxBoolean[element] = true;
          });
        // set required skills and categories
        setRequiredSkillsCheckbox(checkBoxBoolean);
        setAllCategories(allCategoriesResponse.data);
        const categoryResponse = await axios.get(
          `${config.apiUrl}/categories/${projectResponse.data.categoryId}`
        );

        const editedProject = {
          ...projectResponse.data,
          categoryName: categoryResponse.data.name,
          categoryId: categoryResponse.data.id,
        };

        setSpecificProject(editedProject);

        setFormData({
          coverImage: editedProject.coverImage,
          name: editedProject.name,
          location: editedProject.location,
          summary: editedProject.summary,
          details: editedProject.details,
          categoryId: editedProject.categoryId,
          fundingGoal: editedProject.fundingGoal,
          githubRepoUrl: editedProject.githubRepoUrl,
        });

        setProjectOwnerId(editedProject.userId);
      } catch (err) {
        console.log(err);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    console.log(e.target.name + " value is " + e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    setRequiredSkillsCheckbox({
      ...requiredSkillsCheckbox,
      [event.target.name]: event.target.checked,
    });

    // Maps checkbox boolean object into an array of skills to interface with backend
    Object.keys(requiredSkillsCheckbox).filter(
      (skill) => requiredSkillsCheckbox[skill]
    );
  };

  const handleUploadClick = async () => {
    if (!coverImage) {
      setShowUploadAlert(true);
      return;
    }
    setShowUploadAlert(false);
    setUploadLoading(true);

    const coverImageFD = new FormData();
    coverImageFD.append("file", coverImage);
    coverImageFD.append("upload_preset", "rocketship");

    try {
      const [coverImageResponse] = await Promise.all([
        await axios.post(
          "https://api.cloudinary.com/v1_1/dbq7yg58d/image/upload/",
          coverImageFD
        ),
      ]);

      setFormData({
        ...formData,
        coverImage: coverImageResponse.data["secure_url"],
      });

      setShowUploadSuccess(true);

      setUploadLoading(false);
    } catch (err) {
      console.log(err);
      setUploadLoading(false);
      setShowUploadFailure(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      ...formData,
      requiredSkills: Object.keys(requiredSkillsCheckbox).filter(
        (skill) => requiredSkillsCheckbox[skill]
      ),
    });

    axios
      .patch(`http://localhost:8080/projects/${projectId}`, {
        ...formData,
        requiredSkills: Object.keys(requiredSkillsCheckbox).filter(
          (skill) => requiredSkillsCheckbox[skill]
        ),
      })
      .then(function (response) {
        console.log(response.data);
        setShowSuccess(true);
        const handleRedirect = async () => {
          let preConstructPath = `/projects/${response.data.id}`;
          router.push({
            pathname: preConstructPath,
          });
        };
        handleRedirect();
      })
      .catch(function (error) {
        console.log(error);
        setShowFailure(true);
      });
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccess(false); // Close success snackbar
    setShowFailure(false); // Close failure snackbar
  };

  return (
    <div>
      <NavBar />
      {projectOwnerId === userId ? (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div>
              <p>Cover Image</p>
              <img src={formData.coverImage} width="200" />
              <div>
                <Input type="file" onChange={handleCoverImageChange} />
                <Button
                  sx={{
                    variant: "primary",
                    margin: "0px 20px",
                    color: "white",
                    backgroundColor: "#21325E",
                    "&:hover": {
                      backgroundColor: "#21325E",
                    },
                  }}
                  onClick={handleUploadClick}
                >
                  Upload
                </Button>
                {uploadLoading && <CircularProgress />}
              </div>
            </div>
            <div className={styles.header}>Project Name</div>
            <TextField
              required
              id="name"
              name="name"
              onChange={handleChange}
              // label="Project Name"
              value={formData.name}
              variant="standard"
              fullWidth
            />
            <div className={styles.header}>
              Give a brief summary of what your Rocket is about
            </div>
            <TextField
              id="summary"
              name="summary"
              multiline
              rows={4}
              fullWidth
              value={formData.summary}
              onChange={handleChange}
            />

            <div className={styles.header}>
              Share all the details about your project here
            </div>
            <TextField
              id="details"
              name="details"
              multiline
              rows={10}
              onChange={handleChange}
              value={formData.details}
              fullWidth
            />
            <br />
            <div className={styles.header}>Project Category</div>
            {formData.categoryId && (
              <Select
                onChange={handleChange}
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                fullWidth
              >
                {allCategories &&
                  allCategories.map((category) => {
                    return (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            )}
            <div className={styles.header}>Location</div>
            {formData.location && (
              <Select
                required
                value={formData.location}
                defaultValue={formData.location}
                onChange={handleChange}
                id="location"
                name="location"
                fullWidth
              >
                {countryNames.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            )}
            <div className={styles.header}>Funding Goal</div>
            <TextField
              required
              id="fundingGoal"
              name="fundingGoal"
              onChange={handleChange}
              value={formData.fundingGoal}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <div>$</div>,
              }}
              // error={!isFundingGoalValid(formData.fundingGoal)}
              // helperText={
              //   isFundingGoalValid(formData.fundingGoal)
              //     ? ""
              //     : "Please enter only numbers"
              // }
              variant="standard"
            />
            <div className={styles.header}>Github Repo URL</div>
            <TextField
              required
              id="githubRepoUrl"
              name="githubRepoUrl"
              onChange={handleChange}
              value={formData.githubRepoUrl}
              fullWidth
              variant="standard"
            />
            <br />
            <br />
            <div className={styles.header}>Skills</div>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Select more skills</FormLabel>
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
            <br />
            <Button
              type="submit"
              variant="contained"
              sx={{
                variant: "primary",
                color: "white",
                backgroundColor: "#21325E",
                "&:hover": {
                  backgroundColor: "#21325E",
                },
              }}
            >
              Update
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
                Project creation successful!
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
                Project creation failed. Please try again.
              </Alert>
            </Snackbar>
          </form>
        </div>
      ) : (
        <div>
          <Grid container>
            <Grid sx={{ margin: "auto", marginTop: 20 }}>
              <Grid sx={{ justifyItems: "center" }}></Grid>
              <br />
              Oops you don't have permission to do this. <br />
              <Button
                variant="primary"
                sx={{
                  color: "white",
                  backgroundColor: "#21325E",
                  marginTop: 5,
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#21325E",
                  },
                }}
                onClick={handleBackButtonClick}
              >
                Back to projects
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
