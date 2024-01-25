const app = require('./app')
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server running on the ${port}`);
})




// old way to server


// const http = require("http");
// const app = require("./app");
// const server = http.createServer(app);

// const { API_PORT } = process.env;
// const port = process.env.PORT || API_PORT;

// // server listening 
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });