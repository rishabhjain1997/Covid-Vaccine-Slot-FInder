// TODO - Check if dropdown functions could be optimised
const createStateDropdown = async(stateId = null) => {
    const states = await getStateList()

    const stateDropdownEl = document.querySelector('#state-dropdown')

    for await (state of states) {

        const optionEl = document.createElement('option')
        optionEl.textContent = state.state_name
        optionEl.value = state.state_id
        if (stateId && state.state_id === stateId) {
            optionEl.selected = true
        }
        stateDropdownEl.appendChild(optionEl)

    }

    //Create dropdown placeholder dynamically 
    const optionEl = document.createElement('option')
    optionEl.textContent = 'Select state'
    optionEl.classList.add('option-placeholder')
    optionEl.value = ''
    if (!stateId) {
        optionEl.selected = true
    }

    optionEl.disabled = true
    stateDropdownEl.prepend(optionEl)

}

// Populate the district dropdown after the state has been selected in the state dropdown
const createDistrictDropdown = async(stateId, districtId = null) => {
    const districts = await getDistrictByState(stateId)
    const districtDropdownEl = document.querySelector('#district-dropdown')
    districtDropdownEl.innerHTML = ''
    for (district of districts) {

        //Create and append DOM for all districts of the state to the dropdown
        const optionEl = document.createElement('option')
        optionEl.textContent = district.district_name
        optionEl.value = district.district_id
        if (districtId && district.district_id === districtId) {
            optionEl.selected = true
        }
        districtDropdownEl.appendChild(optionEl)

    }

    //Create dropdown placeholder dynamically 
    const optionEl = document.createElement('option')
    optionEl.textContent = 'Select region'
    optionEl.classList.add('option-placeholder')
    optionEl.value = ''
    if (!districtId) {
        optionEl.selected = true
    }

    optionEl.disabled = true
    districtDropdownEl.prepend(optionEl)


}

const togglePincode = (showPincode) => {
    const stateDropdownEl = document.querySelector('#state-dropdown')
    const districtDropdownEl = document.querySelector('#district-dropdown')
    const pincodeTextboxEl = document.querySelector('#textbox-pincode')
    const pincodeButtonEl = document.querySelector('#button-pincode')
    const districtButtonEl = document.querySelector('#button-district')

    //If Pincode box is not displayed and pincode is clicked
    if (showPincode && pincodeTextboxEl.classList.contains('textbox-remove')) {

        stateDropdownEl.classList.add('dropdown-remove')
        districtDropdownEl.classList.add('dropdown-remove')
        pincodeTextboxEl.classList.remove('textbox-remove')
        pincodeButtonEl.classList.add('btn-search--selected')
        districtButtonEl.classList.remove('btn-search--selected')
    }

    // If Pincode box is being displayed and district button is clicked
    if (!showPincode && !pincodeTextboxEl.classList.contains('textbox-remove')) {

        stateDropdownEl.classList.remove('dropdown-remove')
        districtDropdownEl.classList.remove('dropdown-remove')
        pincodeTextboxEl.classList.add('textbox-remove')
        pincodeButtonEl.classList.remove('btn-search--selected')
        districtButtonEl.classList.add('btn-search--selected')
    }

}

const isPincodeSelected = () => {
    // Return true if pincode textbox is visible
    const pincodeTextboxEl = document.querySelector('#textbox-pincode')
    return !pincodeTextboxEl.classList.contains('textbox-remove')
}



