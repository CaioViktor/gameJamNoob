class Celula{
	constructor(x,y,grade,celulaTabela){
		this.x = x;
		this.y = y;
		this.grade = grade;
		this.cano = null;
		this.celulaTabela = celulaTabela;
		this.visinhos = new Set();

		//variáveis do algoritmo de busca
		this.estado = 0;//0 - não visitado;1 - na fila; 2- visitado
		this.pai = null;

	}

	setCano(tipo){
		var cano = null;
		if(tipo == "CanoHorizontal"){
			cano = new CanoHorizontal(this,this.x+","+this.y);
		}

		if(tipo == "CanoVertical"){
			cano = new CanoVertical(this,this.x+","+this.y);
		}

		if(tipo == "CanoEsquerdaCima"){
			cano = new CanoEsquerdaCima(this,this.x+","+this.y);
		}

		if(tipo == "CanoEsquerdaBaixo"){
			cano = new CanoEsquerdaBaixo(this,this.x+","+this.y);
		}

		if(tipo == "CanoDireitaCima"){
			cano = new CanoDireitaCima(this,this.x+","+this.y);
		}

		if(tipo == "CanoDireitaBaixo"){
			cano = new CanoDireitaBaixo(this,this.x+","+this.y);
		}

		if(tipo == "CanoDiagonalSupEsInfDi"){
			cano = new CanoDiagonalSupEsInfDi(this,this.x+","+this.y);
		}

		if(tipo == "CanoDiagonalSupDiInfEs"){
			cano = new CanoDiagonalSupDiInfEs(this,this.x+","+this.y);
		}
		this.cano = cano;
		jQuery("<img/>",{'src':cano.srcImagem,'class':'canoTabuleiro'}).appendTo(this.celulaTabela);
		this.cano.alocarVizinhos();
	}

}

class Grade{
	constructor(tamanho,tabela){
		this.tamanho = tamanho;
		this.origem = null;
		this.fim = null;
		this.tabela = tabela;
		this.celulas = new Array(tamanho);

		for(var linha = 0 ; linha < tamanho ; linha++){
			this.celulas[linha] = new Array(tamanho);
			
			var idLinha = "L"+linha;
			jQuery("<tr/>",{'id':idLinha}).appendTo(tabela);

			for(var coluna = 0 ; coluna < tamanho ; coluna++){
				
				var idCelula = "C"+linha+"X"+coluna;
				jQuery("<td/>",{'id':idCelula}).appendTo("#"+idLinha);
				var celulaTabela = $("#"+idCelula)[0];
				
				this.celulas[linha][coluna] = new Celula(linha,coluna,this,celulaTabela);
			}
		}
	}

	isCelulaLivre(x,y){
		return this.celulas[x][y].cano == null;
	}

	getCelula(x,y){
		return this.celulas[x][y];
	}

	setOrigem(x,y){
		this.celulas[x][y].cano = new CanoOrigem(this.celulas[x][y],"origem1");
		this.origem = this.celulas[x][y];
		jQuery("<img/>",{'src':this.origem.cano.srcImagem,'class':'canoTabuleiro'}).appendTo(this.origem.celulaTabela);
	}

	setFim(x,y){
		this.celulas[x][y].cano = new CanoFim(this.celulas[x][y],"fim1");
		this.fim = this.celulas[x][y];
		jQuery("<img/>",{'src':this.fim.cano.srcImagem,'class':'canoTabuleiro'}).appendTo(this.fim.celulaTabela);
	}

	setCelula(x,y,tipo){
		this.celulas[x][y].setCano(tipo);
	}

	inicializarNos(){
		for(var linha = 0 ; linha < this.tamanho ; linha++){
			for(var coluna = 0 ; coluna < this.tamanho ; coluna++){
				this.celulas[linha][coluna].estado = 0;
				this.celulas[linha][coluna].pai = null;
			}
		}
	}

	setListener(event,func){
		for(var linha = 0 ; linha < this.tamanho ; linha++){
			for(var coluna = 0 ; coluna < this.tamanho ; coluna++){
				this.celulas[linha][coluna].celulaTabela.addEventListener(event,func);
			}
		}
	}

