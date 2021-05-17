const pincodeButtonEl = document.querySelector('#button-pincode')
const districtButtonEl = document.querySelector('#button-district')
const stateDropdownEl = document.querySelector('#state-dropdown')
const districtDropdownEl = document.querySelector('#district-dropdown')
const pincodeTextboxEl = document.querySelector('#textbox-pincode')
const backButtonEl = document.querySelector('.button--back')
const formEl = document.querySelector('#form-location')


// Parse search data
const searchParamData = new URLSearchParams(location.search.substring(1))

// Parsed data 


let districtId = parseInt(searchParamData.get('district'))
let stateId = parseInt(searchParamData.get('state'))
let pincodeSelected = parseInt(searchParamData.get('pincode'))
let isTypePincode = searchParamData.get('isTypePincode') === 'true' ? true : false

let context = { district: districtId, state: stateId, pincode: pincodeSelected, isTypePincode: isTypePincode }



// Revert to homepage if request is invalid
const isRequestValid = ((context.isTypePincode && context.pincode) || (!context.isTypePincode && context.district && context.state))
if (!isRequestValid) {
    location.assign('/index.html')
}


// Create unordered list
if (context.isTypePincode) {

    //Fix nav 
    togglePincode(showPincode = true)
    createStateDropdown()
    pincodeTextboxEl.value = context.pincode


    createListByPincode(pincode = context.pincode, context)

} else {

    // Fix nav dropdown
    togglePincode(showPincode = false)
    createStateDropdown(context.state)
    createDistrictDropdown(context.state, context.district)

    createListByDistrict(context.district, context)
}

// Event listeners
pincodeButtonEl.addEventListener('click', (e) => {


    console.log(context)
    togglePincode(showPincode = true)
})

districtButtonEl.addEventListener('click', (e) => {
    togglePincode(showPincode = false)
})

backButtonEl.addEventListener('click', (e) => {
    window.history.back();
})

stateDropdownEl.addEventListener('change', (e) => {
    context.state = e.target.value
    createDistrictDropdown(e.target.value)

})

districtDropdownEl.addEventListener('change', (e) => {
    context.district = e.target.value
    context.isTypePincode = false
    createListByDistrict(e.target.value, context)

})


pincodeTextboxEl.addEventListener('input', (e) => {
    e.preventDefault();
    const updatedPin = e.target.value

    if (updatedPin !== context.pincode && String(updatedPin).length === 6) {

        context.pincode = updatedPin
        context.isTypePincode = true
        context.pincode = updatedPin
        createListByPincode(pincode = context.pincode, context)
    }

})

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

})