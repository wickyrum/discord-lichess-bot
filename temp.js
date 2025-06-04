const { response } = require("express")
require('dotenv').config(); 

url = "https://lichess.org/api/import"
header = {
    'Authorization': `Bearer ${process.env.LICHESS_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded'
}
data = {
    "pgn": "d4 Nf6 c4 e6 Nf3 Be7 Nc3 O-O g3 b6 Bg2 Bb7 O-O c6 Qc2 d5 Bg5 Nbd7 cxd5 Nxd5 Bxe7 Nxe7 Ng5 Ng6 h4 Rc8 Rac1 h6 Nge4 Nxh4 gxh4 Qxh4 Ng3 f5 Qb3 Rf6 e4 f4 e5 Rg6 Nce4 fxg3 fxg3 Qe7 Nd6 Rb8 Nxb7 Rxb7 Bxc6 Rb8 Be4 Rg5 Qf3 Rf8 Qe3 Rg4 Kg2 Qh4 Bb1 Qe7 Rxf8+ Nxf8 Rf1 h5 Qd3 h4"
}
async function getDailyPuzzle() {
    const response = await fetch(url, {
        method: 'POST',
        headers: header,
        body: new URLSearchParams(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching daily puzzle:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const puzzle = await response.json();
    return puzzle;
}

getDailyPuzzle()
    .then(puzzle => {
        console.log('Daily Puzzle:', puzzle);
    })
    .catch(error => {
        console.error('Error:', error);
    });
