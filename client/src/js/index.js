// Import JS files
import './form';
import { toggleForm, clearForm } from './form';
import { initDb, getDb, postDb, deleteDb, editDb } from './database';
import { fetchCards } from './cards';

// Import CSS files
import '../css/index.css';
import { Tooltip, Toast, Popover } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images
import Logo from '../images/logo.png';
import Bear from '../images/bear.png';
import Dog from '../images/dog.png';

if ('serviceworker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}

// Add images on load
window.addEventListener('load', function () {
  initDb();
  fetchCards();
  document.getElementById('logo').src = Logo;
  document.getElementById('bearThumbnail').src = Bear;
  document.getElementById('dogThumbnail').src = Dog;
});

// Form functionality
const form = document.getElementById('formToggle');
const newContactButton = document.getElementById('new-contact');
let submitBtnToUpdate = false;
let profileId;

newContactButton.addEventListener('click', (event) => {
  toggleForm();
});

form.addEventListener('submit', (event) => {
  // Handle data
  event.preventDefault();
  let name = document.getElementById('name').value;
  let phone = document.getElementById('phone').value;
  let email = document.getElementById('email').value;
  let profile = document.querySelector('input[type="radio"]:checked').value;

  // Post form data to IndexedDB OR Edit an existing card in IndexedDB
  if (submitBtnToUpdate == false) {
    postDb(name, email, phone, profile);
  } else {
    // Obtains values passed into the form element
    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let profile = document.querySelector('input[type="radio"]:checked').value;

    // Calls the editDB function passing in any values from the form element as well as the ID of the contact that we are updating
    editDb(profileId, name, email, phone, profile);

    fetchCards();

    // Toggles the submit button back to POST functionality
    submitBtnToUpdate = false;
  }

  // Clear form
  clearForm();
  // Toggle form
  toggleForm();
  // Reload the DOM
  fetchCards();
});

window.deleteCard = (e) => {
  let id = parseInt(e.id);
  deleteDb(id);
  fetchCards();
};

window.editCard = (e) => {
  profileId = parseInt(e.dataset.id);
  let editName = e.dataset.name;
  let editEmail = e.dataset.email;
  let editPhone = e.dataset.phone;

  document.getElementById('name').value = editName;
  document.getElementById('email').value = editEmail;
  document.getElementById('phone').value = editPhone;

  // toggleForm();
  form.style.display = 'block';

  submitBtnToUpdate = true;
};
