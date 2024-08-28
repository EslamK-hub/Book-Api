import { Router } from "express";
import { DataTypes } from "sequelize";
import { sequelize } from "../authentication/conn.js";
import auth from "../authentication/auth.js";
import { Book } from "./books.js";
import { User } from "./users.js";

// --------------------------------- Start Model --------------------------------- //
const Review = sequelize.define("Review", {
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.belongsToMany(Book, { through: Review });
Book.belongsToMany(User, { through: Review });
// --------------------------------- End Model --------------------------------- //

// --------------------------------- Start Router --------------------------------- //
const router = Router();
router.get("/books/:id", getReview);
router.put("/books/:id", auth, addReview);
router.delete("/books/:id", auth, deleteReview);

export { router as reviewRoutes };
// --------------------------------- End Router --------------------------------- //

// --------------------------------- Start Reviews --------------------------------- //
export async function addReview(req, res) {
  try {
    const { user_id } = req.user;
    const book_id = req.params.id;
    const { comment } = req.body;
    const foundReview = await Review.findOne({
      where: { UserId: user_id, BookId: book_id },
    });
    const foundBook = await Book.findOne({ where: { id: book_id } });
    const isbn = foundBook.ISBN;

    if (foundReview) {
      await Review.update(
        { comment },
        { where: { UserId: user_id, BookId: book_id } }
      );
      return res.json(
        `The review for the book ISBN ${isbn} has been added/updated successfully.`
      );
    }

    await Review.create({ UserId: user_id, BookId: book_id, comment });
    res.json({ message: `Review added successfully!` });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}

export async function getReview(req, res) {
  try {
    const { id } = req.params;
    const bookReview = await Review.findAll({
      attributes: ["comment"],
      where: { BookId: id },
    });
    res.json(
      bookReview.length
        ? { bookReview }
        : { message: "No review found for this book" }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { user_id } = req.user;
    const { id } = req.params;
    const deletedReview = await Review.destroy({
      where: { UserId: user_id, BookId: id },
    });
    res.json(
      deletedReview
        ? { message: "Review deleted successfully!" }
        : { message: "No review found to delete!" }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}
// --------------------------------- Start Reviews --------------------------------- //
