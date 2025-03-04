import React, { useState, useEffect } from "react";

const Home = () => {
    const [tareas, setTareas] = useState([]);
    const [inputText, setInputText] = useState("");
    const username = "Eric";

    async function createUserIfNotExists() {
        try {
            await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([]),
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getTareas() {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
            if (!response.ok) throw new Error("Error al obtener las tareas");
            const data = await response.json();
            setTareas(data.todos || []);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function addTarea(e) {
        e.preventDefault();
        if (!inputText.trim()) return;
        
        const nuevaTarea = { id: Date.now(), label: inputText, is_done: false };
        setInputText("");
        const nuevasTareas = [...tareas, nuevaTarea];
        setTareas(nuevasTareas);

        try {
            await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        "label":inputText,
                        "is_done":false
                    }
                ),
            });
            setInputText("")
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function deleteTarea(taskId) {
        const nuevasTareas = tareas.filter(tarea => tarea.id !== taskId);
        setTareas(nuevasTareas);

        try {
            await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
                method: "DELETE",
             
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function clearTareas() {
        try {
            await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
                method: "DELETE",
            });
            setTareas([]);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        createUserIfNotExists();
        getTareas();
    }, []);

    return (
        <div>
            <h1>Todo List</h1>
            <form onSubmit={addTarea}>
                <input
                    type="text"
                    placeholder="Escribe una tarea"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    required
                />
                <button type="submit">Agregar</button>
            </form>
            <ul>
                {tareas.map((tarea) => (
                    <li key={tarea.id}>
                        {tarea.label}
                        <button onClick={() => deleteTarea(tarea.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={clearTareas}>Limpiar Todas las Tareas</button>
        </div>
    );
};

export default Home;
