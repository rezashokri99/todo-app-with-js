// access

// access input 
let inputTodo = document.querySelector(".input-todo");

// access save input
let saveTodo = document.querySelector(".save-todo");

// access todo container (ul tag)
let todoContainer = document.querySelector(".todo-container");

// access filter todo (select tag)
let filterTodo = document.querySelector(".filter-todos");




// listners


// listner when load page
document.addEventListener("dOMcontentloaded", loadTodo());

// listner when remove and completed todo
todoContainer.addEventListener("click", checkRemove);

// listner when choice of select (filter todos)
filterTodo.addEventListener("click", filterTodoFn);

// listner when save todo
saveTodo.addEventListener("click", saveTodoFn);


// function save todo 
function saveTodoFn(e) {

  e.preventDefault();

  // get array of local storage
  let todos = getLocal();

  // add todo to local storage
  todos.push([inputTodo.value, todos.length + 1]);
  localStorage.setItem("todos", JSON.stringify(todos));

  // build todo to for add ui
  let todo = `
    <div class="todo" data-id=${todos.length}>
        <li>${inputTodo.value}</li>
        <div class="btns-todo">
            <i class="far fa-check-square" data-id=${todos.length}></i>
            <i class="far fa-trash-alt" data-id=${todos.length}></i>
        </div>
    </div>
    `;

  // add todo to ui
  todoContainer.innerHTML += todo;

  // clear input after save todo
  inputTodo.value = "";
}

// functon get array of local storage
function getLocal() {
  // get todos 
  let todos = JSON.parse(localStorage.getItem("todos"));
  let items;
  // if todos is null
  if (todos === null) {
    items = [];
  // if todos isn't null
  } else {
    items = todos;
  }
  return items;
}


// functon adding todo when load page
function loadTodo() {

  // get array of local storage
  let todos = getLocal();

  // if todo isn't null 
  if (todos) {

    // todos loop
    todos.map((todo, index) => {
      // build todo for add to ui 
      let newtodo = `
                <div class="todo" data-id=${index + 1}>
                    <li>${todo[0]}</li>
                    <div class="btns-todo">
                        <i class="far fa-check-square" data-id=${index + 1}></i>
                        <i class="far fa-trash-alt" data-id=${index + 1}></i>
                    </div>
                </div>
            `;

      // add todo to ui
      todoContainer.innerHTML += newtodo;
    });


    let newTodos = [];
    todos.map((todo, index) => {
      newTodos.push([todo[0], index + 1]);
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }

  // get array completed of local storage
  let items = getCompletedTodoOfLocalStorage();

  // get todo of todo container
  let todoContainerChildern = [...todoContainer.children];

  // adding completed class to todo
  for (let i = 0; i < todoContainerChildern.length; i++) {

    todoContainerChildern.map((todo) => {
  
      if (todo.getAttribute("data-id") == items[i]) {
        todo.classList.add("completed");
      }

    });
  }
}


// function remove and completed todo
function checkRemove(e) {

  // get data-id of event target  
  let dataId = e.target.getAttribute("data-id");
  
  // get className of event target  
  let className = e.target.classList[1];

  // if clicked on delete todo
  if (className === "fa-trash-alt") {
    
    // get array of local storage
    let todos = getLocal();
    
    todos.map((todo) => {
      // if data-id event target == todo in todos array 
      if (dataId == todo[1]) {
        // delete that todo of todos array
        todos.splice(todo[1] - 1, 1);
      }
    });

    // add new todos after delete todo to local storge
    localStorage.setItem("todos", JSON.stringify(todos));


    // delete todo of ui
    // get all icon delete and completed
    let allTodo = document.querySelectorAll(".far");
    
    
    allTodo.forEach((item) => {
      // if data-id and className event target === data-id and className todo in todos
      if (
        dataId === item.getAttribute("data-id") &&
        className === item.classList[1]
      ) {
        item.parentElement.parentElement.remove();
      }
    });

    
    let newTodos = [];
    

    todos.map((todo, index) => {
      newTodos.push([todo[0], index + 1]);
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));



    // get array completed of local storage
    let items = getCompletedTodoOfLocalStorage();

    items.forEach((item, index) => {
      // if data-id event target === item of items completed
      if (item == e.target.getAttribute("data-id")) {
        // delete that item of items completed
        items.splice(index, 1);
      }
      // if data-id event target > item of items completed
      if (item > e.target.getAttribute("data-id")) {
        // Subtract a item of items completed
        item -= 1;

        items.splice(index, 1, item);
      }
    });

    // adding items to local storage
    localStorage.setItem("completed", JSON.stringify(items));


    // clear all todo of ui
    todoContainer.innerHTML = "";
    // load page for add todo to ui
    loadTodo();
  }

  // if clicked on completed todo
  if (className === "fa-check-square") {
    // add className completed to event target
    e.target.parentElement.parentElement.classList.add("completed");

    // get array completed of local storage
    let items = getCompletedTodoOfLocalStorage();

    let newItems;

    items.forEach((item, index) => {
      // if data-id of item === event target data-id
      if (item === Number(e.target.getAttribute("data-id"))) {
        // delete that item (not saving Repetitious clicked on todo for completed)
        items.splice(index, 1);

        // give this item to newItems
        newItems = item;
      }
    });

    // add event target to array items completed
    items.push(Number(e.target.getAttribute("data-id")));

    // if clicked on todo that has completed 
    if (newItems == Number(e.target.getAttribute("data-id"))) {
      // do uncompleted
      items.splice(items.indexOf(newItems), 1);
    }
    // add new items to local storage completed
    localStorage.setItem("completed", JSON.stringify(items));


    // clear all todo of ui
    todoContainer.innerHTML = "";
    // load page for add todo to ui
    loadTodo();
  }
}


// function filter todo (select tag)
function filterTodoFn(e) {
  // get all todos
  let todos = [...todoContainer.children];

  todos.map((todo) => {
    switch (e.target.value) {
      // if click on all option
      case "all":
        todo.style.display = "flex";

        if (todo.classList.contains("completed")) {
          todo.style.opacity = ".5";
          todo.firstElementChild.style.textDecoration = "line-through";
        }

        break;

      // if click on completed option
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
          todo.style.opacity = "1";
          todo.firstElementChild.style.textDecoration = "none";
        } else {
          todo.style.display = "none";
        }

        break;
      // if click on uncompleted option
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }

      default:
        break;
    }
  });
}


// function get array completed of local storage
function getCompletedTodoOfLocalStorage() {

  // get completed todo
  let completedTodos = JSON.parse(localStorage.getItem("completed"));
  let items;
  // if completed todo is null
  if (completedTodos === null) {
    items = [];
  // if completed todo isn't null
  } else {
    items = completedTodos;
  }
  return items;
}