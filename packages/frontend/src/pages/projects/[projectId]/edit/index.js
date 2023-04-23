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
// pending image update, category update function + displaying skills required

export default function EditProjectPage() {
  const router = useRouter();
  const [specificProject, setSpecificProject] = useState();
  const [formData, setFormData] = useState({});

  const [projectId, setProjectId] = useState();
  const [allCategories, setAllCategories] = useState();
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState();

  useEffect(() => {
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.projectId]);

  useEffect(() => {
    // To be refactored and shared between project page and edit project page
    if (projectId) {
      const fetchProject = async () => {
        try {
          const [projectResponse, allCategoriesResponse] = await Promise.all([
            axios.get(`http://localhost:8080/projects/${projectId}`),
            // axios.get(`http://localhost:8080/users/${creatorId}`),
            axios.get("http://localhost:8080/categories"),
          ]);

          setAllCategories(allCategoriesResponse.data);

          const [categoryResponse, skillsNeededResponse, allSkillsDB] =
            await Promise.all([
              axios.get(
                `http://localhost:8080/categories/${projectResponse.data.categoryId}`
              ),
              axios.get(
                `http://localhost:8080/requiredSkills?projectId=${projectId}`
              ),
              axios.get(`http://localhost:8080/skills`),
            ]);

          const skillArray = [];
          // console.log(skillsNeededResponse.data);

          for (const skillNeeded of skillsNeededResponse.data) {
            skillArray.push(skillNeeded.skill);
          }
          // console.log(allSkillsDB.data);
          const allSkillsArrayDB = allSkillsDB.data.map((skill) => {
            return { id: skill.id, skill: skill.skill };
          });

          console.log(skillArray);
          console.log(allSkillsArrayDB);
          setAllSkills(allSkillsArrayDB);
          setSkills(skillArray);

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

  // const handleSkillCheckboxChange = (e = {});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
          <FormGroup>
            {allSkills &&
              allSkills.map((skill) => (
                <FormControlLabel
                  key={skill.id}
                  control={
                    <Checkbox
                      checked={
                        skills &&
                        skills.map((neededSkill) => {
                          return neededSkill.id === skill.id;
                          // if (neededSkill.id === skill.id) {
                          //   console.log("yea");
                          //   return true;
                          // }
                        })
                      }
                      onChange={handleChange}
                      value={skill.id}
                    />
                  }
                  label={skill.skill}
                />
              ))}
          </FormGroup>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
