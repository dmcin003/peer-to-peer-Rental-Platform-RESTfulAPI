import express from "express";
import helmet from "helmet";
import morgan from 'morgan'
import router from "./router.js";



const app = express();
const port = 8080;

//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(router);


app.listen(port, () => {
  console.log(`server listening on port:${port}`);
});
