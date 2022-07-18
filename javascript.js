const form = document.querySelector("form"),
  formFields = form.elements,
  firstName = document.getElementById("first-name"),
  lastName = document.getElementById("last-name"),
  userName = document.getElementById("user-name"),
  email = document.getElementById("email"),
  phoneNumber = document.getElementById("phone-number"),
  userPassword = document.getElementById("user-password"),
  passwordCriteria = document.getElementsByTagName("li"),
  confirmUserPassword = document.getElementById("confirm-user-password"),
  firstNameErrorField = document.querySelector(".error-first-name"),
  firstNameErrorMsg = document.querySelector(".error-msg-first-name");

let formFieldObj = {
  firstName: {
    validateAgressive: false,
  },
  lastName: {
    validateAgressive: false,
  },
  userName: {
    validateAgressive: false,
  },
  email: {
    validateAgressive: false,
  },
  phoneNumber: {
    validateAgressive: false,
  },
  userPassword: {
    validateAgressive: false,
  },
  confirmUserPassword: {
    validateAgressive: false,
  },
};

// Aggressive form validation
// Resets/ disabled when form field is valid
// No need to validate submit button and checkbox for errors
for (let i = 0; i < formFields.length - 2; i++) {
  if (formFields[i].name === "phoneNumber") {
    formFields[i].addEventListener("input", (e) => {
      if (getAgressiveValidation(e.target.name)) {
        if (!e.target.validity.valid) {
          checkForErrorType(e.target);
          setAgressiveValidation(e.target.name, true);
        } else {
          showCheckmark(e.target);
          hideErrorField(e.target);
          unHighlightField(e.target);
          setAgressiveValidation(e.target.name, false);
        }
      }
    });
  } else if (formFields[i].id === "user-password") {
    formFields[i].addEventListener("input", (e) => {
      if (getAgressiveValidation(e.target.name)) {
        if (!e.target.validity.valid) {
          checkForErrorType(e.target);
        } else {
          hideErrorField(e.target);
          unHighlightField(e.target);
          showCheckmark(e.target);
          setAgressiveValidation(e.target.name, false);
        }
      }
      // if user focuses on password field after confirming password correctly, alert the user if the passwords no longer match
      if (confirmUserPassword.value !== "") {
        checkForErrorType(confirmUserPassword);
      }

      // Will always be aggressively checked to provide visual feedback password meets requirements
      checkPasswordCriteria();
    });
  } else if (formFields[i].id === "confirm-user-password") {
    formFields[i].addEventListener("input", (e) => {
      if (getAgressiveValidation(e.target.name)) {
        checkForErrorType(e.target);
      }
    });
  } else {
    formFields[i].addEventListener("input", (e) => {
      if (getAgressiveValidation(e.target.name)) {
        if (!e.target.validity.valid) {
          checkForErrorType(e.target);
        } else {
          hideErrorField(e.target);
          unHighlightField(e.target);
          showCheckmark(e.target);
          setAgressiveValidation(e.target.name, false);
        }
      }
    });
  }
}

// Lazy form validation
// Trigger aggressive validation once out of focus
for (let i = 0; i < formFields.length - 2; i++) {
  if (formFields[i].name === "phoneNumber") {
    formFields[i].addEventListener("focusout", (e) => {
      if (!e.target.validity.valid) {
        checkForErrorType(e.target);
        setAgressiveValidation(e.target.name, true);
      } else {
        if (e.target.value === "") {
          hideCheckmark(e.target);
        } else {
          showCheckmark(e.target);
        }
        hideErrorField(e.target);
        unHighlightField(e.target);
        setAgressiveValidation(e.target.name, false);
      }
    });
  } else {
    formFields[i].addEventListener("focusout", (e) => {
      if (!e.target.validity.valid || e.target.id === "confirm-user-password") {
        checkForErrorType(e.target);
        setAgressiveValidation(e.target.name, true);
      } else {
        showCheckmark(e.target);
        hideErrorField(e.target);
        unHighlightField(e.target);
        setAgressiveValidation(e.target.name, false);
      }
    });
  }
}

// Double check input prior to sending information to server
form.addEventListener("submit", (e) => {
  // No need to check submit button and checkbox for errors
  for (let i = 0; i < formFields.length - 2; i++) {
    if (
      !formFields[i].validity.valid ||
      formFields[i].id === "confirm-user-password"
    ) {
      checkForErrorType(formFields[i]);
    } else {
      hideErrorField(formFields[i]);
      unHighlightField(formFields[i]);
    }
  }

  if (document.querySelector(".error")) {
    e.preventDefault();
  }
});

