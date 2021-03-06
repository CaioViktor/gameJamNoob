let TAMANHO = 10;
var grade = null;
var canoSelecionado = false;
var tipoSelecionado = null;
var jogoAtivo = true;
var pontuacao = 0;

var timer = null;
var nivel = 1;
var alturaInicial = 315;
var marginInicial = 35;

$(document).keypress(function(event){
	if(event.which == 113)	
		$("#CanoHorizontal")[0].click();
	if(event.which == 119)	
		$("#CanoVertical")[0].click();
	if(event.which == 101)	
		$("#CanoEsquerdaCima")[0].click();
	if(event.which == 114)	
		$("#CanoEsquerdaBaixo")[0].click();
	if(event.which == 116)	
		$("#CanoDireitaCima")[0].click();
	if(event.which == 121)	
		$("#CanoDireitaBaixo")[0].click();
	if(event.which == 117)	
		$("#consertar")[0].click();
	if(event.which == 105)	
		$("#prender")[0].click();
});
var gameOver = function(){
	alert("Game Over!\nPontuação Final:"+pontuacao+"\nCidade:"+nivel);
}

function ajustarNivelAgua(nivel){
	var altura = Math.floor((nivel/100) * alturaInicial);
	var margin = marginInicial + alturaInicial - altura;
	var agua = $("#agua")[0];
	agua.style.height = altura+"px";
	agua.style.marginTop = margin+"px";
}

function atualizarPontuacao(){
	$("#pontos")[0].innerHTML=pontuacao;
}

function getPreco(tipo){
	if(tipo == "CanoHorizontal" || tipo == "CanoVertical"){
			return 10;
		}


		if(tipo == "CanoEsquerdaCima" ||tipo == "CanoEsquerdaBaixo" || tipo == "CanoDireitaCima" || tipo == "CanoDireitaBaixo"){
			return 30;
		}


		if(tipo == "consertar"){
			return 500;
		}

		if(tipo == "prender"){
			return 1000;	
		}
}

var inserirCano = function(e){
	if(!canoSelecionado)
		return false;

	
	var linhaColuna = e.target.id.replace("I","").replace("C","").split("X");
	if(grade.isCelulaLivre(linhaColuna[0],linhaColuna[1])){
		grade.setCelula(linhaColuna[0],linhaColuna[1],tipoSelecionado);

		
		pontuacao = pontuacao - getPreco(tipoSelecionado);
		atualizarPontuacao();

		canoSelecionado = false;
		tipoSelecionado = null;
		$(".tipoCano").toArray().forEach(function(e){
			e.style.borderColor = "black";
		});
	}else{
		var liberou = grade.tentarLiberar(linhaColuna[0],linhaColuna[1],tipoSelecionado);
		if(liberou){
			pontuacao = pontuacao - getPreco(tipoSelecionado);
			atualizarPontuacao();
		}
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
	if(nivel < 73){
		nivel = nivel+1;
		initGame(nivel);
	}
	else
		gameOver();
}

function initGame(nivel){
	var quebrados = nivel * 2;
	if(nivel > 25)
		quebrados = 50 + nivel - 25 ;
	grade = new Grade(TAMANHO,$("#gradeGame")[0]);
	$("#cidade")[0].innerHTML = nivel;
	grade.setListener("click",inserirCano);
	$("#botaoProximo")[0].style.display = "none";
	$("#botaoResolver")[0].disabled=false;
	$("#botaoResetar")[0].disabled = false;

	grade.setOrigem(0,0);
	grade.setFim(TAMANHO-1,TAMANHO-1);
	grade.setQuebrados(Math.floor(quebrados/2));
	grade.setLadroes(Math.floor(quebrados/2));
	atualizarPontuacao();
	timer = new Timer(5,30,$("#tempo")[0],$("#percent")[0],gameOver,ajustarNivelAgua);
	timer.start();

}
function init(){
	$(".tipoCano").toArray().forEach(function(e){
		e.addEventListener("click",function(event){
			if(!jogoAtivo)
				return;
			if(getPreco(e.id) > pontuacao){
				alert("Não possui dinheiro suficiente");
				return;
			}
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
	
	pontuacao = 3000;
	nivel = 1;
	initGame(nivel);
}
