// src/components/TodoItem.js

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTitle.trim()) return;
    axios
      .put(`http://localhost:8000/api/todos/${todo.id}/`, {
        title: editingTitle,
        completed: todo.completed,
      })
      .then((res) => {
        onUpdate(res.data);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  const toggleComplete = () => {
    axios
      .patch(`http://localhost:8000/api/todos/${todo.id}/`, {
        completed: !todo.completed,
      })
      .then((res) => {
        onUpdate(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <ListGroup.Item>
      {isEditing ? (
        // Edit mode
        <Form onSubmit={handleUpdate} inline>
            <div className="d-flex justify-content-between align-items-center">
                <Form.Control
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="mr-2"
                />
                <Button variant="success" type="submit" className="mx-1">Salvar</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </div>
        </Form>
      ) : (
        // Display mode
        <div className="d-flex justify-content-between align-items-center">
            <div className="col-10">
                <Form.Check
                    type="checkbox"
                    checked={todo.completed}
                    onChange={toggleComplete}
                    inline
                />
                <span
                    style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                >
                    {todo.title}
                </span>
            </div>
            <div className="d-flex align-items-center justify-content-between col-2">
                <Button variant="warning" size="sm" className="mr-2" onClick={() => setIsEditing(true)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(todo.id)}>Apagar</Button>
            </div>
        </div>
      )}
    </ListGroup.Item>
  );
}

export default TodoItem;