	acharCaminho(partida,chegada){
		this.inicializarNos();
		var proximos = new Array();


		var atual = partida;
		while(true){
			atual.estado = 2;
			if(atual == chegada)
				return atual;
			for(let visinho of atual.visinhos){
				if(visinho.estado  == 0){
					visinho.estado = 1;
					visinho.pai = atual;
					proximos.push(visinho);
				}
			}
			if(proximos.length <= 0)
				return null;
			atual = proximos.shift();
		}

	}
}

class Cano{
	calcularPossiveisVizinhos(){
		return null;
	}
	constructor(celula,id){
		this.celula = celula;
		this.srcImagem = null;
		this.id = id;
		this.possiveisVizinhos = null;
		this.calcularPossiveisVizinhos();
	}


	alocarVizinhos(){
		for(let possivelVizinho of this.possiveisVizinhos){
			if(possivelVizinho.cano != null && possivelVizinho.cano.possiveisVizinhos.has(this.celula)){
				this.celula.visinhos.add(possivelVizinho);
				possivelVizinho.visinhos.add(this.celula);
			}
		}
	}
}
class CanoQuebrado extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/quebrado.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
	}
}

class PontoEspecial extends Cano{
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((x + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
		if((y + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
		if((x-1) >= 0 && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y-1));		
		if((x+1) < tamanho && (y+1) < tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y+1));
		if( (x+1) < tamanho && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y-1));		
		if((x-1) >= 0 && (y+1) < tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y+1));	
	}
	constructor(celula,id){
		super(celula,id);
	}
}
class CanoOrigem extends PontoEspecial{
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/origem.png";
	}
}
class CanoFim extends PontoEspecial{
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/fim.png";
	}
}
class CanoHorizontal extends Cano{
	
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;

		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
		if((y + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
	}
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/horizontal.png";
	}
}

class CanoVertical extends Cano{
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((x + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
	}
	
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/vertical.png";
	}
}

class CanoEsquerdaCima extends Cano{
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;

		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
	}
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/esquerdaCima.png";
	}
}

class CanoEsquerdaBaixo extends Cano{
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
	}
	
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/esquerdaBaixo.png";
	}
}

class CanoDireitaCima extends Cano{
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((y + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
	}
	
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/direitaCima.png";
	}
}

class CanoDireitaBaixo extends Cano{
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
		if((y + 1) < tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
	}
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/direitaBaixo.png";
	}
}

class CanoDiagonalSupEsInfDi extends Cano{
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x-1) >= 0 && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y-1));		
		if((x+1) < tamanho && (y+1) < tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y+1));		
	}
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/diagonalSupesInfdir.png";
	}
}

class CanoDiagonalSupDiInfEs extends Cano{
	
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if( (x+1) < tamanho && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y-1));		
		if((x-1) >= 0 && (y+1) < tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y+1));		
	}
	constructor(celula,id){
		super(celula,id);
		this.srcImagem = "static/images/diagonalSupdirInfes.png";
	}
}






class Timer{
	stop(){
		clearTimeout(this.timerCont);
	}

	toString(){
		var minutos = Math.floor(this.time / 60);
		var segundos = this.time % 60;
		return minutos+":"+segundos;
	}

	getPercente(){
		return Math.floor(100* (this.time)/this.timeInicio);
	}

	constructor(minutos,segundos,tempo,percent,gameOver){
		this.time = (60 * minutos) + (segundos);
		this.timeInicio = this.time;
		this.timerCont = null;
		this.tempo = tempo;
		this.percent = percent;
		this.gameOver = gameOver;
		this.tempo.innerHTML = this.toString();
		this.percent.innerHTML = this.getPercente()+"%";
	}
	start(){
		var timer = this;
		this.timerCont = setInterval(function(){
			
			timer.time = timer.time - 1;
			timer.tempo.innerHTML = timer.toString();
			timer.percent.innerHTML = timer.getPercente()+"%";
			if(timer.time <= 0 ){
				timer.gameOver();
				timer.stop();
			}
		}, 1000);
	}

	

}