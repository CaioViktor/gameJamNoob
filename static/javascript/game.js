var grade = null;
var canoSelecionado = false;
var tipoSelecionado = null;
var inserirCano = function(e){
	// console.log(e);
	if(!canoSelecionado)
		return false;

	var linhaColuna = e.target.id.replace("C","").split("X");
	if(grade.isCelulaLivre(linhaColuna[0],linhaColuna[1])){
		grade.setCelula(linhaColuna[0],linhaColuna[1],tipoSelecionado);



		canoSelecionado = false;
		tipoSelecionado = null;
		$(".tipoCano").toArray().forEach(function(e){
			e.style.borderColor = "black";
		});
	}
}
function init(){
	$(".tipoCano").toArray().forEach(function(e){
		e.addEventListener("click",function(event){
			if(!canoSelecionado){
				e.style.borderColor = "red";
				tipoSelecionado = e.id;
				canoSelecionado = true;
			}else{
				$("#"+tipoSelecionado)[0].style.borderColor = "black";
				tipoSelecionado = null;
				canoSelecionado = false;
			}
		});
	});
	grade = new Grade(10,$("#gradeGame")[0]);
	grade.setListener("click",inserirCano);
}