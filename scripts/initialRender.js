function grabAllNames(){

	// Before fetching, we can check if its already present in the sessionstorage, if yes then we don't have to do fetching 
	// we can directly jump on createListElements function and if its not present then we will fetch, sort and store it in
	// sessionstorage so that we can use the processed data directly to increase performance.
	if (sessionStorage.getItem('data')){
		data = JSON.parse(sessionStorage.getItem('data'));
		createListElements(data, false);
		return;
	}

	// Doing a fetch request to fetch all country names 

	fetch('https://restcountries.com/v3.1/all')
	.then(res => {
		res.json()
		.then(res => createListElements(res))
		.catch(err => console.log(err, res.status))
	})
	.catch(err => console.log(err))
}



function createListElements(data, shouldWeSort = true){
	let processedData = []

	if (shouldWeSort){
		// Iterating over the result data and then extracting its name and builting our own href link with the help of name and
		// pushing it to our array.
		for (let idx = 0; idx < 250; idx++){
			processedData.push({name: data[idx].name.common, href: `https://restcountries.com/v3.1/name/${data[idx].name.common}`})
		}
		// Sorting the processed array
		processedData.sort(compare);
		sessionStorage.setItem('data', JSON.stringify(processedData))	
	} else {
		processedData = data;
	}
	
	// Fetching and storing the contianer in which we will be adding list
	let container = document.getElementById('list-container');

	// Creating li elements using insertAdjscentHTML method and adding it to parent container
	processedData.forEach(data => {
		container.insertAdjacentHTML('beforeend', 
			`
				<li class="list">
					<div class="icon">
						<i class="fas fa-angle-double-right"></i>
					</div>
					<div onclick="searchForCountry('', '${data.name}')" class="country-name">
						<p>${data.name}</p>
					</div>
				</li>
			`
			)
	});
}



// Basic compare function used by sort method to sort the processed array
function compare(firstELM, secondELM){
	if (firstELM.name < secondELM.name) return -1;
	if (firstELM.name > secondELM.name) return  1;
	return 0;
}
