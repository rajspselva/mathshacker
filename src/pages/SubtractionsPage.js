import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// @mui
import {
  Grid,
  Card,
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'

// sections
import { subtractNumbers, clearSubtractionsQuestions } from '../reducers/additions'
import MathsTableView from '../components/math-table-view'
import Timer from '../components/timer'
import settings from '../config/settings.json'
import { generatePairs, pickRandomPair } from './Utils'

export default function SubtractionsPage() {
  const [totalQuestions] = useState(settings.totalSigleDigitsSums);
  const [answer, setAnswer] = useState('')
  const [validAnswer, setValidAnswer] = useState(true)
  const dispatch = useDispatch()
  const { subtractions } = useSelector((state) => state.maths)
  const [openCompletionDialog, setOpenCompletionDialog] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [numberPairs, setNumberPairs] = useState([])
  const [currentPair, setCurrentPair] = useState([])

  const handleAnswerChange = (event) => {
    const regex = /^[0-9-\b]+$/
    if (event.target.value === '' || regex.test(event.target.value)) {
      setAnswer(event.target.value)
      setValidAnswer(true)
    }
  }

  const resetNumbers = () => {
    setNumberPairs(generatePairs())
  }

   useEffect(() => {
     if (numberPairs.length > 0) {
       setCurrentPair(pickRandomPair(numberPairs))
     }
   }, [numberPairs])

  const handleSubmit = () => {
    if (answer !== '') {
      dispatch(
        subtractNumbers({
          number1: currentPair[0],
          number2: currentPair[1],
          answer,
        })
      )
      setCurrentPair(pickRandomPair(numberPairs))
      setAnswer('')
    } else {
      setValidAnswer(false)
    }
  }

  useEffect(() => {
    resetNumbers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (subtractions.length === totalQuestions) {
      setOpenCompletionDialog(true)
    }
  }, [subtractions, totalQuestions])

  const onKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit()
    }
  }

  const handleClose = () => {
    setOpenCompletionDialog(false)
    setReadOnly(true)
  }

  const handleRetry = () => {
    setOpenCompletionDialog(false)
    setReadOnly(false)
    dispatch(clearSubtractionsQuestions())
  }

  return (
    <>
      <Helmet>
        <title> Subtractions | Minimal UI </title>
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
            Remaining: {totalQuestions - subtractions.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Correct Anwser: {subtractions.filter((f) => f.result === true).length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Accuracy:{' '}
            {(subtractions.length !== 0
              ? (subtractions.filter((f) => f.result === true).length / subtractions.length) * 100
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
                {currentPair[0]}
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                -
              </Typography>
            </Grid>
            <Grid item md={2} paddingTop={1}>
              <Typography variant="h4" gutterBottom>
                {currentPair[1]}
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
              <Button type="submit" disabled={readOnly} variant="contained" onClick={handleSubmit}>
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
        <MathsTableView datasource={subtractions.filter((f) => f.result === false)} operation="-" />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5} mb={0}>
          <Typography variant="h4" gutterBottom>
            Correct Answers
          </Typography>
        </Stack>
        <MathsTableView datasource={subtractions.filter((f) => f.result === true)} operation="-" />
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
    </>
  )
}
