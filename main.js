let contactList = JSON.parse(localStorage.getItem("contacts")) || [];
let formEditStatus = false

const initialState = {
  name: "",
  email: "",
  phone: "",
  imgUrl: "",
};

let contactForm = {
  ...initialState,
};

let editContactForm = {
    ...initialState
}

// Вытаскиваем все инпуты в массив = [input, input, input, input]
let inputs = document.querySelectorAll("input");

let btnAdd = document.querySelector(".btn_add");

let title = document.querySelector('.contacts-title')

let contactsContainer = document.querySelector(".contact-list");
// Перебираем этот массив и навешиваем на каждый из инпутов слушатель на
// изменение значения, чтобы не делать для каждого отдельно
inputs.forEach((input) => {
  // Вытаскиваем имя инпута чтобы динамично менять одно из полей формы - contactForm
  const field = input.getAttribute("id");
  input.addEventListener("input", (event) => {
    if(formEditStatus) {
        editContactForm[field] = event.target.value;
    } else {
        contactForm[field] = event.target.value;
    }
  });
});

btnAdd.addEventListener("click", (event) => {
  event.preventDefault();

  if (
        !formEditStatus &&
        (
            !contactForm.name ||
            !contactForm.email ||
            !contactForm.phone ||
            !contactForm.imgUrl
        ) 
  ) {
    alert("Заполните все поля!!!");
    return;
  }

  if(
    (
        formEditStatus &&
        (
            !editContactForm.name ||
            !editContactForm.email ||
            !editContactForm.phone ||
            !editContactForm.imgUrl
        )
    )
  ) {
    alert("Заполните все поля!!!");
    return;
  }

  let repeatContact = false

  if(!formEditStatus) {
    repeatContact = contactList.some(
        (contact) => contact.name === contactForm.name
    )

    if (repeatContact) {
        alert("Уже есть такой контакт");
        return;
      }
  }

  submitContact();

  // После нажатия на кнопку Добавить/Изменить очищаем все поля формы в JS,возвращая в изначальное состояние
  if(formEditStatus) {
    editContactForm = {
        ...initialState
    }
  } else {
    contactForm = {
        ...initialState
      };
  }

  
  // После очищения всех значений в JS, очищаем поля в инпутах (USER INTERFACE)
  inputs.forEach((input) => {
    input.value = "";
  });
});


document.addEventListener('click', (event) => {
    const currentElement = event.target
    if(currentElement.classList.contains('btn-delete')) {
        const id = currentElement.getAttribute('id')
        deleteContact(id)
    }

    if(currentElement.classList.contains('btn-edit')) {
        const id = currentElement.getAttribute('id')
        editContact(id)
    }
})

function submitContact() {

  if(formEditStatus) {
    let editedContactList = contactList.map(contact => contact.id == editContactForm.id ? editContactForm : contact)
    contactList = editedContactList
    localStorage.setItem("contacts", JSON.stringify(contactList));
    contactsContainer.style.opacity = '1'
    title.innerText = 'Добавить контакт'
    btnAdd.innerText = 'Добавить'
    formEditStatus = false
    render()
    return 
  }

  contactList.push({ ...contactForm, id: Date.now() });
  localStorage.setItem("contacts", JSON.stringify(contactList));
  render();
}

function deleteContact(id) {
  const newContactList = contactList.filter(contact => contact.id != id)
  localStorage.setItem("contacts", JSON.stringify(newContactList));
  contactList = newContactList
  render()
}

function editContact(id) {
    contactsContainer.style.opacity = '0'
    window.scrollTo(0, 0)
    title.innerText = 'Изменить контакт'
    btnAdd.innerText = 'Изменить'
    formEditStatus = true

    // Ищем контакт который мы собираемся изменять - find возвращает контакт id которых совпадет
    const editedContact = contactList.find(contact => contact.id == id)

    editContactForm = {
        ...editedContact
    }

    Object.keys(editContactForm).forEach((field, idx) => {
        inputs[idx].value = editContactForm[field]
    })
}

function render() {
    // Чтобы наш контейнер с контактами очищался при каждом переборе -
    // это для того чтобы у нас не было дубликатов предыдущих контактов

  contactsContainer.innerHTML = "";

  contactList.forEach((contact) => {
    let cardWrapper = document.createElement("div");
    let img = document.createElement("img");
    let cardBody = document.createElement("div");
    let cardTitle = document.createElement("h5");
    let cardText = document.createElement("p");
    let cardPhone = document.createElement("p");
    let btnDelete = document.createElement("button");
    let btnEdit = document.createElement("button");

    cardWrapper.classList.add("card");
    img.classList.add("card-img-top");
    cardBody.classList.add("card-body");
    cardTitle.classList.add("card-title");
    cardText.classList.add("card-text");
    cardPhone.classList.add("card-text");
    btnDelete.classList.add("btn", "btn-primary", "btn-delete");
    btnEdit.classList.add("btn", "btn-warning", "btn-edit");

    btnDelete.setAttribute("id", contact.id);
    btnEdit.setAttribute("id", contact.id);
    img.setAttribute("src", contact.imgUrl);

    cardTitle.innerText = contact.name;
    cardText.innerText = contact.email;
    cardPhone.innerText = contact.phone;
    btnDelete.innerText = "Delete";
    btnEdit.innerText = "Edit";

    cardWrapper.style.width = "18rem";

    cardBody.append(cardTitle, cardText, cardPhone, btnDelete, btnEdit);
    cardWrapper.append(img, cardBody);
    contactsContainer.append(cardWrapper);
  });
}

render();
