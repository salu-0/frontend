import React, { useState, useEffect } from 'react';
import '../css/Form.css';

//ggfgsdgf
function Form() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    // Fetch existing tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5173/itemInserting/getTasks");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Invalid response format');
            }
            setTasks(data);
        } catch (error) {
            setError("Failed to fetch tasks. Please ensure the server is running.");
            console.error("Error fetching tasks:", error);
            setTasks([]); // Reset tasks on error
        }
    };

    const addTask = async () => {
        if (task.trim()) {
            try {
                setError(null);
                const response = await fetch("http://localhost:5173/itemInserting/addTask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ task: task.trim() })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Success:", data);
                
                // Fetch updated task list instead of manually updating state
                await fetchTasks();
                setTask('');
            } catch (error) {
                setError("Failed to add task. Please ensure the server is running.");
                console.error("Error:", error);
            }
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5173/itemInserting/deleteTask/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchTasks();
        } catch (error) {
            setError("Failed to delete task");
            console.error("Error deleting task:", error);
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const response = await fetch(`http://localhost:5173/itemInserting/updateTask/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ completed: !completed })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchTasks();
        } catch (error) {
            setError("Failed to update task");
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="container">
            <h2>To-Do List</h2>
            {error && <div className="error-message">{error}</div>}
            <input 
                type="text"
                id="taskInput"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task"
            />
            <button onClick={addTask}>Insert</button>
            <ul id="taskList">
                {tasks.map((taskItem) => (
                    <li key={taskItem._id} className={taskItem.completed ? "completed" : ""}>
                        <span onClick={() => toggleComplete(taskItem._id, taskItem.completed)}>
                            {taskItem.task}
                        </span>
                        <button onClick={() => deleteTask(taskItem._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Form;
