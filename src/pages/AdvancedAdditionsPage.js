import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import { addTwoDigitNumbers, clearTwoDigitAdditionsQuestions } from '../reducers/additions';
import MathsTableView from '../components/math-table-view';
import Timer from '../components/timer';

export default function AdvancedAdditionsPage() {
  const [open, setOpen] = useState(null);
  const [totalQuestions] = useState(25);
  const [answer, setAnswer] = useState('');
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(1);
  const [validAnswer, setValidAnswer] = useState(true);
  const dispatch = useDispatch();
  const { twoAdditions } = useSelector((state) => state.maths);
  const [openCompletionDialog, setOpenCompletionDialog] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const handleAnswerChange = (event) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === '' || regex.test(event.target.value)) {
      setAnswer(event.target.value);
      setValidAnswer(true);
    }
  };

  const restNumbers = () => {
    const n1 = getRandomNumber(10, 99);
    const n2 = getRandomNumber(10, 99);
    setNumber1(n1);
    setNumber2(n2);
  };

  const handleSubmit = () => {
    if (answer !== '') {
      dispatch(
          addTwoDigitNumbers({
          number1,
          number2,
          answer,
        })
      );
      restNumbers();
      setAnswer('');
    } else {
      setValidAnswer(false);
    }
  };

  useEffect(() => {
    restNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (twoAdditions.length === totalQuestions) {
      setOpenCompletionDialog(true);
    }
  }, [twoAdditions, totalQuestions]);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const onKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleClose = () => {
    setOpenCompletionDialog(false);
    setReadOnly(true);
  };

  const handleRetry = () => {
    setOpenCompletionDialog(false);
    setReadOnly(false);
    dispatch(clearTwoDigitAdditionsQuestions());
  };

  return (
    <>
      <Helmet>
        <title> Two Digits Additions | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Two Digits Additions
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h6" gutterBottom>
            Total Questions: {totalQuestions}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Remaining: {totalQuestions - twoAdditions.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Correct Anwser: {twoAdditions.filter((f) => f.result === true).length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Accuracy:{' '}
            {(twoAdditions.length !== 0
              ? (twoAdditions.filter((f) => f.result === true).length / twoAdditions.length) * totalQuestions
              : 0
            ).toFixed(2)}
            %
          </Typography>
          <Typography variant="h6" gutterBottom>
            <Timer />
          </Typography>
        </Stack>
        <Card>
          <Grid container padding={3}>
            <Grid item md={2} paddingTop={1} paddingLeft={6}>
              <Typography variant="h4" gutterBottom>
                {number1}
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                +
              </Typography>
            </Grid>
          </Grid>
          <Grid container paddingLeft={3}>
            <Grid item md={2} paddingTop={1} paddingLeft={6}>
              <Typography variant="h4" gutterBottom>
                {number2}
              </Typography>
            </Grid>
          </Grid>
          <Grid container padding={2}>
            <Grid item md={3} paddingLeft={6}>
              <TextField
                error={!validAnswer}
                inputRef={(input) => input && input.focus()}
                helperText={!validAnswer ? 'Please enter answer.' : ''}
                value={answer}
                type="number"
                disabled={readOnly}
                onKeyDown={onKeyPress}
                variant="outlined"
                onChange={handleAnswerChange}
              />
            </Grid>
            <Grid item md={1} paddingTop={1} paddingLeft={3}>
              <Button type="submit" variant="contained" disabled={readOnly} onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5} mb={0}>
          <Typography variant="h4" gutterBottom>
            Incorrect Answers
          </Typography>
        </Stack>
        <MathsTableView datasource={twoAdditions.filter((f) => f.result === false)} operation="+" />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5} mb={0}>
          <Typography variant="h4" gutterBottom>
            Correct Answers
          </Typography>
        </Stack>
        <MathsTableView datasource={twoAdditions.filter((f) => f.result === true)} operation="+" />

        {openCompletionDialog ? (
          <Dialog
            open={openCompletionDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Mathshacker'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You have completed the {totalQuestions} Questions. Do you want to retry anoth {totalQuestions}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleRetry} autoFocus>
                Retry
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
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
