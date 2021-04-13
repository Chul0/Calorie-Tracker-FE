
const showSection = (sectionClass) => {
    document.querySelectorAll('section').forEach( s => s.classList.add('hidden'))
    document.querySelector(sectionClass).classList.remove('hidden')
}

const showLoginBoard = () => {
    showSection('.login-board')
}
const showSignUpBoard = () => {
    showSection('.signup-board')
}
const showDashBoard = () => {
    showSection('.dashboard')
}
const showProfileBoard = () => {
    showSection('.profile-board')
}



const loggedIn = () => {
    document.querySelector('#login-link').classList.add('hidden')
    document.querySelector('#signup-link').classList.add('hidden')  //logged in 
    document.querySelector('#logout-link').classList.remove('hidden')
    document.querySelector('#dashboard-link').classList.remove('hidden') 
    document.querySelector('#profile-link').classList.remove('hidden') 
}
const loggedOut = () => {
    document.querySelector('#logout-link').classList.add('hidden')
    document.querySelector('#dashboard-link').classList.add('hidden') 
    document.querySelector('#profile-link').classList.add('hidden') 
    document.querySelector('.login-board').classList.add('hidden') 
    document.querySelector('.signup-board').classList.add('hidden')
    document.querySelector('.profile-board').classList.add('hidden') 
    document.querySelector('.dashboard').classList.add('hidden') //show logged out
}

// const userName = (firstName) => {
//     document.querySelector('.user-name').innerText=(`Hi ${firstName}`)
// }


//Changes based on login/logout statement
if(localStorage.getItem('userId')){
    loggedIn()
    showDashBoard()
    //if present, show logged in state
  }else{
    loggedOut()
  }


//When Home is clicked, page refreshes
document.querySelector('#home-link').addEventListener('click', () => {
    location.reload();
})

//Show dashboard when dashbord link is clicked
document.querySelector('#dashboard-link').addEventListener('click', () => {
    showDashBoard()
})



//signup
document.querySelector('#signup-link').addEventListener('click', () => {
    showSection('.signup-board')
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
        // console.log(response)
        
        const errorMessage = response.data.error
        if(errorMessage != null){
            alert(`${errorMessage}`)
        }else{
            const userId = response.data.user.id
            localStorage.setItem('userId', userId)
            showLoginBoard()
            alert('Successfully signed up!')
        }
    } catch (error) {
        // console.log(error)
            alert('email is already used by someone')
    }
})
})

//login
document.querySelector('#login-link').addEventListener('click', () => {
    showSection('.login-board')
document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

try {
    const response = await axios.post('http://localhost:3001/users/login', {
        email: email,
        password: password
    })
    // console.log(response)

    const userId = response.data.user.id
    localStorage.setItem('userId', userId) //'userId' is like a variable, can name it with anything

    alert(`Welcome back ${response.data.user.firstName} !`)
    showDashBoard()
    loggedIn()
    

} catch (error) {
    console.log(error)
    alert('email or password is incorrect')
}
})
})

//Logout
document.querySelector('#logout-link').addEventListener('click', () =>{
    localStorage.removeItem('userId')
    location.reload();
})


//Delete user account
let deleteAccount = document.querySelector('.deleteProfile').addEventListener('click', async () => {
    let userId = localStorage.getItem('userId')
    const response = await axios.delete(`http://localhost:3001/users/${userId}`)
    alert(`Good bye ${response.data.user.firstName}..`)
    localStorage.removeItem('userId')
    location.reload();
})

//Search food functionality 
let searchForm = document.querySelector('#food-form')
searchForm.addEventListener('submit', async(event) => {
    event.preventDefault()
    try {
        const searchBar = document.querySelector('#food-search').value
        // console.log(searchBar)

        const response = await axios.get(`http://localhost:3001/food/search/${searchBar}`)
        // console.log(response.data.parsed[0]) //food name
        // console.log(response.data.parsed[0].food.label) //food name
        // console.log(response.data.parsed[0].food.nutrients.ENERC_KCAL) //Kcal
        // console.log(response.data.parsed[0].food.nutrients.FAT) //fat
        // console.log(response.data.parsed[0].food.nutrients.PROCNT) //protein
        // console.log(response.data.parsed[0].food.nutrients.CHOCDF) //carbs
        showResults(response.data)
        saveSearch(response.data)
    } catch (error) {
        console.log(error)
    }
})

