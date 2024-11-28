const API_URL = 'https://damp-fjord-13483-1b47971e65ca.herokuapp.com//minimize';

export async function minimizeExpression(variables, minterms) {
    console.log(variables, minterms);
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables, minterms }),
    });
    return response.json();
}