const getStateList = async() => {
    const response = await fetch(`//cdn-api.co-vin.in/api/v2/admin/location/states`)
    if (response.status === 200) {
        const data = await response.json()
        return data.states
    } else {
        throw new Error('Unable to fetch data')
    }
}

const getDistrictByState = async(stateId) => {
    const response = await fetch(`//cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`)
    if (response.status === 200) {
        const data = await response.json()
        return data['districts']
    } else {
        throw new Error('Unable to fetch data')
    }
}

// const getDistrictsList = async() => {
//     let states = await getStateList()
//     let districts = []
//     states.forEach(async(state) => {
//         const district = await getDistrictByState(state.state_id)
//             //districts.push(district['districts'])
//         Array.prototype.push.apply(districts, district['districts'])
//     })
//     return districts
// }

const getCalendarByPin = async(pincode, date) => {
    const response = await fetch(`//cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to fetch data')
    }
}


const getCalendarByDistrict = async(districtId, date) => {
    const response = await fetch(`//cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to fetch data')
    }
}