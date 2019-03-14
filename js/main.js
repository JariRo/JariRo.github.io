const setupEvents = () => {
  console.log("setting up event handelers...");
  let itemNameInput = document.querySelector("#item-name-input");
  document.querySelector("#add-item").addEventListener("click", addItem);
  itemNameInput.focus();
  itemNameInput.addEventListener("keyup", event => {
    if (event.key === "Enter") {
      addItem();
    }
  });
  itemNameInput.focus();
};

const setupToDoList = () => {
  const allItems = getStoredListItems();
  allItems.sort((itemA, itemB) => {
    const itemADate = new Date(itemA.data.creationTime),
      itemBDate = new Date(itemB.data.creationTime);
    return itemADate - itemBDate;
  });
  allItems.forEach(item => {
    createTabelRowItem(item);
  });
};

const getStoredListItems = () => {
  let fromStorage = [];
  const myStorage = window.localStorage;
  for (let i = 0, len = myStorage.length; i < len; i++) {
    fromStorage.push({
      id: myStorage.key(i),
      data: JSON.parse(myStorage.getItem(myStorage.key(i))),
    });
  }
  return fromStorage;
};

const addItem = () => {
  const suggestedItem = document.querySelector("#item-name-input");
  if (
    !(suggestedItem.value.trim() == null || suggestedItem.value.trim() === "")
  ) {
    const item = createNewItem(suggestedItem);
    createTabelRowItem(item);
    saveToStorage(item);
  }
  suggestedItem.value = "";
  return;
};

const deleteItem = id => {
  const list = document.querySelector("#todo-table");
  const listItem = document.querySelector(`#${id}`);
  list.removeChild(listItem);
};

const saveToStorage = item => {
  const myStorage = window.localStorage;
  myStorage.setItem(item.id, JSON.stringify(item.data));
};

const deleteFromStorage = id => {
  const myStorage = window.localStorage;
  myStorage.removeItem(id);
};

const createNewItem = item => {
  const itemID =
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9);
  const itemValue = item.value.trim();
  const dateTime = new Date();
  const itemObject = {
    id: itemID,
    data: {
      value: itemValue,
      finished: false,
      creationTime: dateTime.getTime(),
    },
  };
  return itemObject;
};

const createTabelRowItem = item => {
  let itemRow = createListItem(item);
  itemRow.appendChild(createCheckBox(item));
  itemRow.appendChild(createTickElement(item));
  itemRow.appendChild(createLabelElement(item));
  itemRow.appendChild(createDeleteButtonElement(item));
  document.getElementById("todo-table").appendChild(itemRow);
  setTimeout(() => {
    itemRow.className = itemRow.className + " show";
  }, 10);
};

const createListItem = item => {
  let listNode = document.createElement("LI");
  listNode.classList.add("table-row");
  listNode.id = item.id;
  listNode.dataset.finished = item.data.finished;
  return listNode;
};

const createCheckBox = item => {
  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = "checkbox" + item.id;
  checkBox.name = "check";
  checkBox.value = "";
  checkBox.checked = item.data.finished;
  checkBox.addEventListener("change", () => {
    let listRow = checkBox.parentElement;
    updateFinishedState(item, listRow);
  });
  return checkBox;
};

const createTickElement = item => {
  const tick = document.createElement("SPAN");
  return tick;
};

const createLabelElement = item => {
  let labelElement = document.createElement("LABEL");
  labelElement.htmlFor = "checkbox" + item.id;

  const textNode = document.createTextNode(item.data.value);
  labelElement.appendChild(textNode);
  return labelElement;
};

const updateFinishedState = (item, listRow) => {
  const newValue = listRow.dataset.finished === "true" ? false : true;
  listRow.dataset.finished = newValue;
  item.data.finished = newValue;
  saveToStorage(item);
};

const createDeleteButtonElement = item => {
  let buttonNode = document.createElement("BUTTON");
  const textNode = document.createTextNode("DEL");
  buttonNode.appendChild(textNode);
  buttonNode.addEventListener("click", () => {
    const listItem = document.querySelector(`#${item.id}`);
    listItem.classList.remove("show");
    setTimeout(() => {
      deleteItem(item.id);
    }, 200);
    deleteFromStorage(item.id);
  });
  return buttonNode;
};

const getAllDeleteBtn = () => {
  const btnElements = document.querySelectorAll(".delete-item");
  return btnElements;
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupEvents);
  setupToDoList();
} else {
  setupEvents;
  setupToDoList();
}
