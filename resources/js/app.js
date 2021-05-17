const stateDropdownEl = document.querySelector('#state-dropdown')
const districtDropdownEl = document.querySelector('#district-dropdown')
const formEl = document.querySelector('#form-location')
const pincodeButtonEl = document.querySelector('#button-pincode')
const districtButtonEl = document.querySelector('#button-district')


//Execution
createStateDropdown()

//Event listeners
stateDropdownEl.addEventListener('change', (e) => {
    createDistrictDropdown(e.target.value)
})

pincodeButtonEl.addEventListener('click', (e) => {
    togglePincode(showPincode = true)
})

districtButtonEl.addEventListener('click', (e) => {
    togglePincode(showPincode = false)
})


formEl.addEventListener("submit", function(e) {
    e.preventDefault()

    const district = e.target.elements.district.value
    const state = e.target.elements.state.value
    const pincode = e.target.elements.pincode.value
    const isTypePincode = isPincodeSelected()
    const isValid = ((pincode && isTypePincode) || (!isTypePincode && state && district))

    if (!isValid) {
        alert('Please check input')
    } else {


        const searchParams = new URLSearchParams()
        searchParams.set('district', district)
        searchParams.set('state', state)
        searchParams.set('pincode', pincode)
        searchParams.set('isTypePincode', isTypePincode)
        location.assign(`/list.html?${searchParams.toString()}`)
    }

})