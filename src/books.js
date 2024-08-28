import { Router } from "express";
import { DataTypes } from "sequelize";
import { sequelize } from "../authentication/conn.js";

// --------------------------------- Start Model --------------------------------- //
const Book = sequelize.define("Book", {
  ISBN: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// --------------------------------- End Model --------------------------------- //

// --------------------------------- Start Router --------------------------------- //
const router = Router();
router.get("/", getAllBooks);
router.post("/", addBook);
router.get("/isbn", getBooksByISBN);
router.get("/title", getBooksByTitle);
router.get("/author", getBooksByAuthor);

export { Book, router as bookRoutes };
// --------------------------------- End Router --------------------------------- //

// --------------------------------- Start Books --------------------------------- //
export async function getAllBooks(req, res) {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Server Error.");
  }
}

export async function addBook(req, res) {
  try {
    const bookFound = await Book.findOne({ where: req.body });
    if (bookFound) {
      return res.json("Book Already Found.");
    }
    res.json("Book Added Successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Server Error.");
  }
}

export function getBooksByISBN(req, res) {
  const { ISBN } = req.query;
  if (!ISBN) {
    return res.json("Please provide a valid ISBN Code.");
  }

  Book.findAll({ where: { ISBN } })
    .then((booksFound) => {
      res.json(
        booksFound.length
          ? { booksFound }
          : "No book found with this ISBN Code."
      );
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json("Server Error.");
    });
}

export async function getBooksByAuthor(req, res) {
  try {
    const { author } = req.query;
    if (!author) {
      return res.json("Please provide a valid author name.");
    }
    const booksFound = await Book.findAll({ where: { author } });
    res.json(
      booksFound.length
        ? { booksFound }
        : "No book found with this author name."
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Server Error.");
  }
}

export async function getBooksByTitle(req, res) {
  try {
    const { title } = req.query;
    if (!title) {
      return res.json("Please, provide a valid title.");
    }
    const booksFound = await Book.findAll({ where: { title } });
    res.json(
      booksFound.length ? { booksFound } : "No book found with this title."
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Server Error.");
  }
}
// --------------------------------- End Books --------------------------------- //
