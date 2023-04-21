import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { useRouter } from 'next/router';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
// import Footer from '../../components/footer';

export default function successPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(function () {
      window.location.replace('/profile/1');
    }, 5000);
  }, []);

  function handleClick() {
    router.push({
      // PENDING: need to update to actual user Id instead
      pathname: `/profile/1`
    });
  }
  return (
    <div>
      <NavBar />
      <Category />
      <Grid container>
        <Grid sx={{ margin: 'auto', marginTop: 20 }}>
          <Grid sx={{ justifyItems: 'center' }}>
            <DoneOutlineIcon sx={{ color: 'green' }} />
          </Grid>
          <br />
          Your payment was successful. <br></br>You will be redirected back to your profile page
          after 5 seconds.
          <br />
          <Button
            variant="primary"
            sx={{
              color: 'white',
              backgroundColor: '#21325E',
              marginTop: 5,
              width: '100%',
              '&:hover': {
                backgroundColor: '#21325E'
              }
            }}
            onClick={handleClick}>
            Back to My Launchpad
          </Button>
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </div>
  );
}
