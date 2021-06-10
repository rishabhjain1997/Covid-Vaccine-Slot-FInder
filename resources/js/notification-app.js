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
    const region = e.target.elements.region.value
    const phoneNumber = phoneInput.getNumber()
    const isPhoneNumberValid = phoneInput.isValidNumber()
    if (!isPhoneNumberValid) {

        alert('Invalid phone number, please try again')
        location.reload()



    } else {
        const appVerifier = window.recaptchaVerifier
            // TODO - call recaptchaVerifier in hidden element in OTP
        displayOtpForm()
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                    // SMS sent

                    window.confirmationResult = confirmationResult
                    user = new User(fullName, email, phoneNumber, region)
                },

                (error) => {
                    window.recaptchaVerifier.render().then(function(widgetId) { grecaptcha.reset(widgetId) })
                    if (error.message) {
                        alert(error.message)
                    } else {
                        alert('We could not send an SMS, redirecting...')
                    }
                    displayNotificationForm()
                })
    }
})
const regionToDistrictMap = {
    'Delhi': [141, 145, 140, 146, 147, 143, 148, 149, 144, 150, 142],
    'Gurgaon': [188],
    'Noida': [650],
    'Mumbai': [395],
    'Chennai': [571],
    'Bangalore': [265, 276],
    'Kolkata': [725]
}
otpFormEl.addEventListener("submit", function(e) {
    e.preventDefault()
    const code = e.target.elements.otp.value
    window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            displayConfirmation()
            const loggedInUser = result.user;
            user['uid'] = loggedInUser.uid
            addUserToFirebase(user, regionToDistrictMap)
            updateRegionInFirebase(user, regionToDistrictMap)
        },

        (error) => {
            if (error.message) {
                alert(error.message)
            } else {
                alert('Incorrect verification code')
            }
            console.log(error)

        })
})