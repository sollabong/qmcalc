import React, { useState } from 'react';
import { minimizeExpression } from './api';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [numVariables, setNumVariables] = useState('');
  const [variables, setVariables] = useState([]);
  const [minterms, setMinterms] = useState('');
  const [result, setResult] = useState('');
  const [primeImplicants, setPrimeImplicants] = useState('');
  const [essentialPrimeImplicants, setEssentialPrimeImplicants] = useState('');
  const [binaryTerms, setBinaryTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    numVariables: '',
    minterms: '',
  });

  const generateVariables = (num) => {
    const variableNames = [];
    for (let i = 0; i < num; i++) {
      const charCode = 65 + i;
      variableNames.push(String.fromCharCode(charCode));
    }
    setVariables(variableNames);
  };

  const formatMinterms = (mints) =>
    mints.split(',').map((minterm) => parseInt(minterm.trim(), 10));

  const formatArray = (arr) => (Array.isArray(arr) ? arr.join(' , ') : arr);

  const resetBoxes = () => {
    setPrimeImplicants('');
    setEssentialPrimeImplicants('');
    setBinaryTerms('');
  };

  const getMinVariablesForMinterms = (mintermsArray) => {
    const maxMinterm = Math.max(...mintermsArray); // Legnagyobb minterm
    return Math.floor(Math.log2(maxMinterm)) + 1; // A szükséges változók száma
  };

  const validateInputs = () => {
    const errors = {};
    const mintermsArray = formatMinterms(minterms);

    if (
      isNaN(numVariables) ||
      numVariables <= 0 ||
      !Number.isInteger(Number(numVariables))
    ) {
      errors.numVariables = 'Csak pozitív egész számot adhatsz meg.';
    } else {
      const requiredVariables = getMinVariablesForMinterms(mintermsArray);

      if (Number(numVariables) < requiredVariables) {
        errors.numVariables = `A változók száma legalább ${requiredVariables} kell legyen, hogy az összes mintermet lefedd.`;
      }
    }

    if (!/^\d+(,\d+)*$/.test(minterms) && minterms !== '') {
      errors.minterms =
        'A mintermek formátuma a következő legyen: szám,szám,...';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNumVariablesChange = (e) => {
    const num = e.target.value;
    setNumVariables(num);
    if (num) {
      generateVariables(Number(num));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setLoading(true);
    const mintermsArray = formatMinterms(minterms);
    try {
      const data = await minimizeExpression(variables, mintermsArray);
      console.log(data);
      if (data['minimizedExpression'] === '') {
        resetBoxes();
        setResult('Nincs megoldás');
      }
      setResult(`F = ${data.result['minimizedExpression']}`);
      setPrimeImplicants(data.result['primeImplicants']);
      setEssentialPrimeImplicants(data.result['essentialPrimeImplicants']);
      setBinaryTerms(data.result['binaryTerms']);
      console.log(data);
    } catch (error) {
      console.error('Hiba:', error);
      resetBoxes();
      setResult('Hiba történt számolás közben');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="sm"
        style={{ margin: 'auto' }}
        backgroundColor={'#280d55'}
      >
        <Paper
          square={false}
          elevation={5}
          sx={{
            padding: '20px',
            marginTop: '30px',
            textAlign: 'center',
            background: 'rgba(26,34,73,0.5)',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            fontWeight={'bold'}
            color={'#94bbe9'}
          >
            QUINE-MCCLUSKEY KALKULÁTOR
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Változók száma (pl 4, ami ABCD)"
              fullWidth
              margin="normal"
              value={numVariables}
              onChange={handleNumVariablesChange}
              required
              error={!!errors.numVariables}
              helperText={errors.numVariables}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Mintermek (pl 0,1,5,7,10,14)"
              fullWidth
              margin="normal"
              value={minterms}
              onChange={(e) => setMinterms(e.target.value)}
              required
              error={!!errors.minterms}
              helperText={errors.minterms}
            />
            <Box textAlign="center" marginTop={3}>
              <Button variant="contained" type="submit" size="large">
                {result ? 'Új Minimalizálás' : 'Minimalizálás'}
              </Button>
            </Box>
          </Box>
          {loading ? (
            <Box textAlign="center" marginTop={4}>
              <CircularProgress />
              <Typography variant="h6" marginTop={2}>
                Számítás folyamatban...
              </Typography>
            </Box>
          ) : (
            result && (
              <Paper
                square={false}
                elevation={5}
                sx={{
                  padding: '30px',
                  marginTop: '50px',
                  textAlign: 'center',
                  background: '#94bbe9',
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight={'bold'}>
                  Minimalizált függvény:
                </Typography>
                <Typography
                  variant="h5"
                  fontSize={32}
                  color="rgb(26,34,73)"
                  wordWrap="break-word"
                >
                  {result}
                </Typography>
              </Paper>
            )
          )}
          {binaryTerms && (
            <Paper
              square={false}
              elevation={3}
              sx={{
                padding: '20px',
                marginTop: '30px',
                textAlign: 'center',
                background: 'rgba(26,34,73,0.5)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Bináris kifejezések:
              </Typography>
              <Typography variant="h5" color="#94bbe9">
                {formatArray(binaryTerms)}
              </Typography>
            </Paper>
          )}
          {primeImplicants && (
            <Paper
              square={false}
              elevation={3}
              sx={{
                padding: '20px',
                marginTop: '30px',
                textAlign: 'center',
                background: 'rgba(26,34,73,0.5)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Prím implikánsok:
              </Typography>
              <Typography variant="h5" color="#94bbe9">
                {formatArray(primeImplicants)}
              </Typography>
            </Paper>
          )}
          {essentialPrimeImplicants && (
            <Paper
              square={false}
              elevation={3}
              sx={{
                padding: '20px',
                marginTop: '30px',
                textAlign: 'center',
                background: 'rgba(26,34,73,0.5)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Nélkülözhetetlen prím implikánsok:
              </Typography>
              <Typography variant="h5" color="#94bbe9">
                {formatArray(essentialPrimeImplicants)}
              </Typography>
            </Paper>
          )}
        </Paper>
      </Container>
      <Container
        sx={{
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <Typography color="#94bbe9" variant="body2">
          created by
          <Typography variant="body1" color="#5f88b8" fontWeight={'bold'}>
            {' '}
            Gábor Soltész-Kéri
          </Typography>
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default App;
