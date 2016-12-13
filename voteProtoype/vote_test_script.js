window.onload = function() {
  	document.getElementById('upvote').addEventListener('click', function (e) {
  		var score = document.getElementById("score").innerHTML;
  		score = Number(score);
		score++;
  		document.getElementById("score").innerHTML = score;
	});
	document.getElementById('downvote').addEventListener('click', function (e) {
  		var score = document.getElementById("score").innerHTML;
  		score = Number(score);
		score--;
  		document.getElementById("score").innerHTML = score;
	});

}