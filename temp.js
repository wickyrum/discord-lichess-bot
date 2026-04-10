let eventError = undefined;
async function streamGame(gameId, accessToken) {
    const response = await fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const reader = await response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        console.log('start of the loop')
        const { done, value } = await reader.read();
        const temp = await reader.read();
        if (done) {
            console.log('Game finished');
            break;
        }
        const text = decoder.decode(value);
        if (text.trim()) {
            const event = await JSON.parse(text);
            console.log(event.error)
            eventError = event.error;
            console.log(eventError == 'No such game')
        }
    }

    console.log('hehe I am out of the loop')
    if (eventError == 'No such game') {
        setTimeout(streamGame, 17000)
        console.log('starting in 5')
    }

}
module.exports = {streamGame}
