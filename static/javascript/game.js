let TAMANHO = 10;
var grade = null;
var canoSelecionado = false;
var tipoSelecionado = null;
var jogoAtivo = true;
var pontuacao = 0;

var timer = null;

var gameOver = function(){
	alert("Game Over!");
}

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
function resolver(){
	$("#botaoResolver")[0].disabled=true;
	jogoAtivo = false;
	var caminho = grade.acharCaminho(grade.origem,grade.fim);
	
	if(caminho == null){//Caminho errado
		alert("Game Over");
	}
	var celula = caminho;

	while(celula != null){
		celula.celulaTabela.style.borderColor = "green";
		celula = celula.pai;
	}
	$("#botaoProximo")[0].disabled = false;
	$("#botaoResetar")[0].disabled = true;
}
function resetar(){
	grade = null;
	canoSelecionado = false;
	tipoSelecionado = null;
	jogoAtivo = true;
	$("#gradeGame tr").remove();
	initGame(1);
}

function proximo(){

}

function initGame(nivel){
	grade = new Grade(TAMANHO,$("#gradeGame")[0]);
	grade.setListener("click",inserirCano);

	grade.setOrigem(0,0);
	grade.setFim(TAMANHO-1,TAMANHO-1);


}
function init(){
	$(".tipoCano").toArray().forEach(function(e){
		e.addEventListener("click",function(event){
			if(!jogoAtivo)
				return;
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
	timer = new Timer(0,30,$("#tempo")[0],$("#percent")[0],gameOver);
	initGame(1);
	timer.start();
}