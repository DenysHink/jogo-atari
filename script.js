const canvas = document.getElementById('JogoCanvas')
const ctx = canvas.getContext('2d')


class Entidade{
    constructor(x,y,largura,altura,cor){
        this.x = x,
        this.y = y,
        this.largura = largura,
        this.altura = altura,
        this.cor = cor
    }
    desenhar(){
        ctx.fillStyle = this.cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

const alien1 = new Entidade(350, 0, 50, 50, 'green')
const objeto_na_tela = new Entidade(350,350,50,50,'red')



function loop(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    objeto_na_tela.desenhar()
    alien1.desenhar()
 
    //inserir as funções de desenhar, atualizar, colisão aqui
    requestAnimationFrame(loop)
}
loop()
