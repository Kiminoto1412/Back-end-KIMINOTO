const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const notFoundMiddleware = require("./middlewares/notFound");
const errorMiddleware = require("./middlewares/error");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const authRouter = require("./routes/authRoutes");
const customerAuthenticate = require('./middlewares/customerAuthenticate');
const adminAuthenticate = require('./middlewares/adminAuthenticate');

const customerRouter = require('./routes/customer/customerRoute')
const adminRouter = require('./routes/customer/customerRoute')
// ----------------------------- Sync to create database -----------------------------
// const { sequelize } = require('./models/index');
// sequelize.sync({ force: true });
// ----------------------------- Sync to create database -----------------------------



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//customer + admin
app.use("/auth", authRouter);

//customer
app.use("/customers", customerAuthenticate, customerRouter);
//admin
app.use("/admins", adminAuthenticate, adminRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => console.log(`\n\n\nRunning port ${port}`));
