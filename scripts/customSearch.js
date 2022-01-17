// Fetching Input node and storing in variable
let searchBar = document.getElementById('search-field');

// Fetching main container in which we will be displaying our description container
let mainContainer = document.getElementById('initial-result-container');

// Adding keypress subscription/Eventlistener to input field so that whenever enter is pressed it will start searching
searchBar.addEventListener('keypress', (event) => {
	if (event.keyCode == 13){
		searchForCountry(event);
	}
})


function searchForCountry(event, searchValue = ""){
	let countryName;
	if (searchValue != ""){
		countryName = searchValue;
	} else{
		countryName = searchBar.value;
	}

	// Remove all the nodes before inserting new one
	while (mainContainer.firstChild){
		mainContainer.removeChild(mainContainer.firstChild);
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

	let isIndependent = res.independent ? 'Independent' : 'not an Independent';
	let area = res.area;

	// let timezone = res.timezones[0];
	let continent = res.continents[0];

	let capital;
	let clantlng1;
	let clantlng2;


	try{
		capital = res.capital[0];
		clantlng1 = res.capitalInfo.latlng[0]
		clantlng2 = res.capitalInfo.latlng[1]
		capital = `Capital of ${countryName} is ${capital} which is located at ${clantlng1} degree North ${clantlng2} degree East.`;
	} catch {
		capital = `This country does not have any capital.`;
	}


	let timezone = []
	for (let key in res.timezones){
		timezone.push(res.timezones[key])
	}
	timezone = timezone.length > 1 ?
			   `${countryName} follows following timezones ${timezone.join(', ')}` :
			   `${countryName} follows following timezone ${timezone.join(', ')}`;


	callback({countryName, nativeName, languages, googleMap, openstreetmap, population, latlng1, latlng2, flagImage,
			  clantlng1, clantlng2, isIndependent, area, capital, timezone, continent
	});
}

function displayError(){

	// Remove all the nodes before inserting new one
	while (mainContainer.firstChild){
		mainContainer.removeChild(mainContainer.firstChild);
	}

	mainContainer.insertAdjacentHTML('afterbegin', 
		`
			<div id='error-container'>
				<img src="./images/Error.jpg">
			</div>
		`
	)
}