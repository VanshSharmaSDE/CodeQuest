import React, { useState, useEffect } from 'react';
import './Todo.css'; // Import your CSS file

const Todo = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem('data');
        if (savedData) {
            setTasks(JSON.parse(savedData));
        }
    }, []);

    const addTask = () => {
        const inputBox = document.getElementById("input-box");
        if (inputBox.value === '') {
            alert("You must write something!");
            return;
        }
        const newTask = {
            id: Date.now(),
            text: inputBox.value,
            completed: false,
        };
        setTasks([...tasks, newTask]);
        inputBox.value = '';
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(tasks));
    }, [tasks]);

    return (
        <div className="todo-app">
            <div className="app-title">
                <h2>Tasks <i className="ri-todo-line"></i></h2>
                <i className="fa-solid fa-book-bookmark"></i>
            </div>
            <div className="row">
                <input type="text" id="input-box" placeholder="Add your tasks" />
                <button onClick={addTask}>Add</button>
            </div>
            <ul id="list-container">
                {tasks.map(task => (
                    <li
                        key={task.id}
                        className={task.completed ? 'checked' : ''}
                        onClick={() => toggleTask(task.id)}
                    >
                        {task.text}
                        <span onClick={(e) => {
                            e.stopPropagation(); // Prevent the event from bubbling up to the `li`
                            deleteTask(task.id);
                        }}>
                            <i className="ri-close-circle-line"></i>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