function setAgressiveValidation(formField, bool) {
  formFieldObj[formField].validateAgressive = bool;
}

function getAgressiveValidation(formField) {
  return formFieldObj[formField].validateAgressive;
}

function checkForErrorType(formField) {
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
    case checkPasswordMismatch(formField):
      getPasswordMismatchErrorMessage(formField);
      break;
    default: // Error with code if the fields not including confirm password were invalid but did not match an error type
      if (formField.id !== "confirm-user-password") {
        console.log(
          `Error: None of the error messages in the checkForErrorType function was chosen for form field ${formFieldLabel}.`
        );
      } else {
        // applies only to confirm password field. Executes when no missmatch found
        hideErrorField(formField);
        unHighlightField(formField);
        showCheckmark(formField);
        setAgressiveValidation(formField.name, false);
      }
      return;
  }

  hideCheckmark(formField);
  highlightField(formField);
  showErrorField(formField);
}

function checkPasswordCriteria() {
  checkMinPasswordLength();
  checkLowerCase();
  checkUpperCase();
  checkNumber();
  checkSpecialCharacter();
}

function checkMinPasswordLength() {
  if (userPassword.value.length > 7) {
    passwordCriteria[0].style.setProperty("--password-criteria", "green");
  } else {
    passwordCriteria[0].style.setProperty("--password-criteria", "lightgray");
  }
}

function checkLowerCase() {
  if (/[a-z]+/.test(userPassword.value)) {
    passwordCriteria[1].style.setProperty("--password-criteria", "green");
  } else {
    passwordCriteria[1].style.setProperty("--password-criteria", "lightgray");
  }
}

function checkUpperCase() {
  if (/[A-Z]+/.test(userPassword.value)) {
    passwordCriteria[2].style.setProperty("--password-criteria", "green");
  } else {
    passwordCriteria[2].style.setProperty("--password-criteria", "lightgray");
  }
}

function checkNumber() {
  if (/[\d]+/.test(userPassword.value)) {
    passwordCriteria[3].style.setProperty("--password-criteria", "green");
  } else {
    passwordCriteria[3].style.setProperty("--password-criteria", "lightgray");
  }
}

function checkSpecialCharacter() {
  if (/[#?!@$%^&*-]+/.test(userPassword.value)) {
    passwordCriteria[4].style.setProperty("--password-criteria", "green");
  } else {
    passwordCriteria[4].style.setProperty("--password-criteria", "lightgray");
  }
}

// Two separate functions to easily determine if input field border color will be
// red or black to indicate the input as invalid or valid, respectively.
function highlightField(formField) {
  if (!formField.classList.contains("error")) {
    formField.classList.toggle("error");
  }
}

function unHighlightField(formField) {
  if (formField.classList.contains("error")) {
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

// Two separate functions to easily determine if checkmark will be hidden or shown
// at certain points rather than one combine into one larger function to toggle hide
// class.
function showCheckmark(formField) {
  let checkmark = formField.nextElementSibling.nextElementSibling;

  if (checkmark.classList.contains("hide")) {
    checkmark.classList.toggle("hide");
  }
}

function hideCheckmark(formField) {
  let checkmark = formField.nextElementSibling.nextElementSibling;

  if (!checkmark.classList.contains("hide")) {
    checkmark.classList.toggle("hide");
  }
}

function checkPasswordMismatch(formField) {
  if (formField.id === "confirm-user-password") {
    if (userPassword.value !== confirmUserPassword.value) {
      return true;
    }
  }

  return false;
}

function getValueMissingErrorMessage(formField) {
  let formFieldLabel = formField.previousElementSibling.textContent
      .slice(0, -1)
      .toLowerCase(),
    formFieldErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = "Please enter ";

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
    case "confirm-user-password":
      message = "Please confirm your password.";
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
        `Error: None of the error messages in the getTooLongErrorMessage 
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

function getPasswordMismatchErrorMessage(formField) {
  let passwordErrorMessageNode = formField.nextElementSibling.lastElementChild,
    message = `The passwords don't match.`;

  passwordErrorMessageNode.textContent = message;
}
