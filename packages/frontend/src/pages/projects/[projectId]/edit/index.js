import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Typography, Button, Box, Checkbox } from "@mui/material";
import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { useRouter } from "next/router";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Select, MenuItem } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styles from "../../../../styles/editproject.module.css";
import config from "../../../../config";

// pending image update + submit request required

export default function EditProjectPage() {
  const router = useRouter();
  const [specificProject, setSpecificProject] = useState();
  const [formData, setFormData] = useState({});

  const [projectId, setProjectId] = useState();
  const [allCategories, setAllCategories] = useState();
  const [projectSkillsCheckBox, setProjectSkillsCheckBox] = useState({});
  const [presentProjectSkills, setPresentProjectSkills] = useState({});

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
      setProjectSkillsCheckBox(checkBoxBoolean);
    });
  }, []);

  useEffect(() => {
    // To be refactored and shared between project page and edit project page
    if (projectId) {
      const fetchProject = async () => {
        try {
          const [projectResponse, allCategoriesResponse] = await Promise.all([
            axios.get(`http://localhost:8080/projects/${projectId}`),
            axios.get("http://localhost:8080/categories"),
          ]);

          setAllCategories(allCategoriesResponse.data);

          const [categoryResponse, skillsNeededResponse] = await Promise.all([
            axios.get(
              `http://localhost:8080/categories/${projectResponse.data.categoryId}`
            ),
            axios.get(`${config.apiUrl}/requiredSkills?projectId=${projectId}`),
          ]);

          console.log(skillsNeededResponse.data);
          let skillObjectsArray = Object.values(skillsNeededResponse.data);

          const checkBoxBoolean = {};
          skillObjectsArray
            .map((item) => item.skill.skill)
            .map((element, index) => {
              checkBoxBoolean[element] = true;
              delete projectSkillsCheckBox[element];
            });
          setPresentProjectSkills(checkBoxBoolean);

          const editedProject = {
            ...projectResponse.data,
            categoryName: categoryResponse.data.name,
            categoryId: categoryResponse.data.id,
          };

          setSpecificProject(editedProject);

          setFormData({
            name: editedProject.name,
            location: editedProject.location,
            summary: editedProject.summary,
            details: editedProject.details,
            categoryId: editedProject.categoryId,
          });
        } catch (err) {
          console.log(err);
        }
      };
      fetchProject().then(console.log(formData));
    }
  }, [projectId]);

  const handleChange = (e) => {
    console.log(e.target.name + " value is " + e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    setProjectSkillsCheckBox({
      ...userSkillsCheckBox,
      [event.target.name]: event.target.checked,
    });

    // Maps checkbox boolean object into an array of skills to interface with backend
    Object.keys(userSkillsCheckBox).filter(
      (skill) => userSkillsCheckBox[skill]
    );
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
          <p>Project Name</p>
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
          <p>Give a brief summary of what your Rocket is about</p>
          <TextField
            id="summary"
            name="summary"
            multiline
            rows={4}
            fullWidth
            value={formData.summary}
          />
          <p>Location</p>
          <TextField
            required
            id="location"
            name="location"
            onChange={handleChange}
            value={formData.location}
            fullWidth
            variant="standard"
          />
          <p>Share all the details about your project here:</p>
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
          <p>Project Category</p>

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

          <br />
          <br />
          <p>Skills</p>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Current Required Skills</FormLabel>
            <FormGroup>
              {Object.keys(presentProjectSkills).length > 0 ? (
                Object.entries(presentProjectSkills).map(([k, v]) => (
                  <FormControlLabel
                    control={<Checkbox checked={v} disabled name={k} />}
                    key={k}
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
              {Object.keys(projectSkillsCheckBox).length > 0 ? (
                Object.entries(projectSkillsCheckBox).map(([k, v]) => (
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
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
