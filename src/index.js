// #find#  #recuperaObjArray#  #alteraObjArray#
const { request, response } = require("express");
const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);
  // Se não encontrou
  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user;
  //console.log("user24;", user);

  return next();
}

// criando um usuário
app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExists = users.some((user) => user.username === username);
  // const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "Username already exists!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

// retornando json com todos os usuários
app.get("/users", (request, response) => {
  return response.json(users);
});

// retornando json com todas as tarefas de um usuário
app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

// incluindo uma tarefa a um usuário
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  // retornando um Json com a lista de tarefas de um usuário
  app.get("/todos", checksExistsUserAccount, (request, response) => {
    const { user } = request;
  });

  user.todos.push(todo);
  //console.log("******************* user:", user);

  return response.status(201).json(todo);
});

// alterar os dados de uma tarefa de um usuario
app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  // const {user} = request
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find((user) => user.username === username);
  const todos = user.todos;
  const todo = todos.find((todo) => todo.id === id);

  // const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo Not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

// alterando o status da tarefa para realizada!
app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  // const {user} = request
  const { id } = request.params;

  const user = users.find((user) => user.username === username);
  const todos = user.todos;
  const todo = todos.find((todo) => todo.id === id);

  // const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo Not found" });
  }

  todo.done = true;

  return response.json(todo);
});

// excluindo uma tarefa!
app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  // const {user} = request
  const { id } = request.params;

  const user = users.find((user) => user.username === username);
  const todos = user.todos;
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  // const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex == -1) {
    return response.status(404).json({ error: "Todo Not found" });
  }

  const todo = todos.splice(todoIndex, 1);

  // user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;
