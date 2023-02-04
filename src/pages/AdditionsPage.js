import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
// @mui
import {
  Grid,
  Card,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  TextField,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {addNumbers} from "../reducers/addtions";
import MathsTableView from "../components/math-table-view";
import Timer from "../components/timer";

export default function AdditionsPage() {
  
  const [open, setOpen] = useState(null);
  const [totalQuestions] = useState(100)
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

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const onKeyPress = (e) => {
    if(e.keyCode === 13){
      handleSubmit()
    }
  }

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
          <Typography variant="h6" gutterBottom>
            <Timer/>
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
        <MathsTableView datasource={additions.filter(f => f.result === false)} operation="+"/>
        <MathsTableView datasource={additions.filter(f => f.result === true)} operation="+"/>
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
