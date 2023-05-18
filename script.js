// server constants

const SERVER_DATA = [
  {
    "key": "user_name",
    "label": "Name",
    "type": "text",
    "maxLength": "10",
  },
  {
    "key": "mobile_no",
    "label": "Mobile number",
    "type": "number",
    "maxLength": "10"
  },
  {
    "key": "email",
    "label": "Email",
    "type": "email"
  }
]


/////////////////////
// local constants
const FORM_HTML = document.querySelector('form')
const FORM_FIELDS_HTML = document.querySelector('.form-fields')
const TOAST_HTML = document.querySelector('.toast-container')
const MODEL_HTML = document.querySelector('.model')
let FORM_SUBMITTED = false

///////////////
// helper functions - services

const validateEmail = ({ targetString = null }) => {
  if (targetString === null) {
    console.log('Incorrect Data provided to function')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const res = emailRegex.test(targetString)
  return res
}

const validatePhone = ({ targetString = null }) => {
  if (targetString === null) {
    console.log('Incorrect Data provided to function')
    return
  }
  const phoneRegex = /[0-9]/
  const res = phoneRegex.test(targetString)
  return res
}

const validateMaxLength = ({ targetString = null, maxLength = null }) => {
  if (targetString === null || maxLength === null) {
    console.log('Incorrect Data provided to function')
    return
  }
  const res = targetString.length <= maxLength
  return res
}

const toggleToast = ({ display = false, text = null }) => {
  if (display === true && text === null) {
    console.log('Incorrect Data provided to function')
    return
  }
  if (display) {
    TOAST_HTML.style.display = 'block'
  } else {
    TOAST_HTML.style.display = 'none'
  }
}

const toggleModal = ({ display = false, text = null }) => {
  if (display === true && text === null) {
    console.log('Incorrect Data provided to function')
    return
  }
}

const typesSpecificOperations = ({ value = null, config = null, htmlEl = null }) => {
  if (value === null || config === null || htmlEl === null) {
    console.log('Incorrect Data provided to function')
    return
  }

  // specfic operations as per types
  switch (config.type) {
    case 'email':
      const validateEmailRes = validateEmail({ targetString: value })
      if (validateEmailRes) {
        if (htmlEl.classList.contains("form-field-error")) {
          htmlEl.classList.remove('form-field-error')
          const helperTextHtml = htmlEl.parentNode.childNodes[2]
          helperTextHtml.textContent = ''
        }
      } else {
        htmlEl.classList.add('form-field-error')
        const helperTextHtml = htmlEl.parentNode.childNodes[2]
        helperTextHtml.textContent = 'Invalid Email'
        return false
      }
      break
    case 'number':
      const validatePhoneRes = validatePhone({ targetString: value })
      if (validatePhoneRes) {
        if (htmlEl.classList.contains("form-field-error")) {
          htmlEl.classList.remove('form-field-error')
          const helperTextHtml = htmlEl.parentNode.childNodes[2]
          helperTextHtml.textContent = ''
        }
      } else {
        htmlEl.classList.add('form-field-error')
        const helperTextHtml = htmlEl.parentNode.childNodes[2]
        helperTextHtml.textContent = 'Should contain only digits 0-9'
        return false
      }
      break
    case 'text':
      // no specfic task
      break
    default: console.log('Invalid type :: ', config.type)
  }
  // common operations as per type
  if (config.maxLength) {
    const validateMaxLengthRes = validateMaxLength({ maxLength: config.maxLength, targetString: value })
    if (validateMaxLengthRes) {
      if (htmlEl.classList.contains("form-field-error")) {
        htmlEl.classList.remove('form-field-error')
        const helperTextHtml = htmlEl.parentNode.childNodes[2]
        helperTextHtml.textContent = ''
      }
    } else {
      htmlEl.classList.add('form-field-error')
      const helperTextHtml = htmlEl.parentNode.childNodes[2]
      helperTextHtml.textContent = `Exceeding max limit. Limit : ${config.maxLength}`
    }
    return validateMaxLengthRes
  }

  return true
}

// helper functions - event listners

// optional 
function inputEventListner({ value = null, config = null, target = null }) {
  if (value === null || config === null || target === null) {
    console.log('Incorrect Data provided to function')
    return
  }
  if (!FORM_SUBMITTED) {
    return
  }
  typesSpecificOperations({ value, config, htmlEl: target })

}

function changeEventListner({ value = null, config = null, target = null }) {
  if (value === null || config === null || target === null) {
    console.log('Incorrect Data provided to function')
    return
  }
  typesSpecificOperations({ value, config, htmlEl: target })
}


//////

const init = () => {
  SERVER_DATA.forEach(eachField => {
    const formFieldHtml = document.createElement('div')
    formFieldHtml.classList.add('form-field')
    const formLabelHtml = document.createElement('label')
    formLabelHtml.classList.add('form-field-label')
    formLabelHtml.textContent = eachField.label
    const formInputHtml = document.createElement('input')
    formInputHtml.classList.add('form-field-input')
    eachField?.type && formInputHtml.setAttribute("type", eachField.type)
    eachField?.key && formInputHtml.setAttribute("id", eachField.key)
    eachField?.key && formInputHtml.setAttribute("name", eachField.key)
    eachField?.label && formInputHtml.setAttribute("placeholder", `Enter ${eachField.label}`)
    if (eachField.type === 'text' || eachField.type === 'number') {
      eachField?.maxLength && formInputHtml.setAttribute("maxlength", +eachField.maxLength)
    }
    const config = {
      type: eachField.type,
      maxLength: eachField?.maxLength || null
    }
    formInputHtml.addEventListener("input", e => inputEventListner({ value: e.target.value, config, target: e.target }))
    formInputHtml.addEventListener("change", e => changeEventListner({ value: e.target.value, config, target: e.target }))

    const formHelperText = document.createElement('p')
    formHelperText.classList.add('form-field-helper-text')

    formFieldHtml.append(formLabelHtml)
    formFieldHtml.append(formInputHtml)
    formFieldHtml.append(formHelperText)
    FORM_FIELDS_HTML.append(formFieldHtml)
  })

  // just to show the model effect, added the set-timeout
  setTimeout(() => {
    MODEL_HTML.style.display = 'none'
  }, 500)
}
init()

//////
// event listners
FORM_HTML.addEventListener('submit', event => {
  event.preventDefault()
  FORM_SUBMITTED = true
  for(let i = 0; i < SERVER_DATA.length; i++) {
    const formElement = FORM_HTML[`${SERVER_DATA[i].key}`]
    const val = formElement.value
    let maxLength = SERVER_DATA[i]?.maxLength || null
    const type = SERVER_DATA[i].type
    const res = typesSpecificOperations({
      value: val, config: {
        type, maxLength
      }, htmlEl: formElement
    })
    if (!res) return
  }

  toggleToast({ display: true, text: 'Form submitted successfully' })
  FORM_HTML.reset()
  FORM_SUBMITTED = false
  setTimeout(() => {
    toggleToast({ display: false })
  }, 2000)
})

///////////