// resultsId = null
const showResults = (data) => {
    // resultsId = data.parsed[0].food.foodId
    let searchResults = document.querySelector('.search-result-container')
    searchResults.classList.remove('hidden')
    let saveButton = document.querySelector('.saveSearch')
    saveButton.classList.remove('hidden')
    

    let resultFoodName = document.querySelector('#result-food-name')
    resultFoodName.innerText = data.parsed[0].food.label
    
    let resultKcal = document.querySelector('#result-kcal')
    resultKcal.innerText = `Calories: ${data.parsed[0].food.nutrients.ENERC_KCAL}`

    let resultCarbs = document.querySelector('#result-carbs')
    resultCarbs.innerText = `Total Carbohydrate: ${data.parsed[0].food.nutrients.CHOCDF}g`

    let resultFat = document.querySelector('#result-fat')
    resultFat.innerText = `Total Fat: ${data.parsed[0].food.nutrients.FAT}g`

    let resultProtein = document.querySelector('#result-protein')
    resultProtein.innerText = `Protein: ${data.parsed[0].food.nutrients.PROCNT}g`
    
}

//save functionality 
let saveSearch = (data) => {
let foodSearch = document.querySelector('.saveSearch')
foodSearch.addEventListener('click', async (event) => {
    event.preventDefault()
    try {
            const user = localStorage.getItem('userId')
            const response = await axios.post(`http://localhost:3001/food/${user}/save`, {
                name: `${data.parsed[0].food.label}`,
                foodId: `${data.parsed[0].food.foodId}`,
                userId: user
            })
            // console.log(response)
            getAllFood()
        }catch (error) {
        console.log({message: `Could not save food`})
    }
    })
}

//show saved food
const getAllFood = async () => {
    let userId = localStorage.getItem('userId')
    let response = await axios.get(`http://localhost:3001/users/${userId}/getfood`)
    // console.log(response.data)
    let data = response.data
    let savedItemBoard = document.querySelector('.saved-item')
  
    while(savedItemBoard.firstChild) {
        savedItemBoard.firstChild.remove()
 }
 //if I don't add while loop, every time for loop runs, it will create a duplicate
        for (let i = 0; i < data.length; i++) {
            let h4 = document.createElement('h4')
            savedItemBoard.append(h4)
             h4.innerText = `- ${response.data[i].name}`//this will show new added food
            }    
            let resetButton = document.createElement('button')
            resetButton.classList.add('resetSavedItem')
            resetButton.innerText = 'RESET'
            resetButton.addEventListener('click', async (event)=> {
                event.preventDefault()
                let response = await axios.delete(`http://localhost:3001/users/${userId}/delete`) //delete saved food from user
                location.reload();
            })
            savedItemBoard.append(resetButton)

}

//Profile setting
document.querySelector('#profile-link').addEventListener('click', (event) =>{
    event.preventDefault()
    showProfileBoard()
    showUserInfo()
    editProfile()
})

//Show userinfo
const showUserInfo = async () => {
    let userId = localStorage.getItem('userId')
    let response = await axios.get(`http://localhost:3001/users/${userId}/`)
    let data = response
    // console.log(data)

    let firstName = document.querySelector('#edit-first-name')
        firstName.setAttribute('value', `${response.data.user.firstName}`) //adding value from saved user
    let lastName = document.querySelector('#edit-last-name')
        lastName.setAttribute('value', `${response.data.user.lastName}`)
    let email = document.querySelector('#edit-email')
        email.setAttribute('value', `${response.data.user.email}`)
    let password = document.querySelector('#edit-password')
        password.setAttribute('value', `${response.data.user.password}`)
    let height = document.querySelector('#edit-height')
        height.setAttribute('value', `${response.data.user.height}`)
    let weight = document.querySelector('#edit-weight')
        weight.setAttribute('value', `${response.data.user.weight}`)

}
//Edit account info

const editProfile = async () => {
    document.querySelector('.user-info-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const firstName = document.querySelector('#edit-first-name').value
    const lastName = document.querySelector('#edit-last-name').value
    const email = document.querySelector('#edit-email').value
    const password = document.querySelector('#edit-password').value
    const height = document.querySelector('#edit-height').value
    const weight = document.querySelector('#edit-weight').value
    
    try {
        let userId = localStorage.getItem('userId')
        let response = await axios.put(`http://localhost:3001/users/${userId}/edit`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            height: height,
            weight: weight
        })
        // console.log(response)
        alert('Profile info is successfully changed')
    } catch (error) {
        console.log(error)
    }
})
}
