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

function addUserToFirebase(user) {
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

function updateRegionInFirebase(user) {
    if (user.region) {
        const updates = {}
        updates['regions/' + user.region + '/users/' + user.phoneNumber] = {
            [user.phoneNumber]: "true"
        }
        firebase.database().ref().update(updates);

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

    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
                // SMS sent
                displayOtpForm()
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

otpFormEl.addEventListener("submit", function(e) {
    e.preventDefault()
    const code = e.target.elements.otp.value
    confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const loggedInUser = result.user;
            user['uid'] = loggedInUser.uid
            addUserToFirebase(user)
            updateRegionInFirebase(user)
            displayConfirmation()
        },

        (error) => {
            console.log(error)
            alert('Incorrect verification code')
        })
})