
//signup
document.querySelector('.signup-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const firstName = document.querySelector('#signup-first-name').value
    const lastName = document.querySelector('#signup-last-name').value
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value
    const height = document.querySelector('#signup-height').value
    const weight = document.querySelector('#signup-weight').value
    try {
        const response = await axios.post('http://localhost:3001/users', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            height: height,
            weight: weight
        })
        console.log(response)
        
        const errorMessage = response.data.error
        if(errorMessage != null){
            alert(`${errorMessage}`)
        }else{
            const userId = response.data.user.id
            localStorage.setItem('userId', userId)
        }
    } catch (error) {
        // console.log(error)
            alert('email is already used by someone')
    }
})

//login
document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

try {
    const response = await axios.post('http://localhost:3001/users/login', {
        email: email,
        password: password
    })
    console.log(response)

    const userId = response.data.user.id
    localStorage.setItem('userId', userId) //'userId' is like a variable, can have any name 

    alert(`Welcome back ${response.data.user.firstName} !`)
    
} catch (error) {
    console.log(error)
    alert('email or password is incorrect')
}
})