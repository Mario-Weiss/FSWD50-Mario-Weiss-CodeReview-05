var movies_arr

$.get("js/movies.json", function(data) {
  fillcontent(data.movies);
  movies_arr = data.movies;
});


function fillcontent(movies) {
//-----create content of page-----//
	var content = ""
	$(movies).each(function(i) {
		content += "<div class='col-12 col-md-6 col-lg-6 col-xl-4 py-2'>";
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

	$("#movies").html(content);
//-----add EventHandler to the "Like Button"-----//
	$(".like").click(likeUp);
}

function likeUp() {
	var tempId = $(this).parent().attr("id")
	$(movies_arr).each(function(i) {
		if (tempId == movies_arr[i].img.split('.').slice(0, -1).join('.')) {
			movies_arr[i].likes++;
			tempId = "#"+tempId+" div h4";
			$(tempId).text(movies_arr[i].likes);	
		}
	})
	
}


/* deprecated version but working!
var msg = $.ajax({type: "GET", url: "js/movies.json", async: false}).responseText;
console.log(msg)
var result = JSON.parse(msg);
console.log(result)
*/