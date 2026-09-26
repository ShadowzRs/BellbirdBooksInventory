import { useEffect, useState } from "react";
import "./UpdateSecondHandBook.css";

const defaultBooks = [
  {
    id: "SH001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    condition: "Good",
    price: 15.00,
    source: "Customer donation",
    shelfLocation: "S2-A",
  },
  {
    id: "SH002",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    condition: "Very Good (VG)",
    price: 25.00,
    source: "Customer trade-in",
    shelfLocation: "S2-B",
  },
  {
    id: "SH003",
    title: "1984",
    author: "George Orwell",
    condition: "Fair",
    price: 10.00,
    source: "Second-hand supplier",
    shelfLocation: "S2-C",
  },
];

const conditions = [
  "As New",
  "Very Good (VG)",
  "Good",
  "Fair",
  "Reading Copy",
];

function UpdateSecondHandBook() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("secondHandBooks");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return defaultBooks;
  });

  const [selectedBookId, setSelectedBookId] = useState("");

  const [formData, setFormData] = useState({
    condition: "",
    price: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("secondHandBooks", JSON.stringify(books));
  }, [books]);

  const selectedBook = books.find(
    (book) => book.id === selectedBookId
  );

  const handleBookSelect = (event) => {
    const bookId = event.target.value;

    setSelectedBookId(bookId);
    setMessage("");

    const book = books.find((item) => item.id === bookId);

    if (book) {
      setFormData({
        condition: book.condition,
        price: book.price,
      });
    } else {
      setFormData({
        condition: "",
        price: "",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    if (!selectedBook) {
      setMessage("Please select a second-hand book.");
      return;
    }

    if (formData.price === "") {
      setMessage("Please enter a price.");
      return;
    }

    const price = Number(formData.price);

    if (Number.isNaN(price)) {
      setMessage("Price must be a valid number.");
      return;
    }

    if (price < 0) {
      setMessage("Price cannot be negative.");
      return;
    }

    if (!conditions.includes(formData.condition)) {
      setMessage("Please select a valid book condition.");
      return;
    }

    const updatedBooks = books.map((book) => {
      if (book.id === selectedBookId) {
        return {
          ...book,
          condition: formData.condition,
          price: price,
        };
      }

      return book;
    });

    setBooks(updatedBooks);

    setMessage(
      `Book "${selectedBook.title}" was updated successfully.`
    );
  };

  return (
    <div className="update-book-container">
      <div className="update-book-card">
        <h1>Update Second-Hand Book</h1>

        <p className="page-description">
          Select an individual second-hand book and update its
          condition or price.
        </p>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="book">
              Select Second-Hand Book
            </label>

            <select
              id="book"
              value={selectedBookId}
              onChange={handleBookSelect}
            >
              <option value="">
                -- Select a book --
              </option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.id} - {book.title}
                </option>
              ))}
            </select>
          </div>

          {selectedBook && (
            <>
              <div className="book-details">
                <h2>Book Details</h2>

                <div className="details-grid">
                  <div>
                    <span className="detail-label">
                      Book ID
                    </span>
                    <span>{selectedBook.id}</span>
                  </div>

                  <div>
                    <span className="detail-label">
                      Title
                    </span>
                    <span>{selectedBook.title}</span>
                  </div>

                  <div>
                    <span className="detail-label">
                      Author
                    </span>
                    <span>{selectedBook.author}</span>
                  </div>

                  <div>
                    <span className="detail-label">
                      Source
                    </span>
                    <span>{selectedBook.source}</span>
                  </div>

                  <div>
                    <span className="detail-label">
                      Shelf Location
                    </span>
                    <span>{selectedBook.shelfLocation}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="condition">
                  Condition
                </label>

                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">
                    -- Select condition --
                  </option>

                  {conditions.map((condition) => (
                    <option
                      key={condition}
                      value={condition}
                    >
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price ($)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                />
              </div>

              {message && (
                <div
                  className={
                    message.includes("successfully")
                      ? "success-message"
                      : "error-message"
                  }
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="update-button"
              >
                Save / Update
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default UpdateSecondHandBook;