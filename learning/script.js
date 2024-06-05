document.addEventListener("DOMContentLoaded", function() {
    const translateForm = document.getElementById('translatedForm');
    const phraseInput = document.getElementById('phraseInput');
    const translatedText = document.getElementById('translatedText');
    const examplesDiv = document.getElementById('examples');
    const result = document.getElementById("result");
    const sound = document.getElementById('sound');
    const GOOGLE_API_KEY = 'AIzaSyA2SM3oJkNaFiAVIFrl9HhF1HFpd-Qxbhs'; // Substitua pelo seu Google API Key

    if (!translateForm || !phraseInput || !translatedText || !examplesDiv || !result || !sound) {
        console.error('Um ou mais elementos não foram encontrados no DOM.');
        return;
    }

    translateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const phrase = phraseInput.value;

        // Limpar resultados anteriores
        translatedText.textContent = '';
        examplesDiv.innerHTML = '';
        result.innerHTML = '';

        try {
            const translatedPhrase = await translatePhrase(phrase);
            translatedText.textContent = `English: ${translatedPhrase}`;

            try {
                // Executar ambas as chamadas de API em paralelo
                const [dictionaryData, relatedWords] = await Promise.all([
                    fetchDictionaryData(translatedPhrase),
                    requestDatamuse(translatedPhrase)
                ]);

                displayDictionaryData(dictionaryData);
                displayExamples(relatedWords);
            } catch (innerError) {
                console.error('Erro ao buscar detalhes do dicionário ou palavras relacionadas:', innerError);
                result.textContent = 'Palavra(s) não encontrada(s).';
                // Mesmo se ocorrer um erro ao buscar detalhes ou exemplos, exibimos a tradução
                examplesDiv.innerHTML = ''; // Limpa exemplos anteriores
                const exampleElement = document.createElement('p');
                exampleElement.textContent = `Palavras relacionadas: Nenhuma palavra encontrada.`;
                examplesDiv.appendChild(exampleElement);
            }

        } catch (error) {
            console.error('Erro ao obter tradução ou exemplos:', error);
            translatedText.textContent = 'Erro ao obter tradução.';
        }
    });

    async function translatePhrase(phrase) {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: phrase,
                source: 'pt',
                target: 'en',
                format: 'text'
            })
        });

        const data = await response.json();
        if (!data.data.translations || data.data.translations.length === 0) {
            throw new Error('Falha na tradução');
        }
        return data.data.translations[0].translatedText;
    }

    async function fetchDictionaryData(word) {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Palavra(s) não encontrada(s)');
        }

        return response.json();
    }

    function displayDictionaryData(data) {
        let phonetic = data[0].phonetics.find(p => p.audio);
        result.innerHTML = `
            <div class="word">
                <h3>${data[0].word}</h3>
                <button onclick="playSound()" ${phonetic ? "" : "disabled"}>
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="details">
                <p>${data[0].meanings[0].partOfSpeech}</p>
                <p>/${data[0].phonetic || phonetic?.text || ""}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>`;
        
        // Mostrar todos os significados e exemplos
        data[0].meanings.forEach(meaning => {
            meaning.definitions.forEach(definition => {
                result.innerHTML += `
                    <p class="word-example">${definition.example || ''}</p>`;
            });
        });

        if (phonetic && phonetic.audio) {
            sound.setAttribute("src", phonetic.audio);
        } else {
            sound.removeAttribute("src");
        }
    }

    async function requestDatamuse(phrase) {
        const url = `https://api.datamuse.com/words?ml=${phrase}&max=6`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Nenhum exemplo encontrado');
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('Nenhum exemplo encontrado');
        }
        return data;
    }

    function displayExamples(data) {
        examplesDiv.innerHTML = ''; // Limpa exemplos anteriores
        const exampleElement = document.createElement('p');
        exampleElement.textContent = `Palavras relacionadas: ${data.map(word => word.word).join(', ')}`;
        examplesDiv.appendChild(exampleElement);
    }

    window.playSound = function() {
        if (sound.getAttribute("src")) {
            sound.play();
        }
    }
});

window.onclick = function (event) {
    if (event.target == document.getElementById("infoModal")) {
      document.getElementById("infoModal").style.display = "none";
    }
  };
  