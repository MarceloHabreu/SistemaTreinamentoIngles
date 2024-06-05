"use strict";

const notes = document.querySelector(".notes");
const addNoteTitle = document.querySelector(".add_note_title");
const addNoteText = document.querySelector(".add_note_text");
const addNoteBtn = document.querySelector(".add_note_btn");
const deleteAllNote = document.querySelector(".delete_all_note_btn");

let noteId = 0;

function createNoteElement(title, text, id) {
    const article = document.createElement("article");
    article.classList.add("your_note");
    article.dataset.noteId = id;

    const inputTitle = document.createElement("input");
    inputTitle.classList.add("your_note_title");
    inputTitle.value = title;

    const textArea = document.createElement("textarea");
    textArea.classList.add("your_note_text");
    textArea.value = text;

    const buttons = document.createElement("div");
    buttons.classList.add("button_action");

    const deleteNote = document.createElement("img");
    deleteNote.src = "https://img.icons8.com/color/48/000000/delete-forever.png";
    deleteNote.addEventListener("click", deleteNoteHandler);

    const saveNote = document.createElement("img");
    saveNote.src = "https://img.icons8.com/color/48/000000/save--v1.png";
    saveNote.addEventListener("click", saveNoteHandler);

    buttons.appendChild(deleteNote);
    buttons.appendChild(saveNote);
    article.appendChild(inputTitle);
    article.appendChild(textArea);
    article.appendChild(buttons);

    return article;
}

function addNote() {
    const title = addNoteTitle.value.trim();
    const text = addNoteText.value.trim();

    if (title && text) {
        const noteElement = createNoteElement(title, text, noteId);
        notes.appendChild(noteElement);

        localStorage.setItem(`note-${noteId}-title`, title);
        localStorage.setItem(`note-${noteId}-text`, text);

        addNoteTitle.value = "";
        addNoteText.value = "";
        noteId++;
    } else {
        alert("Não deixe sua anotação vazia.");
    }
}

function deleteNoteHandler(event) {
    const article = event.target.closest("article");
    const id = article.dataset.noteId;

    if (confirm("Tem certeza que deseja excluir esta nota?")) {
        notes.removeChild(article);
        localStorage.removeItem(`note-${id}-title`);
        localStorage.removeItem(`note-${id}-text`);
    }
}

function saveNoteHandler(event) {
    const article = event.target.closest("article");
    const id = article.dataset.noteId;

    const inputTitle = article.querySelector(".your_note_title");
    const textArea = article.querySelector(".your_note_text");

    const title = inputTitle.value.trim();
    const text = textArea.value.trim();

    if (title && text) {
        if (confirm("Tem certeza que deseja guardar esta nota?")) {
            localStorage.setItem(`note-${id}-title`, title);
            localStorage.setItem(`note-${id}-text`, text);
        }
    } else {
        alert("Both fields are required.");
    }
}

function loadNotes() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith("note-") && key.endsWith("-title")) {
            const id = key.split("-")[1];
            const title = localStorage.getItem(`note-${id}-title`);
            const text = localStorage.getItem(`note-${id}-text`);

            const noteElement = createNoteElement(title, text, id);
            notes.appendChild(noteElement);

            noteId = Math.max(noteId, Number(id) + 1);
        }
    });
}

function deleteAllNotes() {
    if (confirm("Tem certeza que deseja excluir todas as notas?")) {
        while (notes.firstChild) {
            notes.removeChild(notes.firstChild);
        }

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("note-")) {
                localStorage.removeItem(key);
            }
        });
    }
}

addNoteBtn.addEventListener("click", addNote);
deleteAllNote.addEventListener("click", deleteAllNotes);
window.addEventListener("load", loadNotes);


window.onclick = function (event) {
    if (event.target == document.getElementById("infoModal")) {
      document.getElementById("infoModal").style.display = "none";
    }
  };
  