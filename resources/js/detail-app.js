// Parse search data
const searchParamData = new URLSearchParams(location.search.substring(1))

// Parsed data
const districtId = parseInt(searchParamData.get('district'))
const stateId = parseInt(searchParamData.get('state'))
const pincodeSelected = parseInt(searchParamData.get('pincode'))
const isTypePincode = searchParamData.get('isTypePincode') === 'true' ? true : false
let context = { district: districtId, state: stateId, pincode: pincodeSelected, isTypePincode: isTypePincode,
     date: moment(searchParamData.get('date'), 'DD-MM-YYYY') }
let filter = { date: context.date.format('DD-MM-YYYY') }

//Dropdowns
const doseDropdownEl = document.querySelector('#dose-dropdown')
const ageDropdownEl = document.querySelector('#age-dropdown')
const vaccineDropdownEl = document.querySelector('#vaccine-dropdown')
//Textbox
const searchHospitalEl = document.querySelector('#textbox-hospital')
//Date Navigation
const nextDateEl = document.querySelector('.next-date')
const previousDateEl = document.querySelector('.previous-date')

// Revert to homepage if request is invalid
const isRequestValid = (context.date.isValid() && ((isTypePincode && pincodeSelected) || (!isTypePincode && districtId && stateId)))
if (!isRequestValid) {
    location.assign('/index.html')
}



createAppointmentList(context, filter)


doseDropdownEl.addEventListener('change', (e) => {
    filter['dose'] = e.target.value
    createAppointmentList(context, filter)
})

ageDropdownEl.addEventListener('change', (e) => {
    filter['age'] = e.target.value
    createAppointmentList(context, filter)
})

vaccineDropdownEl.addEventListener('change', (e) => {
    filter['vaccine'] = e.target.value
    createAppointmentList(context, filter)
})

searchHospitalEl.addEventListener('input', (e) => {
    filter['search-text'] = e.target.value
    createAppointmentList(context, filter)
})

nextDateEl.addEventListener('click', (e) => {
    filter.date = (moment(filter['date'],'DD-MM-YYYY').add(1,'days').format('DD-MM-YYYY'))
    const nextDay = (context.date.add(1,'days'))
    context.date = nextDay
    createAppointmentList(context, filter)
})

previousDateEl.addEventListener('click', (e) => {
    filter.date = (moment(filter['date'],'DD-MM-YYYY').subtract(1,'days').format('DD-MM-YYYY'))
    const previousDay = (context.date.subtract(1,'days'))
    context.date = previousDay
    createAppointmentList(context, filter)
})