const createCalendar = async(context) => {

    const currentDate = moment()

    if (context.isTypePincode) {
        data = await getCalendarByPin(context.pincode, currentDate.format("DD-MM-YYYY"))
    } else {
        data = await getCalendarByDistrict(context.district, currentDate.format("DD-MM-YYYY"))
        console.log(data)
    }

    let upcomingWeekDates = [currentDate.format("DD-MM-YYYY")]
    for (i = 0; i < 6; i++) {
        upcomingWeekDates.push(currentDate.add(1, 'days').format("DD-MM-YYYY"))

    }
    //Create array for the next 7 days
    const calendarListEl = document.querySelector('#calendar')
    calendarListEl.innerHTML = ''

    // Create array of all available vaccination sessions
    let sessions = []
    for (center of data['centers']) {

        sessions.push(center.sessions)

    }
    sessions = sessions.flat()

    // Append session data to unordered list
    for (date of upcomingWeekDates) {
        const dateEl = generateCalendarDateDOM(sessions, date, context)
        calendarListEl.appendChild(dateEl)

    }
}





const generateCalendarDateDOM = (sessions, date, context) => {
    let filteredSessions = sessions.filter((session) => (session.date === date))
    let availableCapacity
    try {
        availableCapacity = filteredSessions.map((session) => (session.available_capacity)).reduce((a, b) => (a + b))
    } catch (err) {
        if (err instanceof TypeError) {
            availableCapacity = 0
        } else {
            logMyErrors(e)
        }
    }

    /*
    list -> a -> date
                capacity 
                icon
    */


    const nextIconEl = document.createElement('span')
    const listEl = document.createElement('li')
    const dateEl = document.createElement('p')
    const capacityEl = document.createElement('p')
    const linkEl = document.createElement('a')

    capacityEl.textContent = availableCapacity > 0 ? `${availableCapacity} slots` : 'No slots'
    dateEl.textContent = moment(date, 'DD-MM-YYYY').format('MMM D, dddd')

    if (availableCapacity === 0) {

        capacityEl.classList.add('grey-text')
    } else if (availableCapacity < 10) {
        capacityEl.classList.add('yellow-text')
    } else {
        capacityEl.classList.add('green-text')
    }

    nextIconEl.classList.add('material-icons')
    nextIconEl.classList.add('button--next')
    nextIconEl.textContent = 'navigate_next'

    listEl.appendChild(linkEl)
    linkEl.appendChild(dateEl)
    linkEl.appendChild(capacityEl)
    linkEl.appendChild(nextIconEl)

    //Create detail page link
    const searchParams = new URLSearchParams()
    searchParams.set('district', omitNaN(context.district))
    searchParams.set('state', omitNaN(context.state))
    searchParams.set('pincode', omitNaN(context.pincode))
    searchParams.set('isTypePincode', context.isTypePincode)
    searchParams.set('date', date)

    linkEl.href = `/detail.html?${searchParams.toString()}`
    return listEl
}

const omitNaN = (obj) => {
    if (obj) {
        return obj
    } else {
        return ''
    }
}

const filterCenter = (center, dateSelected) => {
    return (filterSession(center.sessions, dateSelected)).length > 0
}

const filterSession = (sessions, dateSelected) => {
    return sessions.filter((session) => (session.date === dateSelected))
}


