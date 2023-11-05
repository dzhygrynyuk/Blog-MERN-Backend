import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(5000, (error) => {
    if(error){
        return console.log(error);
    }

    console.log(`Server running on post 5000`);
});