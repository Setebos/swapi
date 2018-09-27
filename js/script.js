const form  = document.getElementById('input-form');
const input = document.getElementById('input-text');

let type = ''
let oldCLass = '';
let newClass = '';

const MENU = {
	1: "planets/",
	2: "vehicles/",
	3: "starships/",
	4: "people/",
	5: "species/",
};

form.onsubmit = function(event) {
	event.preventDefault();

	let value = input.value;

	if($(form).hasClass('home-input')) {
		type = MENU[value];
		value = MENU[value];
		newClass = "list-input";
		oldClass = "home-input";
	}

	if($(form).hasClass('list-input') && $.isNumeric(input.value)) {
		oldClass = "list-input";
		newClass = "detail-input";
		value = $(form).attr("data-type") + value;
	}

	if(input.value == 'next') {
		value = $(form).attr('data-next');
	}

	if(input.value == 'prev') {
		value = $(form).attr('data-previous');
	}

	if(input.value == 'list') {
		value = $(form).attr("data-type");
		oldClass = "detail-input";
		newClass = "list-input";
	}

	if(input.value == 'home') {
		location.reload();
	}

	let url = "https://swapi.co/api/" + value;

	var request = $.ajax({
		type: 'GET',
		url: url,
		crossDomain: true,
		dataType: 'json',
	});

	request.done(function(data) {
		console.log(data);
		const regexNavigation = /^https:\/\/swapi\.co\/api\/(.*)$/m;
		const regex = /^https:\/\/swapi\.co\/api\/(.*)\/(\d*)\/$/m;

		if(newClass == 'list-input') {
			$('#swapi-content').html("<ul></ul>");
			$.each(data.results, function(key, value) {
				const result = regex.exec(value.url);
				const id = result[2];

			  	$('#swapi-content ul').append("<li>" + id + " - " + value.name + "</li>");
			  	$("#instructions").html("<ul><li>prev : Previous page</li><li>next : Next page</li><li>home : return to homepage</li></ul>")
			});
		} else if(newClass == 'detail-input') {
			fillTemplate(type, data);
			$("#instructions").html("<ul><li>list : Back to list</li><li>home : return to homepage</li></ul>");
		}

		// relance l'animation d'affichage
		$('#display').removeClass('wrapper');
		void $('#display').width();
		$('#display').addClass('wrapper');

		$(form).addClass(newClass);
	  	$(form).removeClass(oldClass);

	  	if(data.next !== undefined && data.next !== null) {
	  		$(form).attr('data-next', regexNavigation.exec(data.next)[1]);
	  	}
	  	if(data.previous !== undefined && data.previous !== null) {
	  		$(form).attr('data-previous', regexNavigation.exec(data.previous)[1]);
	  	}
	  	$(form).attr('data-type', type);
	  	input.value = '';
	});

	request.fail(function(jqXHR, textStatus) {
		console.log("échec : " + textStatus);
	});
}

const fillTemplate = function(type, data) {
	let template = '';
	switch(type) {
		case 'starships/':
			template = `<ul><li>Name : ${data.name}</li><li>Model : ${data.model}</li><li>Length: ${data.length}m</li><li>Manufacturer : ${data.manufacturer}</li><li>Cost : ${data.cost_in_credits} credits</li><li>Crew : ${data.crew}</li><li>Passengers : ${data.passengers}</li><li>Hyperdrive rating : ${data.hyperdrive_rating}</li><li>Cargo capacity : ${data.cargo_capacity}</li><li>Consumables : ${data.consumables}</li></ul>`;
			break;
		case 'planets/':
			template = `<ul><li>Name : ${data.name}</li><li>Diameter: ${data.diameter}km</li><li>Orbital period : ${data.orbital_period}</li><li>Rotation period : ${data.rotation_period}h</li><li>Climate : ${data.climate}</li><li>Gravity : ${data.gravity}</li><li>Terrain : ${data.terrain}</li><li>Surface water : ${data.surface_water}%</li><li>Population : ${data.population}</li>`
			break;
		case 'vehicles/':
			template = `<ul><li>Name : ${data.name}</li><li>Model : ${data.model}</li><li>Length: ${data.length}m</li><li>Manufacturer : ${data.manufacturer}</li><li>Cost : ${data.cost_in_credits} credits</li><li>Crew : ${data.crew}</li><li>Passengers : ${data.passengers}</li><li>Maximum speed : ${data.max_atmosphering_speed}</li><li>Cargo capacity : ${data.cargo_capacity}t</li><li>Consumables : ${data.consumables}</li></ul>`;
			break;
		case 'people/':
			template = `<ul><li>Name : ${data.name}</li><li>Gender : ${data.gender}</li><li>Birth year : ${data.birth_year}</li><li>Height : ${data.height}cm</li><li>Weight : ${data.mass}kg</li><li>Hair color : ${data.hair_color}</li><li>Eye color : ${data.eye_color}</li><li>Skin color : ${data.skin_color}</li></ul>`;
			break;
		case 'species/':
			template = `<ul><li>Name : ${data.name}</li><li>Classification : ${data.classification}</li><li>Designation : ${data.designation}</li><li>Average lifespan : ${data.average_lifespan}</li><li>Average height : ${data.average_height}</li><li>Language : ${data.language}</li><li>Skin colors : ${data.skin_colors}</li><li>Hair colors : ${data.hair_colors}</li><li>Eye colors : ${data.eye_colors}</li></ul>`;
			break;
	}
	$("#swapi-content").html(template);
}
