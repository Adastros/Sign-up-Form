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
  firstNameErrorMsg = document.querySelector(".error-msg-first-name"),
  signUpImage = document.querySelector(".form-img");

const formFieldObj = {
  firstName: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter your first name.",
    tooLongErrorMessage:
      "You have a really long first name! Please contact customer support for help.",
    patternMismatchErrorMessage:
      "Please enter a valid first name using the English alphabet.",
  },
  lastName: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter your last name.",
    tooLongErrorMessage:
      "You have a really long first name! Please contact customer support for help.",
    patternMismatchErrorMessage:
      "Please enter a valid last name using the English alphabet.",
  },
  userName: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter a username.",
    tooLongErrorMessage: "Your username must be under 30 characters.",
    tooShortErrorMessage: "Your username must be at least 6 characters long.",
    patternMismatchErrorMessage:
      "Usernames can only contain alphanumeric and space characters.",
  },
  email: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter an email.",
    tooLongErrorMessage:
      "Please enter an email address under 255 characters long.",
    patternMismatchErrorMessage:
      "Please enter a valid email address. Example: sample@gmail.com",
    typeMismatchErrorMessage:
      "Please enter a valid email address. Example: sample@gmail.com",
  },
  phoneNumber: {
    validateAggressive: false,
    patternMismatchErrorMessage:
      "Please enter a valid 10 digit US phone number.",
  },
  userPassword: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter a valid password.",
    tooLongErrorMessage: "Your password must be under 48 characters",
    tooShortErrorMessage: "Your password must be at least 8 characters long.",
    patternMismatchErrorMessage:
      "Your password must between 8 - 48 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
  },
  confirmUserPassword: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please confirm your password.",
    passwordMismatchErrorMessage: "The passwords don't match.",
  },
};

const lazyValidation = {
  phoneNumber: (formField) => {
    formField.addEventListener("focusout", (e) => {
      if (!e.target.validity.valid) {
        checkForErrorType(e.target);
        setAggressiveValidation(e.target.name, true);
      } else {
        if (e.target.value === "") {
          unHighlightValidField(e.target);
        } else {
          highlightValidField(e.target);
        }
        hideErrorField(e.target);
        unHighlightField(e.target);
        setAggressiveValidation(e.target.name, false);
      }
    });
  },
  confirmUserPassword: (formField) => {
    formField.addEventListener("focusout", (e) => {
      checkForErrorType(e.target);
      setAggressiveValidation(e.target.name, true);
    });
  },
  general: (formField) => {
    formField.addEventListener("focusout", (e) => {
      if (!e.target.validity.valid) {
        checkForErrorType(e.target);
        setAggressiveValidation(e.target.name, true);
      } else {
        highlightValidField(e.target);
        hideErrorField(e.target);
        unHighlightField(e.target);
        setAggressiveValidation(e.target.name, false);
      }
    });
  },
};

const aggressiveValidation = {
  phoneNumber: (formField) => {
    formField.addEventListener("input", (e) => {
      if (getAggressiveValidation(e.target.name)) {
        if (!e.target.validity.valid) {
          checkForErrorType(e.target);
        } else {
          highlightValidField(e.target);
          hideErrorField(e.target);
          unHighlightField(e.target);
          setAggressiveValidation(e.target.name, false);
        }
      }
    });
  },
  userPassword: (formField) => {
    formField.addEventListener("input", (e) => {
      if (getAggressiveValidation(e.target.name)) {
        if (!e.target.validity.valid) {
          checkForErrorType(e.target);
        } else {
          hideErrorField(e.target);
          unHighlightField(e.target);
          highlightValidField(e.target);
          setAggressiveValidation(e.target.name, false);
        }
      }
      // if user changes first password field after confirming password correctly, alert the user if the passwords no longer match
      if (confirmUserPassword.value !== "") {
        checkForErrorType(confirmUserPassword);
      }

      // Will always be aggressively checked to provide visual feedback password meets requirements
      checkPasswordCriteria();
    });
  },
  confirmUserPassword: (formField) => {
    formField.addEventListener("input", (e) => {
      if (getAggressiveValidation(e.target.name)) {
        checkForErrorType(e.target);
      }
    });
  },
  general: (formField) => {
    formField.addEventListener("input", (e) => {
      if (getAggressiveValidation(e.target.name)) {
        if (!e.target.validity.valid) {
          checkForErrorType(e.target);
        } else {
          hideErrorField(e.target);
          unHighlightField(e.target);
          highlightValidField(e.target);
          //showCheckmark(e.target);
          setAggressiveValidation(e.target.name, false);
        }
      }
    });
  },
};

