const shoppingForm = document.querySelector(".shopping-form");
const shoppingList = document.querySelector(".shopping-list");
const inputText = document.getElementById("item_name");
const filterButtons = document.querySelectorAll(".filter-buttons button");

let isEditMode = false;

const generateId = () => {
  const generatedId = Math.floor(Math.random() * 100000);
  return generatedId;
};

const createListItem = (item) => {
  // div
  const div = document.createElement("div");
  div.className = "item-name-container d-flex gap-2 align-items-center";

  // input
  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("form-check-input");
  input.checked = item.completed;
  input.addEventListener("change", toggleCompleted);
  //span
  const span = document.createElement("span");
  span.classList.add("item-name");
  span.textContent = item.name;

  div.appendChild(input);
  div.appendChild(span);

  //i
  const deletedIcon = document.createElement("i");
  deletedIcon.className = "fs-3 bi bi-x text-danger delete-icon";
  deletedIcon.addEventListener("click", removeItem);

  const editedIcon = document.createElement("i");
  editedIcon.className = "fs-5 bi bi-pencil edit-icon";
  editedIcon.addEventListener("click", editItem);

  // div icons
  const iconsDiv = document.createElement("div");
  iconsDiv.className = "d-flex gap-2 align-items-center justify-content-center";
  iconsDiv.appendChild(editedIcon);
  iconsDiv.appendChild(deletedIcon);

  //li
  const li = document.createElement("li");
  li.className =
    "d-flex align-items-center border rounded p-3 mb-1 bg-warning-subtle justify-content-between";

  li.toggleAttribute("item-completed", item.completed);
  li.setAttribute("item-id", generateId());
  li.appendChild(div);
  li.appendChild(iconsDiv);
  return li;
};

const loadItems = () => {
  const items = [];

  shoppingList.innerHTML = "";
  for (let item of items) {
    const li = createListItem(item);
    shoppingList.appendChild(li);
  }
  shoppingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (inputText.value == "" || inputText.value.trim().length === 0) {
      showAlert("Boş bir değer ekleyemezsiniz!", "warning");
      return;
    }

    const insertedItem = {
      id: generateId(),
      name: inputText.value,
      completed: false,
    };
    if (isEditMode) {
      const itemName = document.querySelector(".item-name[isEditedMode]");
      itemName.textContent = inputText.value;
      showAlert("Eleman başarıyla güncellendi!", "primary");
      inputText.value = "";
      isEditMode = false;
      itemName.removeAttribute("isEditedMode");
      saveToLocalStorage();
    } else {
      addItem(insertedItem);
      showAlert("Eleman ekleme işlemi başarılı!", "success");
      inputText.value = "";
      saveToLocalStorage();
    }
  });

  for (let button of filterButtons) {
    button.addEventListener("click", handleFilterSelection);
  }
};

const showAlert = (message, type) => {
  const div = `
  <div id="alert-content" class="alert alert-${type} text-center" role="alert">
    ${message}
  </div>`;
  shoppingForm.insertAdjacentHTML("beforebegin", div);
  const alertContent = document.getElementById("alert-content");

  setTimeout(() => {
    alertContent.remove();
  }, 3000);
};

const addItem = (element) => {
  const li = createListItem(element);
  shoppingList.appendChild(li);
};

const editItem = (e) => {
  const parentElement = e.target.parentElement.parentElement;
  const isCompleted = parentElement.hasAttribute("item-completed");
  isCompleted ? (isEditMode = false) : (isEditMode = true);
  if (isEditMode) {
    const value = e.target.parentElement.previousSibling.lastChild.textContent;
    e.target.parentElement.previousSibling.lastChild.setAttribute(
      "isEditedMode",
      true
    );
    inputText.value = value;
    inputText.focus();
  } else {
    alert("Tamamlanmış bir görevi güncelleyemezsiniz!");
  }
};

const removeItem = (e) => {
  const deletedItem = e.target.parentElement.parentElement;
  deletedItem.remove();
  showAlert("Eleman silme işlemi başarılı!", "danger");
  saveToLocalStorage();
};
const toggleCompleted = (e) => {
  const li = e.target.parentElement.parentElement;
  li.toggleAttribute("item-completed", e.target.checked);
  updateFilteredItems();
  saveToLocalStorage();
};

const handleFilterSelection = (e) => {
  const filterBtn = e.target;

  for (let button of filterButtons) {
    button.classList.add("btn-secondary");
    button.classList.remove("btn-primary");
  }

  filterBtn.classList.add("btn-primary");
  filterBtn.classList.remove("btn-secondary");

  filterItems(filterBtn.getAttribute("item-filter"));
};

const filterItems = (filterType) => {
  const li_items = shoppingList.querySelectorAll("li");
  for (let li of li_items) {
    li.classList.remove("d-flex");
    li.classList.remove("d-none");
    const isCompleted = li.hasAttribute("item-completed");
    if (filterType == "completed") {
      li.classList.add(isCompleted ? "d-flex" : "d-none");
    } else if (filterType == "incomplete") {
      li.classList.add(isCompleted ? "d-none" : "d-flex");
    } else {
      li.classList.add("d-flex");
    }
  }
};

const updateFilteredItems = () => {
  const activeBtn = document.querySelector(".btn-primary[item-filter]");
  filterItems(activeBtn.getAttribute("item-filter"));
};

const saveToLocalStorage = () => {
  const listItems = shoppingList.querySelectorAll("li");
  const liste = [];
  for (let li of listItems) {
    const id = li.getAttribute("item-id");
    const name = li.querySelector(".item-name").textContent;
    const completed = li.hasAttribute("item-completed");
    liste.push({ id, name, completed });
  }

  localStorage.setItem("shoppingItems", JSON.stringify(liste));
};

document.addEventListener("DOMContentLoaded", loadItems());

/* <li
          class="d-flex align-items-center border rounded p-3 mb-1 bg-warning-subtle justify-content-between"
        >
          <div class="item-name-container d-flex gap-2 align-items-center">
            <input type="checkbox" class="form-check-input" />
            <span class="item-name">Peynir</span>
          </div>
          <i class="fs-3 bi bi-x text-danger delete-icon"></i>
        </li>
        <li
          class="d-flex align-items-center border rounded p-3 mb-1 bg-warning-subtle justify-content-between"
        >
          <div class="item-name-container">
            <input type="checkbox" class="form-check-input" />
            <span class="item-name">Ekmek</span>
          </div>
          <i class="fs-3 bi bi-x text-danger delete-icon"></i>
        </li>
        <li
          class="d-flex align-items-center border rounded p-3 mb-1 bg-warning-subtle justify-content-between"
        >
          <div class="item-name-container">
            <input type="checkbox" class="form-check-input" />
            <span class="item-name">Zeytin</span>
          </div>
          <i class="fs-3 bi bi-x text-danger delete-icon"></i>
        </li> */
