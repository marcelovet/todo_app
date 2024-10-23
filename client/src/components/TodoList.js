// src/components/TodoList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import TodoItem from './TodoItem';

function TodoList() {
  // State variables
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the backend
  const fetchTodos = () => {
    axios
      .get('http://localhost:8000/api/todos/')
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => console.error(err));
  };

  // Add new todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
        alert('Por favor, insira uma tarefa.');
        return;
    };
    try {
        const res = await axios.post('http://localhost:8000/api/todos/', { title: newTodo });
        setTodos([...todos, res.data]);
        setNewTodo('');
    } catch (err) {
        console.error(err);
        alert('Falha ao adicionar tarefa.');
    }
  };

  // Delete todo
  const handleDelete = (id) => {
    if (window.confirm('Você tem certeza que deseja excluir esta tarefa?')) {
        axios
        .delete(`http://localhost:8000/api/todos/${id}/`)
        .then(() => {
            setTodos(todos.filter((todo) => todo.id !== id));
        })
        .catch((err) => console.error(err));
    }    
  };

  // Update todo in state
  const updateTodoInState = (updatedTodo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  return (
    <Container>
        <div>
            <h1 className="mt-4 mb-4 text-center">Lista de tarefas</h1>
            {/* Add new todo form */}
            <Form onSubmit={handleSubmit} className='mb-4'>
                <Form.Group as={Row}>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="Nova tarefa"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                    </Col>
                    <Col sm={2}>
                        <Button variant="primary" type="submit" block>
                            Adicionar tarefa
                        </Button>
                    </Col>
                </Form.Group>
            </Form>

            {/* Todo list */}
            <ListGroup>
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onUpdate={updateTodoInState}
                        onDelete={handleDelete}
                    />
                ))}
            </ListGroup>
        </div>
    </Container>    
  );
}

export default TodoList;