const generateCenterDOM = (center, dateSelected) => {
    /*
    cardEl> availabilityInfoEl> availabilityBoxEl >availabilityTextEl 
                              > bookingLinkEl
            centerInfoEl>       centerNameEl
                                minAgeEl
                                vaccineNameEl
                                address>           centerBlockNameEl
                                                   centerPincodeEl
            
    */

    const cardEl = document.createElement('a')
    const availabilityBoxEl = document.createElement('div')
    const addressEl = document.createElement('div')
    const availabilityInfoEl = document.createElement('div')
    const availabilityTextEl = document.createElement('p')
    const centerInfoEl = document.createElement('div')
    const centerNameEl = document.createElement('p')
    const centerBlockNameEl = document.createElement('p')
    const centerPincodeEl = document.createElement('p')
    const minAgeEl = document.createElement('p')
    const vaccineNameEl = document.createElement('p')
    const bookingLinkEl = document.createElement('p')

    // Add CSS names
    availabilityBoxEl.classList.add('availability-box')
    cardEl.classList.add('card')
    availabilityInfoEl.classList.add('availability-info')
    addressEl.classList.add('address')
    availabilityTextEl.classList.add('availability-text')
    centerInfoEl.classList.add('center-info')
    centerNameEl.classList.add('center-name')
    centerBlockNameEl.classList.add('center-block-name')
    centerPincodeEl.classList.add('center-pincode')
    minAgeEl.classList.add('min-age')
    vaccineNameEl.classList.add('vaccine-name')
    bookingLinkEl.classList.add('booking-link')

    // Create hierarchy
    availabilityInfoEl.appendChild(availabilityBoxEl)
    availabilityBoxEl.appendChild(availabilityTextEl)
    centerInfoEl.appendChild(centerNameEl)
    if (center.block_name !== 'Not Applicable') {
        addressEl.appendChild(centerBlockNameEl)
    }
    addressEl.appendChild(centerPincodeEl)
    centerInfoEl.appendChild(addressEl)
    centerInfoEl.appendChild(minAgeEl)
    centerInfoEl.appendChild(vaccineNameEl)
    cardEl.appendChild(centerInfoEl)
    cardEl.appendChild(availabilityInfoEl)


    // Populate text
    bookingLinkEl.textContent = 'Book on Cowin'
    centerNameEl.textContent = cleanCenterName(center.name)
    centerBlockNameEl.textContent = `${center.block_name}, `
    centerPincodeEl.textContent = center.pincode
    const filteredSession = filterSession(center.sessions, dateSelected)[0]

    minAgeEl.textContent = `${filteredSession.min_age_limit}+`
    vaccineNameEl.textContent = `Vaccine: ${filteredSession.vaccine}`

    if (filteredSession.available_capacity === 0) {
        availabilityTextEl.textContent = `No slots`
        availabilityBoxEl.classList.add('grey-background')


    } else if (filteredSession.available_capacity < 10) {
        availabilityTextEl.textContent = `${filteredSession.available_capacity} slots`
        availabilityBoxEl.classList.add('yellow-background')
        availabilityInfoEl.appendChild(bookingLinkEl)
        bookingLinkEl.classList.add('yellow-background')
        cardEl.href = 'https://www.cowin.gov.in/'

    } else {
        availabilityTextEl.textContent = `${filteredSession.available_capacity} slots`
        availabilityBoxEl.classList.add('green-background')
        availabilityInfoEl.appendChild(bookingLinkEl)
        bookingLinkEl.classList.add('green-background')
        cardEl.href = 'https://www.cowin.gov.in/'
    }




    return cardEl
}

const cleanCenterName = (name) => {
    return name.replace('45 YEARS', '').replace('18 YEARS', '').replace('18 TO 44 YEARS', '').replace('18 YEAR', '').replace('18 Years', '').replace('45 YEAR', '')
}

// TODO -Optimise the two createDetail methods

const createDetailByDistrict = async(context) => {

    console.log(context)
    const districtId = context.district
    const dateSelected = context.date.format('DD-MM-YYYY')
    const appointmentListEl = document.querySelector('#appointments')
    appointmentListEl.innerHTML = ''
    const data = await getCalendarByDistrict(districtId, dateSelected)
    console.log(data)


    for (center of data['centers']) {

        if (filterCenter(center, dateSelected)) {


            const cardEl = generateCenterDOM(center, dateSelected)
            appointmentListEl.appendChild(cardEl)

        }
    }

}

const createDetailByPincode = async(context) => {

    const pincode = context.pincode
    const dateSelected = context.date.format('DD-MM-YYYY')
    const appointmentListEl = document.querySelector('#appointments')
    appointmentListEl.innerHTML = ''
    const data = await getCalendarByPin(pincode, dateSelected)
    console.log(data)


    for (center of data['centers']) {
        if (filterCenter(center, dateSelected)) {
            const cardEl = generateCenterDOM(center, dateSelected)
            appointmentListEl.appendChild(cardEl)

        }
    }

}