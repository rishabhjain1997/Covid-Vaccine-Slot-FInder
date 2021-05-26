const displayConfirmation = () => {
    const notificationFormEl = document.querySelector('#authentication-form')
    const confirmationMessageEl = document.querySelector('.confirmation-message')
    const otpFormEl = document.querySelector('#otp-form')
    notificationFormEl.style.display = 'none';
    confirmationMessageEl.style.display = 'block';
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