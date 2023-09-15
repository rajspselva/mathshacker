import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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
import settings from '../config/settings.json';
// sections
import { multiplicationNumbers, clearTwoDigitAdditionsQuestions } from '../reducers/additions';
import MathsTableView from '../components/math-table-view';
import Timer from '../components/timer';
import { generatePairs, pickRandomPair } from './Utils';

export default function MultiplicationPage() {
  const [open, setOpen] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answer, setAnswer] = useState('');
  const [validAnswer, setValidAnswer] = useState(true);
  const dispatch = useDispatch();
  const { multiplications } = useSelector((state) => state.maths);
  const [openCompletionDialog, setOpenCompletionDialog] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [numberPairs, setNumberPairs] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  const [searchParams] = useSearchParams();
  const advanced = searchParams.get('advanced');

  const handleAnswerChange = (event) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === '' || regex.test(event.target.value)) {
      setAnswer(event.target.value);
      setValidAnswer(true);
    }
  };

  const handleSubmit = () => {
    if (answer !== '') {
      dispatch(
        multiplicationNumbers({
          number1: currentPair[0],
          number2: currentPair[1],
          answer,
        })
      );
      setCurrentPair(pickRandomPair(numberPairs));
      setAnswer('');
    } else {
      setValidAnswer(false);
    }
  };

  const resetNumbers = () => {
    if (advanced === 'true') {  
      setTotalQuestions(200);
      setNumberPairs(generatePairs(25));
    } else {
      setTotalQuestions(settings.totalMultiplications);
      setNumberPairs(generatePairs());
    }
  };

  useEffect(() => {
    if (numberPairs.length > 0) {
      setCurrentPair(pickRandomPair(numberPairs));
    }
  }, [numberPairs]);

  useEffect(() => {
    resetNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (advanced === 'true') {
      setTotalQuestions(200);
      setNumberPairs(generatePairs(25));
    } else {
      setTotalQuestions(settings.totalMultiplications);
      setNumberPairs(generatePairs());
    }
  }, [advanced]);

  useEffect(() => {
    if (multiplications.length === totalQuestions && totalQuestions !== 0) {
      setOpenCompletionDialog(true);
    }
  }, [multiplications, totalQuestions]);

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
        <title> Multiplications | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Multiplications
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h6" gutterBottom>
            Total Questions: {totalQuestions}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Remaining: {totalQuestions - multiplications.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Correct Anwser: {multiplications.filter((f) => f.result === true).length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Accuracy:{' '}
            {(multiplications.length !== 0
              ? (multiplications.filter((f) => f.result === true).length / multiplications.length) * 100
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
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                {currentPair.length > 0 ? currentPair[0] : 0}
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                *
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                {currentPair.length > 0 ? currentPair[1] : 0}
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
                disabled={readOnly}
                onKeyDown={onKeyPress}
                variant="outlined"
                onChange={handleAnswerChange}
              />
            </Grid>
            <Grid item md={1} paddingTop={1}>
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
        <MathsTableView datasource={multiplications.filter((f) => f.result === false)} operation="*" />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5} mb={0}>
          <Typography variant="h4" gutterBottom>
            Correct Answers
          </Typography>
        </Stack>
        <MathsTableView datasource={multiplications.filter((f) => f.result === true)} operation="*" />

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