// Aggressive form validation
// Resets/ disabled when form field is valid
// No need to validate submit button and checkbox for errors
for (let i = 0; i < formFields.length - 2; i++) {
  if (formFields[i].name === "phoneNumber") {
    aggressiveValidation.phoneNumber(formFields[i]);
  } else if (formFields[i].name === "userPassword") {
    aggressiveValidation.userPassword(formFields[i]);
  } else if (formFields[i].name === "confirmUserPassword") {
    aggressiveValidation.confirmUserPassword(formFields[i]);
  } else {
    aggressiveValidation.general(formFields[i]);
  }
}

// Lazy form validation
// Trigger aggressive validation once out of focus
for (let i = 0; i < formFields.length - 2; i++) {
  if (formFields[i].name === "phoneNumber") {
    lazyValidation.phoneNumber(formFields[i]);
  } else if (formFields[i].name === "confirmUserPassword") {
    lazyValidation.confirmUserPassword(formFields[i]);
  } else {
    lazyValidation.general(formFields[i]);
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

function setAggressiveValidation(formField, bool) {
  formFieldObj[formField].validateAggressive = bool;
}

function getAggressiveValidation(formField) {
  return formFieldObj[formField].validateAggressive;
}

/*

Field Validity Indicators

Instead of creating a toggle function, all the functions below come in pairs 
for readability purposes. 

*/

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

function showErrorField(formField) {
  let errorField = formField.parentElement.nextElementSibling;

  if (errorField.classList.contains("hide")) {
    errorField.classList.toggle("hide");
  }
}

function hideErrorField(formField) {
  let errorField = formField.parentElement.nextElementSibling;

  if (!errorField.classList.contains("hide")) {
    errorField.classList.toggle("hide");
    errorField.lastElementChild.textContent = "";
  }
}

function showCheckmark(formField) {
  let checkmark = formField.parentElement,
    visibility = window
      .getComputedStyle(checkmark, "::after")
      .getPropertyValue("visibility");

  if (visibility === "hidden") {
    checkmark.style.setProperty("--visibility", "visible");
  }
}

function hideCheckmark(formField) {
  let checkmark = formField.parentElement,
    visibility = window
      .getComputedStyle(checkmark, "::after")
      .getPropertyValue("visibility");

  if (visibility !== "hidden") {
    checkmark.style.setProperty("--visibility", "hidden");
  }
}

function highlightValidField(formField) {
  if (!formField.classList.contains("valid")) {
    formField.classList.toggle("valid");
  }

  showCheckmark(formField);
}

function unHighlightValidField(formField) {
  if (formField.classList.contains("valid")) {
    formField.classList.toggle("valid");
  }

  hideCheckmark(formField);
}

/*

Error Checking Functions

*/

function checkForErrorType(formField) {
  switch (true) {
    case formField.validity.valueMissing:
      displayErrorMessage(formField, "valueMissingErrorMessage");
      break;
    case formField.validity.tooLong:
      displayErrorMessage(formField, "tooLongErrorMessage");
      break;
    case formField.validity.tooShort:
      displayErrorMessage(formField, "tooShortErrorMessage");
      break;
    case formField.validity.patternMismatch:
      displayErrorMessage(formField, "patternMismatchErrorMessage");
      break;
    case formField.validity.typeMismatch: // applies to email field only
      displayErrorMessage(formField, "typeMismatchErrorMessage");
      break;
    case checkPasswordMismatch(formField):
      displayErrorMessage(formField, "passwordMismatchErrorMessage");
      break;
    default: // Error with code if the fields not including confirm password were invalid but did not match an error type
      if (formField.id !== "confirm-user-password") {
        console.log(
          `Error: None of the error messages in the checkForErrorType function was chosen for form field ${formField.name}.`
        );
      } else {
        // applies only to confirm password field. Executes when no mismatch found
        hideErrorField(formField);
        unHighlightField(formField);
        highlightValidField(e.target);
        setAggressiveValidation(formField.name, false);
      }
      return;
  }

  unHighlightValidField(formField);
  highlightField(formField);
  showErrorField(formField);
}

function displayErrorMessage(formField, messageType) {
  let formFieldErrorMessage =
      formField.parentElement.nextElementSibling.lastElementChild,
    errorMessage = formFieldObj[formField.name][messageType];

  if (errorMessage) {
    formFieldErrorMessage.textContent = errorMessage;
  } else {
    console.log(
      `Error: ${formField.name} does not have a corresponding ${messageType}.`
    );
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
