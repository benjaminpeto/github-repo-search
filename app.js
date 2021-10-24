// SLIDE ---------------------------------------------
let slides = document.querySelectorAll(".slide");
let buttons = document.querySelectorAll(".btn");
let currentSlide = 1;

// for image slider manual navigation
const manualNav = function (manual) {
	slides.forEach((slide) => {
		slide.classList.remove("active");

		buttons.forEach((btn) => {
			btn.classList.remove("active");
		});
	});

	slides[manual].classList.add("active");
	buttons[manual].classList.add("active");
};

buttons.forEach((btn, i) => {
	btn.addEventListener("click", () => {
		manualNav(i);
		currentSlide = i;
	});
});

// for image slider autoplay navigation
const repeat = function () {
	let active = document.getElementsByClassName("active");
	let i = 1;
    let interval = 5000; //moved to variable so it's scalable

	const repeater = () => {
		setTimeout(function () {
			[...active].forEach((activeSlide) => {
				activeSlide.classList.remove("active");
			});

			slides[i].classList.add("active");
			buttons[i].classList.add("active");
			i++;

			if (slides.length == i) {
				i = 0;
			}
			if (i >= slides.length) {
				return;
			}
			repeater();
		}, interval);
	};
	repeater();
};
repeat();

// SLIDE ---------------------------------------------

// FETCH GITHUB USERS --------------------------------

const userInput = document.getElementById("user-search");
const errorMessage = document.getElementById("error-msg");
const root = document.getElementById("root");

// input event listener on keyboard 'ENTER' press
userInput.addEventListener("keypress", (event) => {
	root.style.display = "grid";
	clearError();
	//if userInput empty or ENTER is not pressed, won't proceed to search
	if (userInput.value.length > 0 && event.keyCode === 13) {
		event.preventDefault(); // prevent page from reloading
		let userName = userInput.value;
		fetch(`https://api.github.com/users/${userName}`, {
			headers: {
				Accept: "application/vnd.github.v3+json",
			},
		}).then(async (response) => {
			if (response.ok) {
				//if user was found
				return response.json()
				.then((data) => {
					if (data.public_repos > 0) {
						//if user has public repository
						fetch(`https://api.github.com/users/${userName}/repos`, {
							headers: {
								Accept: "application/vnd.github.v3+json",
							},
						})
						.then((response) => response.json()) //Converting the response to a JSON object
						.then((data) => {
							/* console.log(data); */
							root.innerHTML = data.map((repos) =>
								`<div class="repo-container" key=${repos.id}>
                                    <a class="repo-url" href="${repos.clone_url}" target=_blank rel="noreferrer">
                                        <span class="repo-name">${repos.name}</span>
                                    </a>
                                </div>`
							).join(""); //remove unexpected commas
						});
						userInput.value = ""; //clear input field
					} else { //user doesn't have public repo
						errorMessage.style.display = "block";
						errorMessage.innerHTML = "User doesn't have any public repository!";
						clearRepos();
                        userInput.value = ""; //clear input field
					}
				});
			} else { // user doesn't exist
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Sorry, username was not found!";
                clearRepos();
                userInput.value = ""; //clear input field
			}
		});
	}
});

//clear error from DOM
function clearError() {
	errorMessage.style.display = "none";
}

//clear previous user's repos
function clearRepos() {
	root.style.display = "none";
}

// FETCH GITHUB USERS --------------------------------