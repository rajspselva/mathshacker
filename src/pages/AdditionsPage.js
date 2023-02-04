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
import {addNumbers} from "../reducers/addtions";

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'number1', label: 'Number 1', alignRight: false },
  { id: 'operation', label: 'Operation', alignRight: false },
  { id: 'number2', label: 'Number 2', alignRight: false },
  { id: 'correctAnswer', label: 'Correct Answer', alignRight: false },
  { id: 'yourAnswer', label: 'Your Answer', alignRight: false },
  { id: 'result', label: 'Result', alignRight: false },
  { id: '' },
];

export default function AdditionsPage() {
  
  const [open, setOpen] = useState(null);
  const [totalQuestions] = useState(100)
  const [correctPage, setCorrectPage] = useState(0);
  const [incorrectPage, setIncorrectPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [answer, setAnswer] = useState("")
  const [number1, setNumber1] = useState(0)
  const [number2, setNumber2] = useState(1)
  const [validAnswer, setValidAnswer] = useState(true)
  const dispatch = useDispatch();
  const { additions } = useSelector((state) => state.maths);

  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const handleAnswerChange = (event) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === '' || regex.test(event.target.value)) {
      setAnswer(event.target.value);
      setValidAnswer(true)
    }
  };

  const restNumbers = () => {
    const n1 = getRandomNumber(1, 9);
    const n2 = getRandomNumber(1, 9);
    const filter = additions.filter(f => f.number1 === n1 && f.number2 === n2)
    console.log('filter', filter);
    if (filter.length > 0) {
      restNumbers();
      return;
    }
    setNumber1(n1);
    setNumber2(n2);
  };

  const handleSubmit = () => {
    if (answer !== "") {
      dispatch(addNumbers({
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

  const handleChangeIncorrectPage = (event, newPage) => {
    setIncorrectPage(newPage);
  };

  const handleChangeCorrectPage = (event, newPage) => {
    setCorrectPage(newPage);
  };

  const handleChangeRowsPerCorrectPage = (event) => {
    setCorrectPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

   const handleChangeRowsPerIncorrectPage = (event) => {
     setIncorrectPage(0);
     setRowsPerPage(parseInt(event.target.value, 10));
   };

  const onKeyPress = (e) => {
    if(e.keyCode === 13){
      handleSubmit()
    }
  }

  const emptyCorrectRows = correctPage > 0 ? Math.max(0, (1 + correctPage) * rowsPerPage - additions.filter(f => f.result === true).length) : 0;
  const emptyIncorrectRows = incorrectPage > 0 ? Math.max(0, (1 + incorrectPage) * rowsPerPage - additions.filter(f => f.result === false).length) : 0;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Subtractions
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h6" gutterBottom>
            Total Questions: {totalQuestions}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Remaining: {totalQuestions - additions.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Correct Anwser: {additions.filter((f) => f.result === true).length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Accuracy:{' '}
            {(additions.length !== 0
              ? (additions.filter((f) => f.result === true).length / additions.length) * totalQuestions
              : 0
            ).toFixed(2)}
            %
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
                +
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
              <TextField
                error={!validAnswer}
                inputRef={(input) => input && input.focus()}
                label="Answer"
                helperText={!validAnswer ? 'Please enter answer.' : ''}
                value={answer}
                type="number"
                onKeyDown={onKeyPress}
                variant="outlined"
                onChange={handleAnswerChange}
              />
            </Grid>
            <Grid item md={1} paddingTop={1}>
              <Button type="submit" variant="contained" onClick={handleSubmit}>
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
                  rowCount={additions.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {additions
                    .filter((f) => f.result === false)
                    .slice(incorrectPage * rowsPerPage, incorrectPage * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { number1, number2, correctAnswer, yourAnswer, result } = row;
                      return (
                        <TableRow key={`additon-table-row-${index}`}>
                          <TableCell align="left">{number1}</TableCell>
                          <TableCell align="left">+</TableCell>
                          <TableCell align="left">{number2}</TableCell>
                          <TableCell align="left">
                            <Label color="success">{correctAnswer}</Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label color="error">{yourAnswer}</Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label color={(result ? 'success' : 'error') || 'success'}>
                              {result ? 'Correct' : 'Incorrect'}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyIncorrectRows > 0 && (
                    <TableRow style={{ height: 53 * emptyIncorrectRows }}>
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
            count={additions.filter((f) => f.result === false).length}
            rowsPerPage={rowsPerPage}
            page={incorrectPage}
            onPageChange={handleChangeIncorrectPage}
            onRowsPerPageChange={handleChangeRowsPerIncorrectPage}
          />
        </Card>

        <Card style={{ marginTop: 50 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={additions.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {additions
                    .filter((f) => f.result === true)
                    .slice(correctPage * rowsPerPage, correctPage * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { number1, number2, correctAnswer, yourAnswer, result } = row;
                      return (
                        <TableRow key={`additon-table-row-${index}`}>
                          <TableCell align="left">{number1}</TableCell>
                          <TableCell align="left">+</TableCell>
                          <TableCell align="left">{number2}</TableCell>
                          <TableCell align="left">
                            <Label color="success">{correctAnswer}</Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label color="success">{yourAnswer}</Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label color={(result ? 'success' : 'error') || 'success'}>
                              {result ? 'Correct' : 'Incorrect'}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyCorrectRows > 0 && (
                    <TableRow style={{ height: 53 * emptyCorrectRows }}>
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
            count={additions.filter((f) => f.result === true).length}
            rowsPerPage={rowsPerPage}
            page={correctPage}
            onPageChange={handleChangeCorrectPage}
            onRowsPerPageChange={handleChangeRowsPerCorrectPage}
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
