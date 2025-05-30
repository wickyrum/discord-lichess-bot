const express = require('express')
const { exec } = require('child_process')  
const app = express()
const port = process.env.PORT || 4000 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// New route to run your script
app.get('/run-tournament', (req, res) => {
  exec('node create-tournament.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`)
      return res.status(500).send('Failed to run tournament script')
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`)
    }
    console.log(`Script output: ${stdout}`)
    res.send('Tournament script executed!')
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
