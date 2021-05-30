const displayConfirmation = () => {
    const notificationFormEl = document.querySelector('#authentication-form')
    const confirmationMessageEl = document.querySelector('.confirmation-message')
    const otpFormEl = document.querySelector('#otp-form')
    notificationFormEl.style.display = 'none';
    confirmationMessageEl.style.display = 'flex';
    otpFormEl.style.display = 'none';



}

const displayOtpForm = () => {
    const notificationFormEl = document.querySelector('#authentication-form')
    const recaptchaContainerEl = document.querySelector('#recaptcha-container')
    const otpFormEl = document.querySelector('#otp-form')
    notificationFormEl.style.display = 'none';
    otpFormEl.style.display = 'flex';


}


const displayNotificationForm = () => {
    const notificationFormEl = document.querySelector('#authentication-form')
    const confirmationMessageEl = document.querySelector('.confirmation-message')
    const otpFormEl = document.querySelector('#otp-form')
    notificationFormEl.style.display = 'flex';
    confirmationMessageEl.style.display = 'none';
    otpFormEl.style.display = 'none';



}


const addUserToFirebase = (user) => {
    let userInfo = {
        username: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        uid: user.uid
    }
    let region = {
        [user.region]: "true"
    }


    const userRef = firebase.database().ref('users/' + user.phoneNumber)
    userRef.on('value', (snapshot) => {
        const data = snapshot.val()
        if (data) {
            let updates = {}
            updates['users/' + user.phoneNumber + '/regions/' + user.region] = region
            firebase.database().ref().update(updates)
        } else {
            firebase.database().ref('users/' + user.phoneNumber).set(userInfo)
            firebase.database().ref('users/' + user.phoneNumber + '/regions').set(region)
        }

    })

}

const updateRegionInFirebase = (user, regionToDistrictMap) => {
    if (user.region) {
        const updates = {}
        const districts = regionToDistrictMap[user.region]
        console.log(districts)
        for (districtId in districts) {
            console.log(districtId)
            console.log(districts[districtId])
            updates['regions/' + districts[districtId].toString() + '/users/' + user.phoneNumber] = {
                [user.phoneNumber]: "true"
            }
        }

        firebase.database().ref().update(updates);

    }

}