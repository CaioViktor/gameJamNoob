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
				jQuery("<td/>",{'id':idCelula,'text':idCelula}).appendTo("#"+idLinha);
				var celulaTabela = $("#"+idCelula)[0];
				
				this.celulas[linha][coluna] = new Celula(linha,coluna,this,celulaTabela);
			}
		}
	}

	getCelula(x,y){
		return this.celulas[x][y];
	}

	setOrigem(x,y){
		this.celulas[x][y].cano = new CanoOrigem(celulas[x][y],"origem1");
		this.origem = this.celulas[x][y];
	}

	setFim(x,y){
		this.celulas[x][y].cano = new CanoFim(celulas[x][y],"fim1");
		this.fim = this.celulas[x][y];
	}

	inicializarNos(){
		for(linha = 0 ; linha < this.tamanho ; linha++){
			for(coluna = 0 ; coluna < this.tamanho ; coluna++){
				this.celulas[linha][coluna].estado = 0;
				this.celulas[linha][coluna].pai = null;
			}
		}
	}

	acharCaminho(partida,chegada){
		inicializarNos();
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
	constructor(celula,id){
		this.celula = celula;
		this.srcImagem = null;
		this.id = id;
		this.possiveisVizinhos = null;
		calcularPossiveisVizinhos();
	}

	calcularPossiveisVizinhos(){
		return null;
	}

	alocarVizinhos(){
		for(let possivelVizinho of this.possiveisVizinhos){
			if(possivelVizinho.cano.possiveisVizinhos.has(this)){
				this.visinhos.add(possivelVizinho);
				possivelVizinho.visinhos.add(this);
			}
		}
	}
}
class CanoQuebrado extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/quebrado.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
	}
}

class PontoEspecial extends Cano{
	constructor(celula,id){
		super(celula,id);
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((x + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
		if((y + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
		if((x-1) >= 0 && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y-1));		
		if((x+1) <= tamanho && (y+1) <= tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y+1));
		if( (x+1) <= tamanho && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y-1));		
		if((x-1) >= 0 && (y+1) <= tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y+1));	
	}
}
class CanoOrigem extends PontoEspecial{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/origem.png";
	}
}
class CanoFim extends PontoEspecial{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/fim.png";
	}
}
class CanoHorizontal extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/horizontal.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((x + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
	}
}

class CanoVertical extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/vertical.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;

		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
		if((y + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
	}
}

class CanoEsquerdaCima extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/esquerdaCima.png";
	}
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
}

class CanoEsquerdaBaixo extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/esquerdaBaixo.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x-1,y));
		if((y + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
	}
}

class CanoDireitaCima extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/direitaCima.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
		if((y - 1) >= 0)
			this.possiveisVizinhos.add(grade.getCelula(x,y-1));
	}
}

class CanoDireitaBaixo extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/direitaBaixo.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x+1,y));
		if((y + 1) <= tamanho)
			this.possiveisVizinhos.add(grade.getCelula(x,y+1));
	}
}

class CanoDiagonalSupEsInfDi extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/diagonalSupesInfdir.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if((x-1) >= 0 && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y-1));		
		if((x+1) <= tamanho && (y+1) <= tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y+1));		
	}
}

class CanoDiagonalSupDiInfEs extends Cano{
	constructor(celula,id){
		super(celula,id);
		this.this.srcImagem = "static/images/diagonalSupdirInfes.png";
	}
	calcularPossiveisVizinhos(){
		this.possiveisVizinhos = new Set();
		var x = this.celula.x;
		var y = this.celula.y;
		var tamanho= this.celula.grade.tamanho;
		var grade = this.celula.grade;
		
		if( (x+1) <= tamanho && (y-1) >= 0 )
			this.possiveisVizinhos.add(grade.getCelula(x+1,y-1));		
		if((x-1) >= 0 && (y+1) <= tamanho )
			this.possiveisVizinhos.add(grade.getCelula(x-1,y+1));		
	}
}



