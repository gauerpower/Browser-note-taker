// Saving the <select>, <textarea>, and <button> elements as DOM nodes:
const list = document.querySelector("#list");
const currentNote = document.querySelector("#currentNote");
const newNoteButton = document.querySelector("#newNoteButton");
const deleteButton = document.querySelector("#deleteButton");

// Initializing the "notes" object as either whatever's stored in the browser's
// local stoage, OR as a new object literal with a single property.
let notes = JSON.parse(localStorage.getItem("notes")) || {"To-Do List":""};

// Loop calls the addToList() function for each property of the notes object when the page loads.
for (const text in notes) {
    addToList(text);
}

// Function that will take a string as an argument, create an <option> element, set its content
// to the string, then add the <option> as a child element of the <select>.
// Will also create an id for the <option> (so it can be queried for and deleted later).
// If <textarea> was previously hidden because note list was empty, will make it visible.
function addToList(content) {
    const option = document.createElement("option");
    option.textContent = content;
    option.id = content.replace(/[\W\s]/g, "").toLowerCase();
    list.appendChild(option);
}

// Function that will save the content of the notes object as JSON to the browser's localStorage.
function saveToStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Whenever an <option> element within the <select> is highlighted, the text in the <textarea>
// will be set as the corresponding value stored by that key in the notes object.
function changeTextAreaContent(){
    currentNote.value = notes[list.value];
}

list.addEventListener("change", changeTextAreaContent);

// Whenever the user types into the textarea, that string will be set as the value of the
// corresponding key in the notes object. It will then be saved to the brower's localStorage.
currentNote.addEventListener("input", function(){
    notes[list.value] = currentNote.value;
    saveToStorage();
})

// Creating a handler function for the new note <button> element.
// Prompt will appear for the name of the new note.
// Function will return without doing anything if nothing is typed into the prompt.
// If no property exists with that key in the notes object, bracket notation will
// create a new property with that key. Its value will be initialized as an empty string.
// addToList() will be called to create an <option> element with the new key as its text content.
// saveToStorage() will be called to save the new notes object in the brower's localStorage.
// The <select>'s value attribute will be updated to the new key, which will be the same as
// the text content of the newly created <option> element, which will highlight it in the dropdown menu.
// The <textarea>'s content will retrieve the value stored by that key in the notes object.
function addNote(){
    const newNoteName = prompt("Note Name", "");
    if (!newNoteName) {
        return;
    }
    if (!notes.hasOwnProperty(newNoteName)){
        notes[newNoteName] = "";
        addToList(newNoteName);
        saveToStorage();
    }
    list.value = newNoteName;
    currentNote.value = notes[newNoteName];
    currentNote.style.visibility = "visible";
}

// Adding the handler to the <button> as a click event listener.
newNoteButton.addEventListener("click", addNote);


// Handler function for deleting a note. Will select the note by the id of the option.
// If the final note is deleted, Object.keys(notes) will return an array of length 0,
// so notes will be reassigned to the default.
// The text area's content will be set to whatever note is selected after the deletion.
// Prompt will ask for confirmation before deleting.
function deleteNote(){
    const yesOrNo = prompt("Type 'DELETE' to confirm:")
    if (yesOrNo === "DELETE") {
        const noteToDelete = document.getElementById(list.value.replace(/[\W\s]/g, "").toLowerCase());
    noteToDelete.remove();
    delete notes[noteToDelete.value];
    if (Object.keys(notes).length === 0) {
        notes = {"To-Do List":""}
        for (const text in notes) {
            addToList(text);
        }
    }
    saveToStorage();
    changeTextAreaContent();
    alert ("Note deleted.");
    } else {
        alert("Note not deleted.")
        return;
    }   
}

// Adding the handler to the <button> as a click event listener.
deleteButton.addEventListener("click", deleteNote);
