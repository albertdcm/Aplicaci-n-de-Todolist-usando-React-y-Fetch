import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const API_URL = "https://playground.4geeks.com/todo/users";
const USERNAME = "webdev_todolist_user";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    createUser();
    fetchTodos();
  }, []);

  const createUser = async () => {
    try {
      await fetch(`${API_URL}/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
    } catch (error) {
      console.error("Usuario ya existe o error al crearlo.", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/${USERNAME}`);
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error("Error al obtener tareas.", error);
    }
  };

  const addTodo = async (label) => {
    if (!label.trim()) return;
    const updatedTodos = [...todos, { label, done: false }];
    await updateTodosOnServer(updatedTodos);
    setInput("");
  };

  const deleteTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    await updateTodosOnServer(updatedTodos);
  };

  const clearTodos = async () => {
    await updateTodosOnServer([]);
  };

  const updateTodosOnServer = async (updatedTodos) => {
    try {
      await fetch(`${API_URL}/${USERNAME}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodos),
      });
      fetchTodos();
    } catch (error) {
      console.error("Error al actualizar tareas.", error);
    }
  };

  return (
    <div className="todo-container">
      <h1>todos</h1>
      <div className="todo-box">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo(input)}
          />
          <button className="add-btn" onClick={() => addTodo(input)}>Add</button>
        </div>
        {todos.map((item, i) => (
          <div key={i} className="todo-item">
            {item.label}
            <button onClick={() => deleteTodo(i)}>x</button>
          </div>
        ))}
        <div className="footer">
          <small>{todos.length} item{todos.length !== 1 ? "s" : ""} left</small>
          <button className="clear-btn" onClick={clearTodos}>Clear All</button>
        </div>
      </div>
    </div>
  );
};

export default Home;