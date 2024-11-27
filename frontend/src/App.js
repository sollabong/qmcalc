import React, { useState } from 'react';
import './App.css';
import { minimizeExpression } from './api';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

function App() {
    const [numVariables, setNumVariables] = useState('');  
    const [variables, setVariables] = useState([]);
    const [minterms, setMinterms] = useState('');
    const [result, setResult] = useState('');
    const [primeImplicants, setPrimeImplicants] = useState('');
    const [essentialPrimeImplicants, setEssentialPrimeImplicants] = useState('');
    const [binaryTerms, setBinaryTerms] = useState('');

    const generateVariables = (num) => {
      const variableNames = [];
      for (let i = 0; i < num; i++) {
          const charCode = 65 + i;
          variableNames.push(String.fromCharCode(charCode));
      }
      setVariables(variableNames); 
    };

    const formatMinterms = (mints) => mints.split(',').map((minterm) => parseInt(minterm.trim(), 10));

    const formatArray = (arr) => (Array.isArray(arr) ? arr.join(' , ') : arr);

    const handleNumVariablesChange = (e) => {
      const num = e.target.value;
      setNumVariables(num);
      if (num) {
          generateVariables(Number(num));
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mintermsArray = formatMinterms(minterms)
        try {
            const data = await minimizeExpression(variables, mintermsArray);
            console.log(data)
            if(data['minimizedExpression'] === '') {
                setResult('Nincs megoldás')
            }
            setResult(data.result['minimizedExpression']); 
            setPrimeImplicants(data.result['primeImplicants']);
            setEssentialPrimeImplicants(data.result['essentialPrimeImplicants']);
            setBinaryTerms(data.result['binaryTerms']);
            console.log(data)
        } catch (error) {
            console.error('Hiba:', error);
            setResult('Hiba történt számolás közben');
        }         
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '30px', marginBottom: '30px', backgroundColor: 'lightsteelblue' }}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'whitesmoke' }}>
                <Typography variant="h5" gutterBottom align="center" fontWeight={'bold'}>
                    QUINE-MCCLUSKEY KALKULÁTOR
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Változók száma (pl 4, ami ABCD)"
                        fullWidth
                        margin="normal"
                        value={numVariables}
                        onChange={handleNumVariablesChange}
                        required
                    />
                    <TextField
                        label="Mintermek (pl 0,1,5,7,10,14)"
                        fullWidth
                        margin="normal"
                        value={minterms}
                        onChange={(e) => setMinterms(e.target.value)}
                        required
                    />
                    <Box textAlign="center" marginTop={3}>
                        <Button variant="contained" color={'primary'} type="submit">
                            Minimalizálás
                        </Button>
                    </Box>
                </Box>
                {result && (
                    <Paper elevation={5} sx={{
                        marginTop: '30px',
                        textAlign: 'center',
                    }}>
                        <Box padding={'40px'} backgroundColor={'white'}>
                            <Typography variant="h5" gutterBottom fontWeight={'bold'}>
                                Minimalizált függvény:
                            </Typography>
                            <Typography variant="h6" fontSize={32} color={'primary'} style={{ wordWrap: 'break-word' }}>
                                F = {result}
                            </Typography>
                        </Box>
                    </Paper>
                )}
                {binaryTerms && (
                    <Paper sx={{
                        padding: '20px',
                        backgroundColor: 'white',
                        marginTop: '30px',
                        textAlign: 'center',
                    }}>
                        <Box>
                            <Typography variant="h5" gutterBottom>
                                Bináris kifejezések:
                            </Typography>
                            <Typography variant="h6" color={'info'}>
                                {formatArray(binaryTerms)}
                            </Typography>
                        </Box>
                    </Paper>
                )}
                {primeImplicants && (
                    <Paper sx={{
                        padding: '20px',
                        backgroundColor: 'white',
                        marginTop: '30px',
                        textAlign: 'center',
                    }}>
                        <Box>
                            <Typography variant="h5" gutterBottom>
                                Prím implikánsok:
                            </Typography>
                            <Typography variant="h6" color={'info'}>
                                {formatArray(primeImplicants)}
                            </Typography>
                        </Box>
                    </Paper>
                )}
                {essentialPrimeImplicants && (
                    <Paper sx={{
                        padding: '20px',
                        backgroundColor: 'white',
                        marginTop: '30px',
                        textAlign: 'center',
                    }}>
                        <Box>
                            <Typography variant="h5" gutterBottom>
                                Nélkülözhetetlen prím implikánsok:
                            </Typography>
                            <Typography variant="h6" color={'info'}>
                                {formatArray(essentialPrimeImplicants)}
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
}

export default App;