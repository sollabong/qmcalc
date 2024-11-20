import React, { useState } from 'react';
import './App.css';
import { minimizeExpression } from './api';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

function App() {
    const [variables, setVariables] = useState('');
    const [minterms, setMinterms] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mintermsArray = minterms.split(',').map(Number);
        const response = await minimizeExpression(variables, mintermsArray);
        setResult(response.minimizedExpression);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '30px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Quine-McCluskey kalkulátor
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Változók (pl: A,B,C,D)"
                        fullWidth
                        margin="normal"
                        value={variables}
                        onChange={(e) => setVariables(e.target.value)}
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
                    <Box textAlign="center" marginTop={2}>
                        <Button variant="contained" color="primary" type="submit">
                            Minimalizálás
                        </Button>
                    </Box>
                </Box>
                {result && (
                    <Box marginTop={4}>
                        <Typography variant="h5" gutterBottom>
                            Minimalizált kifejezés:
                        </Typography>
                        <Typography variant="body1" style={{ wordWrap: 'break-word' }}>
                            {result}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default App;