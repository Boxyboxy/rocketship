import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Typography, Button, Box, Checkbox } from "@mui/material";
import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { useRouter } from "next/router";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Select, MenuItem, Input } from "@material-ui/core";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styles from "../../../../styles/editproject.module.css";
import config from "../../../../config";
import CircularProgress from "@mui/material/CircularProgress";
import { getNames } from "country-list";

export default function EditProjectPage() {
  const router = useRouter();
  const [specificProject, setSpecificProject] = useState();
  const [formData, setFormData] = useState({});

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

  // const isFundingGoalValid = (fundingGoal) => {
  //   if (fundingGoal) {
  //     fundingGoal.length >= 1 && /^[1-9][0-9]*(\.[0-9]+)?$/.test(fundingGoal);
  //     console.log(fundingGoal);
  //   }
  // };

  const handleCoverImageChange = (e) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.projectId]);

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

  useEffect(() => {
    // To be refactored and shared between project page and edit project page

    const fetchProject = async () => {
      try {
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
    console.log(formData);

    // axios({
    //   url: `/api/users/${userId}`,
    //   responseType: "json",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "patch",
    //   data: {
    //     ...formValuesTrimmed,
    //     newSkills: Object.keys(userSkillsCheckBox).filter(
    //       (key) => userSkillsCheckBox[key]
    //     ),
    //   },
    // });
  };

  return (
    <div>
      <NavBar />
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
                Upload{" "}
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
            value={parseInt(formData.fundingGoal)}
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
        </form>
      </div>
    </div>
  );
}
