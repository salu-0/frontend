import React, { useState, useEffect } from 'react';
import '../css/Form.css';
import axios from 'axios';

//ggfgsdgf
function Form() {
    const [property, setProperty] = useState({
        title: ""
    });

    const handleChange = (e) => {
        setProperty({ ...property, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/itemInserting", property);
            alert("Property added successfully!");
            setProperty({ title: ""}); 
        } catch (error) {
            console.error("Error adding property:", error);
            alert("Failed to add property.");
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
