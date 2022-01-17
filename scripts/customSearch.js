// Fetching Input element and storing in variable
let searchBar = document.getElementById('search-field');

// Fetching main container in which we will be displaying our description container
let mainContainer = document.getElementById('initial-result-container');

// Adding keypress subscription/Eventlistener to input field so that whenever enter is pressed it will start searching
searchBar.addEventListener('keypress', (event) => {
	if (event.keyCode == 13){
		searchForCountry(event);
	}
})


// This function will be either called from the above code or from the list elements which are present on line 57 in initialRender.js
// file. Onclick event is added to each element along with custom parameter, so that whenever its clicked it will pass the searchValue 
// to this function. In the If condition we are checking if we got searchValue, if YES then it means user clicked on one of the list
// elements, and if NO then it means the function is called by  'keypress' eventlistener and we will be taking searchValue from 
// input field which we have stored in 'searchBar' variable on line 2 of this current file.
function searchForCountry(event, searchValue = ""){
	let countryName;

	if (searchValue != ""){
		countryName = searchValue;
	} else{
		countryName = searchBar.value;
	}

	
	// Disabling the listcontainer so that we can display our new description-container result
	let listContainer = document.getElementById('list-container');
	listContainer.style.display = 'none';
	console.log('Hiding list container');
	

	// Checking if we are having any 'country-detail-container' container or 'error-container', if yes then we will be removing it else we will proceed
	// with normal execution
	let countryDetailContainer = document.getElementById('country-detail-container');
	if (countryDetailContainer){
		countryDetailContainer.remove();
	}
	let errorContainer = document.getElementById('error-container');
	if (errorContainer){
		errorContainer.remove();
	}

	
	// Fetching details for search value
	fetch(`https://restcountries.com/v3.1/name/${countryName}`)
	.then(res => {
		if (res.status == 200){
			fillContentInContainer(res.json());
		} else {
			displayError()
		}
	})
	.catch(err => console.log(err))
}

function fillContentInContainer(searchData){
	searchData
	.then(res => {
		if (res.length > 0){

			// A callback function which will be called when we are done extracting the 
			extractData(res[0], (resp)=> {
				console.log(resp)
				mainContainer.insertAdjacentHTML('afterbegin',
					`
					<div id="country-detail-container">
						<div id="country-name">
							<h1>${resp.countryName}</h1>
						</div>
						<div id="country-detail-section">
							<div id="country-description">
								<div id="flag-image">
									<img src="${resp.flagImage}">
								</div>
								<div id="rough-desc">
									<table>
										<tr>
											<td><b>Name: </b></td>
											<td>${resp.countryName}</td>
										</tr>
										<tr>
											<td><b>Native Name: </b></td>
											<td>${resp.nativeName}</td>
										</tr>
										<tr>
											<td><b>Languages Spoken: </b></td>
											<td>${resp.languages}</td>
										</tr>
										<tr>
											<td><b>Check Country on map: </b></td>
											<td>
												<a href="${resp.googleMap}" target='_blank'>Google Maps</a><b> /</b>
												<a href="${resp.openstreetmap}"  target='_blank'>Open Street Maps</a>
											</td>
										</tr>
										<tr>
											<td><b>Geographic Location: </b></td>
											<td>${resp.latlng1}<sup>&#176</sup> North and ${resp.latlng2}<sup>&#176</sup> East</td>
										</tr>
									</table>
								</div>
							</div>
							<div id="country-details">
								${resp.countryName} is an ${resp.isIndependent} Country with an ${resp.area}km2 area filled with ${resp.population} of population.
								Geographically it is located at ${resp.latlng1} degrees North and ${resp.latlng2} degrees East. ${resp.languages}. 
								${resp.capital} ${resp.timezone} and is a part of ${resp.continent} continent.
							</div>
						</div>
					</div>
					`
				)
			})
		} else {
			displayError()
		}
	})
	.catch(err => console.log(err));
}


// A simple function to take the data and store it in the variable so that we can use it in above function easily
function extractData(res, callback){
	let countryName = res.name.common;
	let nativeName = res.name.official
	let flagImage = res.flags.svg;

	let languages = Array()
	for (let key in res.languages){
		languages.push(res.languages[key])
	}
	// Re validating if its empty then we will change the statement
	languages = languages.length === 0 ? '' : `Languages spoken in this country are ${languages.join(', ')}`

	let googleMap = res.maps.googleMaps;
	let openstreetmap = res.maps.openStreetMaps;

	let population = res.population;
	let latlng1 = res.latlng[0]
	let latlng2 = res.latlng[1]

	// Checking if its independent then we will just store 'Independent' and if its not then we will store 'not an Independent'
	let isIndependent = res.independent ? 'Independent' : 'not an Independent';
	let area = res.area;

	let continent = res.continents[0];

	let capital;
	let clantlng1;
	let clantlng2;

	// Checking if we are having any capital attibute for the current result, if no then it will throw error and we can catch it in
	// our catch block.
	try{
		capital = res.capital[0];
		clantlng1 = res.capitalInfo.latlng[0]
		clantlng2 = res.capitalInfo.latlng[1]
		capital = `Capital of ${countryName} is ${capital} which is located at ${clantlng1} degree North ${clantlng2} degree East.`;
	} catch {
		capital = `This country does not have any capital.`;
	}


	// there can be multiple timezones, so we can store it in one array.
	let timezone = []
	for (let key in res.timezones){
		timezone.push(res.timezones[key])
	}

	// After storing all the timezones we will check if its length is greater than 1 which means that we are having multiple
	// timezones and we have to change our grammer, we have to replace 'timeszone' with 'timezones'. Adding 's' in the end 
	// to make it in plural form.
	timezone = timezone.length > 1 ?
			   `${countryName} follows following timezones ${timezone.join(', ')}` :
			   `${countryName} follows following timezone ${timezone.join(', ')}`;


	callback({countryName, nativeName, languages, googleMap, openstreetmap, population, latlng1, latlng2, flagImage,
			  clantlng1, clantlng2, isIndependent, area, capital, timezone, continent
	});
}

// A simple funtion to display an error div container with an image if anything goes wrong.
// This function is triggered from line 39 and line 103 of the current file.
function displayError(){

	// Remove 'country-detail-container' and 'error-container' if they are present
	let descriptionContainer = document.getElementById('country-detail-container');
	let errorContainer = document.getElementById('error-container');
		
	if (descriptionContainer) descriptionContainer.remove();
	if (errorContainer) errorContainer.remove();


	mainContainer.insertAdjacentHTML('afterbegin', 
		`
			<div id='error-container'>
				<img src="./images/Error.jpg">
			</div>
		`
	)
}



// A small function to disable description container[maincontainer] and enabling listContainer
function displayList(){
	let listContainer = document.getElementById('list-container');
	let descriptionContainer = document.getElementById('country-detail-container');
	let errorContainer = document.getElementById('error-container');
	if (errorContainer){
		errorContainer.remove();
	}
	listContainer.style.display='block';
	if (descriptionContainer){
		descriptionContainer.remove();
	}
}