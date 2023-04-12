import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { BACKEND_URL } from "../constants/backendUrl";
import axios from "axios";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(funding) {
  return {
    fundingId: funding.id,
    projectName: funding.project.name,
    projectCategory: funding.project.category.name,
    amount: funding.amount,
    incentive: funding.incentive,
    equity: funding.equity,
    date: funding.createdAt,
  };
}

function dateConversion(dateString) {
  let newDate = new Date(dateString);
  const offset = newDate.getTimezoneOffset();
  newDate = new Date(newDate.getTime() - offset * 60 * 1000);
  return newDate.toISOString().split("T")[0];
}

export default function FundingHistory({ personalId }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [fundings, setFundings] = React.useState([
    {
      id: 1,
      amount: "10",
      projectId: 1,
      userId: 1,
      incentive: "membership",
      equity: null,
      createdAt: "2023-04-12T11:02:34.536Z",

      project: {
        id: 1,
        name: "Automated coffee order",
        categoryId: 7,
        userId: 3,
        coverImage:
          "https://images.unsplash.com/photo-1500338900354-9860a96df6ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1648&q=80",
        summary: "coffee delivery platform",
        details:
          "A coffee delivery app is a mobile application that allows customers to conveniently order and receive coffee and other related products directly to their location. Users can browse through a selection of menu items, customize their orders, and pay using the app's integrated payment system. Once an order is placed, a nearby coffee shop or delivery service receives the request and prepares the order for delivery. The app may also provide real-time tracking of the delivery status and offer various promotions or loyalty programs to incentivize frequent usage. Overall, a coffee delivery app streamlines the coffee ordering and delivery process, providing users with a quick and efficient way to get their caffeine fix.",
        bankAccountId: 2,
        status: "active",
        location: "singapore",
        githubRepoUrl: "https://github.com/deliveryhero/helm-charts",
        fundingGoal: 10000,
        createdAt: "2023-04-12T11:00:26.165Z",

        category: {
          id: 7,
          name: "Ecommerce",
          createdAt: "2023-04-12T10:59:23.566Z",
        },
      },
      user: {
        id: 1,
        name: "Eugene Ng",
        mobile: "88888888",
        email: "eugenengboxiang@gmail.com",
        linkedinUrl: "https://www.linkedin.com/in/eugenengboxiang/",
        githubUrl: "https://github.com/Boxyboxy",
        createdAt: "2023-04-12T10:59:29.090Z",
      },
    },
    {
      id: 2,
      amount: "10",
      projectId: 2,
      userId: 1,
      incentive: "equity",
      equity: "1",
      createdAt: "2023-04-12T11:02:34.536Z",

      project: {
        id: 2,
        name: "FitClub",
        categoryId: 5,
        userId: 1,
        coverImage:
          "https://images.unsplash.com/photo-1620213391117-0d169a917221?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        summary:
          "fitness tracking platform. Users can track various metrics such as steps taken, calories burned, distance traveled, and heart rate using the app's built-in sensors or by syncing with wearable fitness devices",
        details:
          "A fitness tracking app is a mobile application designed to help users monitor and improve their physical health and fitness. Users can track various metrics such as steps taken, calories burned, distance traveled, and heart rate using the app's built-in sensors or by syncing with wearable fitness devices. The app may also offer personalized workout plans, nutritional guidance, and access to a community of other fitness enthusiasts for support and motivation. Users can set goals, track progress, and receive feedback and recommendations based on their data. With a fitness tracking app, users can easily stay on top of their health and wellness goals, making it a valuable tool for anyone looking to maintain an active and healthy lifestyle..",
        bankAccountId: 1,
        status: "active",
        location: "singapore",
        githubRepoUrl: "https://github.com/deliveryhero/helm-charts",
        fundingGoal: 5000,
        createdAt: "2023-04-12T11:00:38.801Z",

        category: {
          id: 5,
          name: "Agritech",
          createdAt: "2023-04-12T10:59:23.566Z",
        },
      },
      user: {
        id: 1,
        name: "Eugene Ng",
        mobile: "88888888",
        email: "eugenengboxiang@gmail.com",
        linkedinUrl: "https://www.linkedin.com/in/eugenengboxiang/",
        githubUrl: "https://github.com/Boxyboxy",
        createdAt: "2023-04-12T10:59:29.090Z",
      },
    },
  ]);

  React.useEffect(() => {
    const fetchFundings = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/fundings?userId=${personalId}`
        );
        setFundings(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFundings();
  }, [personalId]);

  React.useEffect(() => {
    let updatedRows = fundings.map((s) => createData(s));
    console.log(updatedRows);
    setRows(updatedRows);
  }, [fundings]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row">
              Project
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              Category
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              Amount funded ($)
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              Incentive
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              Equity (%)
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.fundingId}>
              <TableCell component="th" scope="row">
                {row.projectName}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.projectCategory}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.amount}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.incentive}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.equity}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {dateConversion(row.date)}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
