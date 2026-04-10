require('dotenv').config();
const accessToken = process.env.LICHESS_TOKEN;
const gameId = 'TbyXMN4e'
async function getG() {
    const response = await fetch(`https://lichess.org/api/board/game/stream/${gameId}`), {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }
    console.log(response)
}

console.log(process.env.LICHESS_TOKEN)
