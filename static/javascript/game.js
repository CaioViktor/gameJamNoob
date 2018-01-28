let TAMANHO = 10;
var grade = null;
var canoSelecionado = false;
var tipoSelecionado = null;
var jogoAtivo = true;
var pontuacao = 0;

var timer = null;
var nivel = 1;

var gameOver = function(){
	alert("Game Over!");
}
function atualizarPontuacao(){
	$("#pontos")[0].innerHTML=pontuacao;
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
	timer.stop();
	$("#botaoResolver")[0].disabled=true;
	jogoAtivo = false;
	var caminho = grade.acharCaminho(grade.origem,grade.fim);
	
	if(caminho == null){//Caminho errado
		return gameOver();
	}
	var celula = caminho;

	while(celula != null){
		celula.celulaTabela.style.borderColor = "green";
		celula = celula.pai;
	}
	$("#botaoProximo")[0].style.display = "block";
	$("#botaoResetar")[0].disabled = true;
	var saldoFase = nivel * 100;
	pontuacao = pontuacao + (saldoFase + Math.floor(saldoFase*timer.getPercente()/100));
	alert("Parabéns cidade abastecida!!!\nPontuação: "+saldoFase+"\nBônus de tempo:"+ Math.floor(saldoFase*timer.getPercente()/100))

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
	grade = null;
	canoSelecionado = false;
	tipoSelecionado = null;
	jogoAtivo = true;
	$("#gradeGame tr").remove();
	initGame(nivel+1);
}

function initGame(nivel){
	var quebrados = nivel * 2;
	if(nivel > 25)
		quebrados = 50 + nivel - 25 ;
	grade = new Grade(TAMANHO,$("#gradeGame")[0]);
	grade.setListener("click",inserirCano);
	$("#botaoProximo")[0].style.display = "none";
	$("#botaoResolver")[0].disabled=false;
	$("#botaoResetar")[0].disabled = false;

	grade.setOrigem(0,0);
	grade.setFim(TAMANHO-1,TAMANHO-1);
	grade.setQuebrados(quebrados);
	atualizarPontuacao();
	timer = new Timer(5,30,$("#tempo")[0],$("#percent")[0],gameOver);
	timer.start();

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
	
	pontuacao = 1000;
	nivel = 1;
	initGame(nivel);
}