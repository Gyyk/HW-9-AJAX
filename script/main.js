let usersArr = [];

const getUsers = () => {
	return fetch ("https://test-users-api.herokuapp.com/users",{method: "GET",
		headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }}).then(res => {
	return res.json()}).then(data => {
	return data.data})
	.catch(err => {
	console.log("err", err);
	return [];
})
};

const deleteUser = async (userId, userEl) => {
	try {
		await fetch ("https://test-users-api.herokuapp.com/users/"+userId, {
			method:"DELETE"
		});
		usersArr = usersArr.filter((item)=>item.id !== userId);
		userEl.remove();
	}
	catch (err) {
		console.log ("Failed to delete user:", err)
	}
} 


const renderUsers = function () {
	const container = document.querySelector (".container");
	container.innerHTML = "";
	usersArr.forEach (item => {
		const userEl = document.createElement ("div");
		userEl.classList.add ("user");
		userEl.innerHTML = `
		<h4><input id="new-name"placeholder= "${item.name}"></h4> 
		<h5><input id="new-age" placeholder= "${item.age}"></h5>
		`;
		const deleteBtn = document.createElement("button")
		deleteBtn.textContent = "X";
		deleteBtn.classList.add("user_remove");
		deleteBtn.addEventListener("click", () => deleteUser(item.id, userEl));
		const saveChangesBtn = document.createElement("button");
		saveChangesBtn.textContent = "Save changes";
		saveChangesBtn.addEventListener("click", () =>saveChanges(item.id));
		userEl.append(deleteBtn);
		userEl.append(saveChangesBtn);
		container.append(userEl);
})
}


const loadUsers = async () => {
	usersArr = await getUsers();
	renderUsers();
}

const saveChanges = (updUserId) => {
	const newName = document.querySelector("#new-name").value;
	const newAge = document.querySelector ("#new-age").value;
	console.log(updUserId);
	if (newName && newAge !== null) {	
	fetch("https://test-users-api.herokuapp.com/users/"+updUserId, {
        method: "PUT",
        body: JSON.stringify({
            name: newName,
            age: newAge
        }),
		headers: {
	    	Accept: 'application/json',
	    	'Content-Type': 'application/json',
	  	}
    }).then(res=> res)
	} else(alert("Enter both name and age, please!"))
}

const createUser = () => {
    const name = document.querySelector("#name").value;
    const age = document.querySelector("#age").value;
    fetch("https://test-users-api.herokuapp.com/users/", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            age: age
        }),
		headers: {
	    	Accept: 'application/json',
	    	'Content-Type': 'application/json',
	  	}
    }).then(res => {
        return res.json()
    }).then (data => {
    	const user = {
    		name,
    		age,
    		id: data.id
    	};
    	usersArr.unshift(user);
    	renderUsers();
    }).catch(err => {
        console.log("Failed to crate a user", err)
    })
}


document.addEventListener("DOMContentLoaded", () => {
const loadUsersBtn = document.querySelector (".load-users");
loadUsersBtn.addEventListener ("click", loadUsers);
const createUserBtn = document.querySelector ("#create-user");
createUserBtn.addEventListener ("click", createUser);
})