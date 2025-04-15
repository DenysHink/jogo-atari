const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

const imagemAlien = new Image();
imagemAlien.src = 'alien.png';

const imagemJogador = new Image();
imagemJogador.src = 'foguete.jpg'; 

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    colideCom(outro) {
        return (
            this.x < outro.x + outro.largura &&
            this.x + this.largura > outro.x &&
            this.y < outro.y + outro.altura &&
            this.y + this.altura > outro.y
        );
    }
}

class Jogador extends Entidade {
    constructor(x, y) {
        super(x, y, 50, 30, 'blue');
        this.velocidade = 5;
        this.direcao = 0;
    }

    mover() {
        this.x += this.velocidade * this.direcao;
        if (this.x < 0) this.x = 0;
        if (this.x + this.largura > canvas.width) this.x = canvas.width - this.largura;
    }

    desenhar() {
        ctx.drawImage(imagemJogador, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.mover();
        this.desenhar();
    }
}

class Projétil extends Entidade {
    constructor(x, y) {
        super(x, y, 5, 10, 'yellow');
        this.velocidade = 6;
    }

    atualizar() {
        this.y -= this.velocidade;
        this.desenhar();
    }
}

class Alien extends Entidade {
    constructor(x, y) {
        super(x, y, 40, 30, 'green');
        this.velocidade = 2;
    }

    atualizar() {
        this.y += this.velocidade;
        ctx.drawImage(imagemAlien, this.x, this.y, this.largura, this.altura);
    }
}

const jogador = new Jogador(375, 350);
const projeteis = [];
const aliens = [];
let pontuacao = 0;
let gameOver = false;

let atirando = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') jogador.direcao = -1;
    if (e.key === 'ArrowRight' || e.key === 'd') jogador.direcao = 1;
    if ((e.key === ' ' || e.key === 'Spacebar') && !gameOver && !atirando) {
        atirando = true;
        dispararTiros();  
    }
    if (gameOver && e.key === 'Enter') {
        reiniciarJogo();
    }
});

document.addEventListener('keyup', (e) => {
    if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'a' ||
        e.key === 'd'
    ) {
        jogador.direcao = 0;
    }
    if (e.key === ' ' || e.key === 'Spacebar') {
        atirando = false;
    }
});

function dispararTiros() {
    if (!gameOver && atirando) {
        projeteis.push(new Projétil(jogador.x + jogador.largura / 2 - 2.5, jogador.y));
        setTimeout(dispararTiros, 100); 
    }
}

function criarAlien() {
    if (!gameOver) {
        const x = Math.random() * (canvas.width - 40);
        aliens.push(new Alien(x, 0));
    }
}
setInterval(criarAlien, 1000);

function reiniciarJogo() {
    projeteis.length = 0;
    aliens.length = 0;
    pontuacao = 0;
    gameOver = false;
    jogador.x = 375;
    loop();
}

function loop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Pontuação: ' + pontuacao, 200, 200);
        ctx.font = '16px Arial';
        ctx.fillText('Reiniciando em 3 segundos... ou aperte Enter', 230, 240);

        setTimeout(() => {
            if (gameOver) reiniciarJogo();
        }, 3000);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    jogador.atualizar();

    for (let i = projeteis.length - 1; i >= 0; i--) {
        projeteis[i].atualizar();
        if (projeteis[i].y < 0) projeteis.splice(i, 1);
    }

    for (let i = aliens.length - 1; i >= 0; i--) {
        const alien = aliens[i];
        alien.atualizar();

        if (alien.y + alien.altura >= canvas.height || alien.colideCom(jogador)) {
            gameOver = true;
        }

        for (let j = projeteis.length - 1; j >= 0; j--) {
            if (projeteis[j].colideCom(alien)) {
                aliens.splice(i, 1);
                projeteis.splice(j, 1);
                pontuacao++;
                break;
            }
        }
    }

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + pontuacao, 10, 20);

    requestAnimationFrame(loop);
}
loop();