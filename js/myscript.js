//-----prepare global vars we going to use-----//
var movies_arr = [];
var genre_arr = [];
var sort_arr = ["name", "year","likes"];
var filter = "show_all";
var filterClasses = ".";

$("#movies").html("<div class='text-center text-danger p-5 my-5'><h1>We are sorry, we can't connect to our movie database.<br>If you have a local copy of our page, please visit the online version to view our amazing movie database!</h1></div>");
//-----request contern from json file (http-request!!! will not wor on local copy)-----//
$.get("js/movies.json", function(data) {
  $("#movies").html("");
  fillContent(data.movies);
  movies_arr = data.movies;
});

$(sort_arr).each( function(i){
	$("#sort_"+sort_arr[i]).click(function() {sortString(sort_arr[i], "asc")});
	$("#sort_desc_"+sort_arr[i]).click(function() {sortString(sort_arr[i], "desc")});
})

function filterContent(genre){
	filter = genre;
	if (genre == "show_all") {
		$(filterClasses).slideUp(50);
		$(filterClasses).slideDown(500);
		$("#currentGenre").html("all genres");
	} else {
		$(filterClasses).slideUp(50);
		$("."+genre).slideDown(500);
		$("#currentGenre").html(genre.replace(/_/g,' '));
	}
}

function fillContent(movies) {
//-----create content of page-----//
	var content = ""
	$(movies).each(function(i) {
//-----handover the genre as class to the container, so we can filter it later on-----//
		var genre_div = (movies[i].genre).join("&-&").replace(/ /g,'_').replace(/&-&/g,' ');
		console.log(genre_div)
		content += "<div class='col-12 col-md-6 col-lg-6 col-xl-4 py-2 "+genre_div+"'>";
		content += "		<div class='test bg-verydark p-2 d-flex rounded'>";
		content += "			<img class='rounded' src='img/"+movies[i].img+"' alt='"+movies[i].name+"'>";
		content += "			<div class='d-flex flex-column px-3'>";
		content += "				<h4>"+movies[i].name+"</h4>";
		content += "				<h6> ("+movies[i].year+")</h6>";
		content += "				<span>"+movies[i].overview+"</span>";
		content += "				<div class='d-flex flex-no-wrap align-items-center ml-auto mt-auto' id='"+movies[i].img.split('.').slice(0, -1).join('.')+"'>";
		content += "					<h5 class='text-success like'>Like <i class='far fa-thumbs-up like'></i>&nbsp;</h5>";
		content += "					<div class='d-flex flex-column likes justify-content-center bg-success'><h4 class='text-center'>"+movies[i].likes+"</h4></div>";
		content += "				</div>";
		content += "			</div>";
		content += "		</div>";
		content += "	</div>";	
	});
//-----fill up page with content-----//
	$("#movies").html(content);
//-----add EventHandler to the "Like Button"-----//
	$(".like").click(likeUp);
//-----fill genre_arr with all genre from database/json-----//
	$(movies).each(function(i) {
		$(movies[i].genre).each(function(j, value){
			if($.inArray(value, genre_arr) === -1) genre_arr.push(value);
		});
	});
//-----if it is the first time we sort it, replace all spaces with _ and add show_all-----//
	if (genre_arr[0] != "show_all") {
		genre_arr.sort();
		$(genre_arr).each(function(i,value){genre_arr[i] = value.replace(/ /g,'_')})
		genre_arr.unshift("show_all");
	}
//-----add values für filtering-----//
	var filterValues = "";
	filterClasses = "";
	$(genre_arr).each(function(i, value){
		filterValues += "<button id='filter_"+value+"' class='dropdown-item'>"+value.replace('_',' ')+"</button>"
		filterClasses += "."+value+", ";
	})
	$("#genre_filter").html(filterValues);
	$(genre_arr).each(function(i, value){
		$("#filter_"+value).click(function(){filterContent(value)});
	});
	filterClasses = filterClasses.slice(0, -2);
	filterContent(filter);
}

function likeUp() {
	var tempId = $(this).parent().attr("id")
	$(movies_arr).each(function(i) {
		if (tempId == movies_arr[i].img.split('.').slice(0, -1).join('.')) {
			if (movies_arr[i].likes == 999) {
				swal("Sorry!","Your movie cannot have more than 999 Likes!","error");
			} else {
				movies_arr[i].likes++;
				tempId = "#"+tempId+" div h4";
				$(tempId).text(movies_arr[i].likes);
				if (movies_arr[i].likes == 999) {
					swal("Congratulation!","Your movie reached now 999 Likes!","success");
				}
			}
				
		}
	})	
}

function sortString(field, order) {
	if ((eval("movies_arr[0]."+field)).toFixed) {
		movies_arr.sort(function(a, b) {
		if (order == "desc") {
			return eval("b."+field) - eval("a."+field);
		} else {
			return eval("a."+field) - eval("b."+field);
		}
	});
	} else {
		movies_arr.sort(function(a, b){
			var x = eval("a."+field+".toLowerCase()");
			var y = eval("b."+field+".toLowerCase()");
			if (order == "desc") {
				if (x > y) {return -1;}
				if (x < y) {return 1;}
			} else {
				if (x < y) {return -1;}
				if (x > y) {return 1;}
			}
			return 0;
		});
	}
	fillContent(movies_arr);
}