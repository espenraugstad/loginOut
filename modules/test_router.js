const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Root endpoint');
});

router.get('/lol', (req, res)=>{
    res.send('lol-endpoint');
})

module.exports = router;