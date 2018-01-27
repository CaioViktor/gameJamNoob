class Celula{
	constructor(x,y,grade){
		this.x = x;
		this.y = y;
		this.grade = grade;
		this.cano = null;
		this.visinhos = new Set();

		//variáveis do algoritmo de busca
		this.estado = 0;//0 - não visitado;1 - visitado
		this.pai = null;

	}

}

class Grade{
	constructor(tamanho){
		this.tamanho = tamanho;
		this.celulas = new Array(tamanho);
		for(linha = 0 ; linha < tamanho ; linha++){
			this.celulas[linha] = new Array(tamanho);
			for(coluna = 0 ; coluna < tamanho ; coluna++){
				this.celulas[linha][coluna] = new Celula(linha,coluna,this);
			}
		}
	}
	getCelula(x,y){
		return this.celulas[x][y];
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



