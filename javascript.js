const form = document.querySelector("form"),
  formFields = form.elements,
  firstName = document.getElementById("first-name"),
  lastName = document.getElementById("last-name"),
  userName = document.getElementById("user-name"),
  email = document.getElementById("email"),
  phoneNumber = document.getElementById("phone-number"),
  userPassword = document.getElementById("user-password"),
  passwordCriteriaElements = document.getElementsByTagName("li"),
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
      "Your password must between 8 - 48 characters long and meet the requirements below",
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
          setOptionalState(e.target);
        } else {
          setValidState(e.target);
        }
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
        setValidState(e.target);
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
          if (e.target.value === "") {
            setOptionalState(e.target);
          } else {
            setValidState(e.target);
          }
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
          setValidState(e.target);
          setAggressiveValidation(e.target.name, false);
        }
      }
      // if user changes first password field after confirming password correctly, alert the user if the passwords no longer match
      if (confirmUserPassword.value !== "") {
        checkForErrorType(confirmUserPassword);
      }

      // Will always be aggressively checked to provide visual feedback password meets requirements
      checkPasswordCriteria(e.target);
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
          setValidState(e.target);
          setAggressiveValidation(e.target.name, false);
        }
      }
    });
  },
};

const passwordCriteria = {
  checkMinPasswordLength: () => {
    return userPassword.value.length > 7;
  },
  checkLowerCase: () => {
    return /[a-z]+/.test(userPassword.value);
  },
  checkUpperCase: () => {
    return /[A-Z]+/.test(userPassword.value);
  },
  checkNumber: () => {
    return /[\d]+/.test(userPassword.value);
  },
  checkSpecialCharacter: () => {
    return /[#?!@$%^&*-]+/.test(userPassword.value);
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
    }
  }

  if (document.querySelector(".error")) {
    e.preventDefault();
  }
});

function checkPasswordCriteria() {
  Object.keys(passwordCriteria).forEach((key, idx) => {
    if (passwordCriteria[key]()) {
      passwordCriteriaElements[idx].style.setProperty(
        "--password-criteria",
        "#00dd00"
      );
    } else {
      passwordCriteriaElements[idx].style.setProperty(
        "--password-criteria",
        "#353232"
      );
    }
  });
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

function setErrorState(formField) {
  removeAsValid(formField);
  setAsError(formField);
  showErrorField(formField);
  showErrorIcon(formField);
  showIcon(formField);
}

function setValidState(formField) {
  removeAsError(formField);
  hideErrorField(formField);
  setAsValid(formField);
  showValidIcon(formField);
  showIcon(formField);
}

// only for optional entries with no input; Resets state
function setOptionalState(formField) {
  removeAsValid(formField);
  removeAsError(formField);
  hideErrorField(formField);
  hideIcon(formField);
}

function setAsError(formField) {
  if (!formField.classList.contains("error")) {
    formField.classList.toggle("error");
  }
}

function removeAsError(formField) {
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
    errorField.firstElementChild.textContent = "";
  }
}

function setAsValid(formField) {
  if (!formField.classList.contains("valid")) {
    formField.classList.toggle("valid");
  }
}

function removeAsValid(formField) {
  if (formField.classList.contains("valid")) {
    formField.classList.toggle("valid");
  }
}

function showIcon(formField) {
  let icon = formField.parentElement,
    visibility = window
      .getComputedStyle(icon, "::after")
      .getPropertyValue("visibility");

  if (visibility === "hidden") {
    icon.style.setProperty("--visibility", "visible");
  }
}

function hideIcon(formField) {
  let icon = formField.parentElement,
    visibility = window
      .getComputedStyle(icon, "::after")
      .getPropertyValue("visibility");

  if (visibility !== "hidden") {
    icon.style.setProperty("--visibility", "hidden");
  }
}

function showErrorIcon(formField) {
  let icon = formField.parentElement;

  icon.style.setProperty(
    "--icon-url",
    `url("./images/error_FILL0_wght400_GRAD0_opsz48.svg")`
  );
}

function showValidIcon(formField) {
  let icon = formField.parentElement;

  icon.style.setProperty(
    "--icon-url",
    `url("./images/check_circle_FILL0_wght400_GRAD0_opsz48-green.svg")`
  );
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
        setValidState(formField);
        setAggressiveValidation(formField.name, false);
      }
      return;
  }

  setErrorState(formField);
}

function displayErrorMessage(formField, messageType) {
  let formFieldErrorMessage =
      formField.parentElement.nextElementSibling.firstElementChild,
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
