const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./config/connection");
const cors = require("cors");
const bodyParser = require("body-parser").urlencoded({ extended: true });
const compression = require("compression");

// Enable GZIP compression
app.use(compression());


app.use(express.json({ limit: '100mb' })); // Increase limit for JSON
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


// Configure CORS to handle both HTTP and HTTPS
const allowedOrigins = ['http://localhost:3000','https://agacrane.com/'];

app.use(cors({
  origin: ['http://localhost:3000','https://agacrane.com'],
  credentials:true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Routes
app.use("/api", require("./routes/route"));
app.use('/',(req,res)=>{
  res.send('Welcome to the server....')
});

connectDB();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
