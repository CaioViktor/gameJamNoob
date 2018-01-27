var grade = null;
function init(){
	$(".tipoCano").toArray().forEach(function(e){
		e.addEventListener("click",function(event){
			e.style.borderColor = "red";
		});
	});
	grade = new Grade(10,$("#gradeGame")[0]);
}