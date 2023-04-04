import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Typography, Button, Box, Checkbox } from "@mui/material";
import NavBar from "../../../../../components/navbar";
import Category from "../../../../../components/category";
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

// pending image update, category update function + displaying skills required

export default function EditProjectPage() {
  const router = useRouter();
  const [specificProject, setSpecificProject] = useState();
  const [formData, setFormData] = useState({});

  const [creatorId, setCreatorId] = useState();
  const [projectId, setProjectId] = useState();
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState();

  useEffect(() => {
    if (router.query.creatorId) {
      setCreatorId(router.query.creatorId);
    }
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.creatorId, router.query.projectId]);

  useEffect(() => {
    // To be refactored and shared between project page and edit project page
    const fetchProject = async () => {
      try {
        const [projectResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:8080/projects/${projectId}`),
          axios.get(`http://localhost:8080/users/${creatorId}`),
        ]);

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

        for (const skillNeeded of skillsNeededResponse.data) {
          await axios
            .get(`http://localhost:8080/skills/${skillNeeded.skillId}`)
            .then(function (response) {
              skillArray.push(response.data.skill);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        const allSkillsArrayDB = allSkillsDB.data.map((skill) => skill.skill);

        console.log(allSkillsArrayDB);
        console.log(skillArray);
        setAllSkills(allSkillsArrayDB);
        setSkills(skillArray);

        const editedProject = {
          ...projectResponse.data,
          creatorName: userResponse.data.name,
          categoryName: categoryResponse.data.name,
        };

        setSpecificProject(editedProject);

        setFormData({
          name: editedProject.name,
          location: editedProject.location,
          summary: editedProject.summary,
          details: editedProject.details,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchProject().then(console.log(specificProject));
  }, [creatorId, projectId]);

  const handleChange = (e) => {
    console.log(e.target.name);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // handle form submission logic here
  };
  return (
    <div>
      <NavBar />
      <div>
        <form onSubmit={handleSubmit}>
          <p>Project Name</p>
          <TextField
            required
            id="name"
            name="name"
            onChange={handleChange}
            // label="Project Name"
            value={formData.name}
          />
          <p>Give a brief summary of what your Rocket is about</p>
          <TextField
            id="summary"
            name="summary"
            multiline
            rows={4}
            value={formData.summary}
          />
          <p>Location</p>
          <TextField
            required
            id="location"
            name="location"
            onChange={handleChange}
            value={formData.location}
          />
          <p>Share all the details about your project here:</p>
          <TextField
            id="details"
            name="details"
            multiline
            rows={10}
            onChange={handleChange}
            value={formData.details}
          />
          <br />
          <p>Project Category</p>
          <Select onChange={handleChange}>
            <MenuItem value="">Select an option</MenuItem>
            <MenuItem value="fintech">Fintech</MenuItem>
            <MenuItem value="healthtech">Health Tech</MenuItem>
            <MenuItem value="fnb">F&B</MenuItem>
            <MenuItem value="socialmedia">Social Media</MenuItem>
            <MenuItem value="games">Games</MenuItem>
            <MenuItem value="agritech">Agritech</MenuItem>
          </Select>
          <br />
          <FormLabel component="legend">Skills</FormLabel>
          <FormGroup>
            {allSkills &&
              allSkills.map((skill, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={skills.includes(skill)}
                      onChange={handleChange}
                      name="Web Development"
                    />
                  }
                  label={skill}
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
