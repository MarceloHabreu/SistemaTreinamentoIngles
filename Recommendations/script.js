// Função para animar a frase
const animatedText = document.querySelector('.animated-text');
const text = animatedText.textContent;
let index = 0;

function showText() {
    if (index < text.length) {
        animatedText.textContent += text.charAt(index);
        index++;
        setTimeout(showText, 150);
    } else {
        setTimeout(hideText, 2000);
    }
}

function hideText() {
    if (index >= 0) {
        animatedText.textContent = text.substring(0, index);
        index--;
        setTimeout(hideText, 150);
    } else {
        setTimeout(showText, 2000);
    }
}

showText();