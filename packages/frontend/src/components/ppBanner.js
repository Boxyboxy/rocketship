import { Box, Stack } from "@mui/material";

export default function PPBanner() {
  return (
    <Box
      sx={{
        backgroundColor: "#EAEAEA",
        marginTop: 4,

        minHeight: "20vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "center", marginLeft: 5, marginRight: 5 }}
      >
        <img src="/images/ppRocket.png" width="100px" />
        RocketShip lets you bring creative projects to life.
      </Stack>
      <Stack
        direction="row"
        sx={{ alignItems: "center", marginLeft: 5, marginRight: 5 }}
      >
        <img src="/images/ppastronaut.png" width="100px" /> Contribute to
        projects and help make them better.
      </Stack>
      <Stack
        direction="row"
        sx={{ alignItems: "center", marginLeft: 5, marginRight: 5 }}
      >
        <img src="/images/ppmeeting.png" width="100px" /> Fund and own shares of
        projects you believe in.
      </Stack>
    </Box>
  );
}
