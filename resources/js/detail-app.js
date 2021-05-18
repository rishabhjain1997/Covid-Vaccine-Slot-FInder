// Parse search data
const searchParamData = new URLSearchParams(location.search.substring(1))

// Parsed data
const districtId = parseInt(searchParamData.get('district'))
const stateId = parseInt(searchParamData.get('state'))
const pincodeSelected = parseInt(searchParamData.get('pincode'))
const isTypePincode = searchParamData.get('isTypePincode') === 'true' ? true : false
const dateSelected = moment(searchParamData.get('date'), 'DD-MM-YYYY')
const context = { district: districtId, state: stateId, pincode: pincodeSelected, isTypePincode: isTypePincode, date: dateSelected }
let filter = { date: dateSelected.format('DD-MM-YYYY') }

// Revert to homepage if request is invalid
const isRequestValid = (dateSelected.isValid() && ((isTypePincode && pincodeSelected) || (!isTypePincode && districtId && stateId)))
if (!isRequestValid) {
    location.assign('/index.html')
}

// Create unordered list
// if (isTypePincode) {
//     createDetailByPincode(context)
// } else {
//     //debugger
//     createDetailByDistrict(context)
// }

createAppointmentList(context, filter)