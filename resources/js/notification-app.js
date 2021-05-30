const notificationFormEl = document.querySelector('#authentication-form')
const otpFormEl = document.querySelector('#otp-form')
const database = firebase.database()
let user

class User {
    constructor(name, email, phoneNumber, region) {
        this.name = name
        this.email = email
        this.phoneNumber = phoneNumber
        this.region = region
    }



}



window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('notification--submit', {
    'size': 'invisible',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
    }
});

notificationFormEl.addEventListener("submit", function(e) {
    e.preventDefault()
    console.log(e)
    const fullName = e.target.elements.name.value
    const email = e.target.elements.email.value
    const number = e.target.elements.phoneNumber.value
    const region = e.target.elements.region.value
    const phoneNumber = '+91'.concat(number.toString())

    const appVerifier = window.recaptchaVerifier
        // TODO - call recaptchaVerifier in hidden element in OTP
    displayOtpForm()
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
                // SMS sent

                window.confirmationResult = confirmationResult
                user = new User(fullName, email, number, region)
            },

            (error) => {
                window.recaptchaVerifier.render().then(function(widgetId) { grecaptcha.reset(widgetId) })
                alert('We could not send an SMS, redirecting...')
                console.log(error)
                displayNotificationForm()
            })
})
const regionToDistrictMap = {
    'Delhi': [141, 145, 140, 146, 147, 143, 148, 149, 144, 150, 142],
    'Gurgaon': [188],
    'Noida': [650]
}
otpFormEl.addEventListener("submit", function(e) {
    e.preventDefault()
    const code = e.target.elements.otp.value
    confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const loggedInUser = result.user;
            user['uid'] = loggedInUser.uid
            addUserToFirebase(user, regionToDistrictMap)
            updateRegionInFirebase(user, regionToDistrictMap)
            displayConfirmation()
        },

        (error) => {
            console.log(error)
            alert('Incorrect verification code')
        })
})