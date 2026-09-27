import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/items";

function ItemList() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch items from the Express API on mount
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add a new item via POST, then refresh the list
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      setTitle("");
      setDescription("");
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle completed status
  const toggleCompleted = async (item) => {
    try {
      await fetch(`${API_URL}/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !item.completed }),
      });
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="item-list">
      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">Error: {error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : items.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id} className={item.completed ? "completed" : ""}>
              <div onClick={() => toggleCompleted(item)} className="item-text">
                <strong>{item.title}</strong>
                {item.description && <p>{item.description}</p>}
              </div>
              <button onClick={() => deleteItem(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;
