const API_URL = 'https://qmcalc.onrender.com/minimize';

export async function minimizeExpression(variables, minterms) {
  console.log(variables, minterms);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variables, minterms }),
  });
  return response.json();
}
