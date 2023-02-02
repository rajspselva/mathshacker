import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
// @mui
import {
  Grid,
  Card,
  Table,
  Stack,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
import {subtractNumbers} from "../reducers/addtions";

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'slno', label: 'Sl.No', alignRight: false },
  { id: 'number1', label: 'First Number', alignRight: false },
  { id: 'number2', label: 'Second Number', alignRight: false },
  { id: 'yourAnswer', label: 'Your Answer', alignRight: false },
  { id: 'correctAnswer', label: 'Correct Answer', alignRight: false },
  { id: 'result', label: 'Result', alignRight: false },
  { id: '' },
];

export default function SubtractionsPage() {
  
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [answer, setAnswer] = useState("")
  const [number1, setNumber1] = useState(0)
  const [number2, setNumber2] = useState(1)
  const [validAnswer, setValidAnswer] = useState(true)
  const dispatch = useDispatch();
  const {subtractions} = useSelector((state) => state.additions)

  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const handleAnswerChange = (event) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === '' || regex.test(event.target.value)) {
      setAnswer(event.target.value);
      setValidAnswer(true)
    }
  };

  const restNumbers = () => {
    setNumber1(getRandomNumber(0, 9));
    let temp = getRandomNumber(0, 9)
    while(temp > number1) {
      temp = getRandomNumber(0, 9);
    }
    setNumber2(temp);
  };

  const handleSubmit = () => {
    if (answer !== "") {
      dispatch(subtractNumbers({
        number1,
        number2,
        answer
      }))
      restNumbers();
      setAnswer("");
    } else {
      setValidAnswer(false)
    }
  }

  useEffect(() => {
    restNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("subtractions", subtractions)
  }, [subtractions])

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const onKeyPress = (e) => {
    if(e.keyCode === 13){
      handleSubmit()
    }
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subtractions.length) : 0;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Additions
          </Typography>
          <Typography variant="h4" gutterBottom>
            Remaining: {100 - subtractions.length}
          </Typography>
          <Typography variant="h4" gutterBottom>
            Correct Anwser: {subtractions.filter((f) => f.result === true).length}
          </Typography>
          <Typography variant="h4" gutterBottom>
            Accuracy: {(subtractions.length !== 0 ? subtractions.filter((f) => f.result === true).length / subtractions.length * 100 : 0).toFixed(2)}%
          </Typography>
        </Stack>
        <Card>
          <Grid container padding={3}>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                {number1}
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                -
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                {number2}
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                =
              </Typography>
            </Grid>
            <Grid item md={3}>
              <TextField error={!validAnswer}
                         inputRef={input => input && input.focus()}
                         onKeyDown={onKeyPress}
                         label="Answer"
                         helperText={!validAnswer ? "Please enter answer." : ""}
                         value={answer}
                         type="number"
                         variant="outlined"
                         onChange={handleAnswerChange} />
            </Grid>
            <Grid item md={1} paddingTop={1}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Card style={{ marginTop: 50 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={subtractions.length}
                  onRequestSort={handleRequestSort}/>
                <TableBody>
                  {subtractions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { number1, number2, correctAnswer, yourAnswer, result } = row;
                    return (
                      <TableRow key={`additon-table-row-${index}`}>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">{number1}</TableCell>
                        <TableCell align="left">{number2}</TableCell>
                        <TableCell align="left">{yourAnswer}</TableCell>
                        <TableCell align="left">{correctAnswer}</TableCell>
                        <TableCell align="left">
                          <Label color={(result?'success':'error') || 'success'}>{result ? "Correct": "Incorrect"}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={subtractions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
