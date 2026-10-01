import { useEffect, useState } from "react";
import "./UpdateSecondHandBook.css";

const defaultBooks = [
  {
    id: "SH001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    condition: "Good",
    price: 15.0,
    source: "Customer donation",
    shelfLocation: "S2-A",
  },
  {
    id: "SH002",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    condition: "Very Good (VG)",
    price: 25.0,
    source: "Customer trade-in",
    shelfLocation: "S2-B",
  },
  {
    id: "SH003",
    title: "1984",
    author: "George Orwell",
    condition: "Fair",
    price: 10.0,
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

    return savedBooks ? JSON.parse(savedBooks) : defaultBooks;
  });

  const [selectedBookId, setSelectedBookId] = useState("");

  const [formData, setFormData] = useState({
    condition: "",
    price: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    localStorage.setItem("secondHandBooks", JSON.stringify(books));
  }, [books]);

  const selectedBook = books.find(
    (book) => book.id === selectedBookId
  );

  const handleBookSelection = (event) => {
    const bookId = event.target.value;

    setSelectedBookId(bookId);
    setMessage("");
    setMessageType("");

    const book = books.find((item) => item.id === bookId);

    if (book) {
      setFormData({
        condition: book.condition,
        price: book.price.toString(),
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
    setMessageType("");
  };

  const handleUpdate = () => {
    if (!selectedBookId) {
      setMessage("Please select a second-hand book.");
      setMessageType("error");
      return;
    }

    if (formData.price === "") {
      setMessage("Please enter a price.");
      setMessageType("error");
      return;
    }

    const price = Number(formData.price);

    if (Number.isNaN(price) || price < 0) {
      setMessage("Please enter a valid price.");
      setMessageType("error");
      return;
    }

    if (!conditions.includes(formData.condition)) {
      setMessage("Please select a valid book condition.");
      setMessageType("error");
      return;
    }

    setBooks((previousBooks) =>
      previousBooks.map((book) =>
        book.id === selectedBookId
          ? {
              ...book,
              condition: formData.condition,
              price: price,
            }
          : book
      )
    );

    setMessage("Second-hand book details updated successfully.");
    setMessageType("success");
  };

  return (
    <div className="update-book-container">
      <div className="update-book-card">
        <div className="update-book-header">
          <h1>Update Second-Hand Book</h1>
          <p>
            Update the price or condition of an individual second-hand book.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="book">
            Select Second-Hand Book
          </label>

          <select
            id="book"
            value={selectedBookId}
            onChange={handleBookSelection}
          >
            <option value="">Select a book</option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.id} - {book.title}
              </option>
            ))}
          </select>
        </div>

        {selectedBook && (
          <div className="book-details">
            <h2>Book Details</h2>

            <div className="details-grid">
              <div>
                <span className="detail-label">Book ID</span>
                <span>{selectedBook.id}</span>
              </div>

              <div>
                <span className="detail-label">Title</span>
                <span>{selectedBook.title}</span>
              </div>

              <div>
                <span className="detail-label">Author</span>
                <span>{selectedBook.author}</span>
              </div>

              <div>
                <span className="detail-label">Source</span>
                <span>{selectedBook.source}</span>
              </div>

              <div>
                <span className="detail-label">Shelf Location</span>
                <span>{selectedBook.shelfLocation}</span>
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="condition">
            Condition
          </label>

          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            disabled={!selectedBook}
          >
            <option value="">Select condition</option>

            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">
            Price
          </label>

          <div className="price-input">
            <span>$</span>

            <input
              id="price"
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              disabled={!selectedBook}
              placeholder="Enter price"
            />
          </div>
        </div>

        <button
          type="button"
          className="update-button"
          onClick={handleUpdate}
          disabled={!selectedBook}
        >
          Save / Update
        </button>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateSecondHandBook;