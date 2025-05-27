import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const API_BASE = "https://playground.4geeks.com/todo";
const USERNAME = "webdev_todolist_user";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    createUser();
  }, []);

  const createUser = async () => {
    try {
      await fetch(`${API_BASE}/users/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
    } catch (error) {
      console.log("Usuario ya existe o error:", error);
    } finally {
      fetchTodos();
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${USERNAME}`);
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error("Error al obtener tareas.", error);
    }
  };

  const addTodo = async (label) => {
    if (!label.trim()) return;

    const task = { label: label.trim(), done: false };

    try {
      await fetch(`${API_BASE}/todos/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
      });
      fetchTodos();
      setInput("");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const deleteTodo = async (index) => {
    const taskId = todos[index]?.id;
    if (!taskId) return;

    try {
      await fetch(`${API_BASE}/todos/${taskId}`, {
        method: "DELETE"
      });
      fetchTodos();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const clearTodos = async () => {
    try {
      await fetch(`${API_BASE}/users/${USERNAME}`, {
        method: "DELETE"
      });
      createUser(); // recrea el usuario limpio
    } catch (error) {
      console.error("Error al limpiar tareas:", error);
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                addTodo(input);
              }
            }}
          />
          <button
            className="add-btn"
            onClick={() => input.trim() && addTodo(input)}
          >
            Add
          </button>
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