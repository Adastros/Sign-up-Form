const form = document.querySelector("form"),
  formFields = form.elements,
  firstName = document.getElementById("first-name"),
  LastName = document.getElementById("last-name"),
  userName = document.getElementById("user-name"),
  email = document.getElementById("email"),
  phoneNumber = document.getElementById("phone-number"),
  userPassword = document.getElementById("user-password"),
  confirmUserPassword = document.getElementById("confirm-user-password"),
  firstNameErrorField = document.querySelector(".error-first-name"),
  firstNameErrorMsg = document.querySelector(".error-msg-first-name");

/*
firstName.addEventListener("input", (e) => {
  if (firstName.validity.valid) {
    firstNameErrorMsg.textContent = "";
    console.log("hello");
  }
});
*/

form.addEventListener("submit", (e) => {
  // No need to check submit button and checkbox for errors
  for (let i = 0; i < formFields.length - 2; i++) {
    if (!formFields[i].validity.valid) {
      console.log(formFields[i]);
      checkForError(formFields[i]);
      e.preventDefault();
    } else {
      hideErrorField(formFields[i]);
      unHighlightField(formFields[i]);
    }
  }
});

function checkForError(formField) {
  switch (true) {
    case formField.validity.valueMissing:
      getValueMissingErrorMessage(formField);
      break;
    case formField.validity.tooLong:
      getTooLongErrorMessage(formField);
      break;
    case formField.validity.tooShort:
      getTooShortErrorMessage(formField);
      break;
    case formField.validity.patternMismatch:
      getPatternMismatchErrorMessage(formField);
      break;
    case formField.validity.typeMismatch: // applies to email field only
      getTypeMismatchErrorMessage(formField);
      break;
    default:
      console.log(
        "Error: A formField is invalid but none of the form error checks matched the error."
      );
      return;
  }

  highlightField(formField);
  showErrorField(formField);
}

// Two separate functions to easily determine if input field border color will be
// red or black to indicate the input as invalid or valid, respectively.
function highlightField(formField) {
    if (!formField.classList.contains('error')) {
        formField.classList.toggle("error");
    }
}

function unHighlightField(formField) {
    if (formField.classList.contains('error')) {
        formField.classList.toggle("error");
    }
}

// Two separate functions to easily determine if error field will be hidden or shown
// at certain points rather than one combine into one larger function to toggle error
// fields.
function showErrorField(formField) {
  let errorField = formField.nextElementSibling;

  if (errorField.classList.contains("hide")) {
    errorField.classList.toggle("hide");
  }
}

function hideErrorField(formField) {
  let errorField = formField.nextElementSibling;

  if (!errorField.classList.contains("hide")) {
    errorField.classList.toggle("hide");
    errorField.lastElementChild.textContent = "";
  }
}

function getValueMissingErrorMessage(formField) {
  let formFieldLabel = formField.previousElementSibling.textContent
      .slice(0, -1)
      .toLowerCase(),
    formFieldErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = "Please enter ";
  console.log(formFieldErrorMessageNode);

  switch (formField.id) {
    case "first-name":
    case "last-name":
      message += `your ${formFieldLabel}.`;
      break;
    case "user-name":
    case "user-password":
      message += `a ${formFieldLabel}.`;
      break;
    case "email":
      message += `an ${formFieldLabel} address.`;
      break;
    default:
      console.log(
        `Error: None of the error messages in the getValueMissingErrorMessage 
        function was chosen for form field ${formFieldLabel}.`
      );
      return;
  }
  formFieldErrorMessageNode.textContent = message;
}

function getTooLongErrorMessage(formField) {
  let formFieldLabel = formField.previousElementSibling.textContent
      .slice(0, -1)
      .toLowerCase(),
    formFieldErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = `Your ${formFieldLabel} `;
  console.log(formFieldErrorMessageNode);

  switch (formField.id) {
    case "first-name":
    case "last-name":
      message += "is really long! Please contact customer support for help.";
      break;
    case "user-name":
      message += " must be under 30 characters.";
      break;
    case "email":
      message += "address must be under 254 characters.";
      break;
    case "user-password":
      message += "must be under 100 characters.";
      break;
    default:
      console.log(
        `Error: None of the error messages in the getTooShortErrorMessage 
        function was chosen for form field ${formFieldLabel}.`
      );
      return;
  }
  formFieldErrorMessageNode.textContent = message;
}

function getTooShortErrorMessage(formField) {
  let formFieldLabel = formField.previousElementSibling.textContent
      .slice(0, -1)
      .toLowerCase(),
    formFieldErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = `Your ${formFieldLabel} `;
  console.log(formFieldErrorMessageNode);

  switch (formField.id) {
    case "user-name":
      message += "must be at least 6 characters long.";
      break;
    case "user-password":
      message += "must be at least 8 characters long.";
      break;
    default:
      console.log(
        `Error: None of the error messages in the getTooShortErrorMessage 
        function was chosen for form field ${formFieldLabel}.`
      );
      return;
  }
  formFieldErrorMessageNode.textContent = message;
}

function getPatternMismatchErrorMessage(formField) {
  let formFieldLabel = formField.previousElementSibling.textContent
      .slice(0, -1)
      .toLowerCase(),
    formFieldErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = "";
  console.log(formFieldErrorMessageNode);

  switch (formField.id) {
    case "first-name":
    case "last-name":
      message = `Please enter a valid ${formFieldLabel} using the English alphabet.`;
      break;
    case "user-name":
      message = `User names can only contain alphanumeric and space characters.`;
      break;
    case "phone-number":
      message = `Please enter a valid 10 digit US phone number.`;
      break;
    case "user-password":
      message = `Passwords must between 8 - 48 characters long, contain 1 
        uppercase letter, 1 lowercase letter, 1 number, and 1 special character.`;
      break;
    default:
      console.log(
        `Error: None of the error messages in the getTooShortErrorMessage 
      function was chosen for form field ${formFieldLabel}.`
      );
      return;
  }
  formFieldErrorMessageNode.textContent = message;
}

function getTypeMismatchErrorMessage(formField) {
  let formFieldErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = `Please enter a valid email address. Example: sample@gmail.com`;

  formFieldErrorMessageNode.textContent = message;
}
