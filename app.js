import Express from "express";
import dotenv from "dotenv";
import { connectDB } from "./authentication/conn.js";
import cors from "cors";
import { bookRoutes } from "./src/books.js";
import { authRoutes } from "./src/users.js";
import { reviewRoutes } from "./src/reviews.js";

dotenv.config();

const app = Express();
app.use(cors());
app.use(Express.json());

app.use("/books", bookRoutes);
app.use("/auth", authRoutes);
app.use("/reviews", reviewRoutes);

app.use(notFoundHandler);

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`port = ${port}`);
});

function notFoundHandler(req, res) {
  return res.status(404).send(`<h1>Not Found.</h1>`);
}
export default notFoundHandler;
