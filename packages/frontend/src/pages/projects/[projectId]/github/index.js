import Head from 'next/head';
import { useState, useEffect } from 'react';
import NavBar from '../../../../components/navbar';
import Category from '../../../../components/category';
import Footer from '../../../../components/footer';
import GitHub from '../../../../components/GitHub';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

export default function Github({ project }) {
  const router = useRouter();
  const [creatorId, setCreatorId] = useState();
  const [projectId, setProjectId] = useState();
  const [specificProject, setSpecificProject] = useState();
  const { user, isLoading, error, getAccessTokenSilently, isAuthenticated } = useUser();

  useEffect(() => {
    if (router.query.creatorId) {
      setCreatorId(router.query.creatorId);
    }
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.creatorId, router.query.projectId]);

  useEffect(() => {
    if (projectId && creatorId) {
      const fetchProject = async () => {
        try {
          const [projectResponse, userResponse] = await Promise.all([
            axios.get(`${config.apiUrl}/projects/${projectId}`),
            axios.get(`${config.apiUrl}/users/${creatorId}`)
          ]);

          const [categoryResponse] = await Promise.all([
            axios.get(`${config.apiUrl}/categories/${projectResponse.data.categoryId}`),
            axios.get(`${config.apiUrl}/requiredSkills?projectId=${projectId}`)
          ]);

          const editedProject = {
            ...projectResponse.data,
            creatorName: userResponse.data.name,
            categoryName: categoryResponse.data.name
          };

          setSpecificProject(editedProject);
        } catch (err) {
          console.log(err);
        }
      };
      fetchProject().then(console.log(specificProject));
    }
  }, [creatorId, projectId]);

  useEffect(() => {
    console.log(specificProject);
  }, [specificProject]);

  return (
    <div>
      <NavBar />
      <Category />
      <GitHub project={specificProject} />
      <Footer />
    </div>
  );
}
