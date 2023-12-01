// quiz.js

// Lade die JSON-Datei und setze die Quiz-Punkte
fetch('./data/quiz.json') // Passe den Pfad entsprechend an
    .then(response => response.json())
    .then(data => setQuizData(data));

function setQuizData(data) {
    const quizPointsContainer = document.getElementById('quiz-points-container');
    const quizQuestionElement = document.getElementById('quiz-question');
    const alertContainer = document.getElementById('alert-container');

    let currentQuestionIndex = 0;

    loadQuestion();

    function loadQuestion() {
        const currentQuestion = data.bilder[currentQuestionIndex];

        if (currentQuestion) {
            const imageUrl = currentQuestion.url;
            const quizPoints = currentQuestion.punkte;
            const quizQuestion = currentQuestion.frage;

            // Setze das Bild
            const imageElement = new Image();
            imageElement.src = imageUrl;
            imageElement.alt = 'Bild für das Quiz';
            imageElement.className = 'img-fluid';
            quizPointsContainer.innerHTML = ''; // Lösche vorherige Punkte
            quizPointsContainer.appendChild(imageElement);

            // Setze die Quiz-Punkte entsprechend den Koordinaten
            quizPoints.forEach((punkt, index) => {
                const quizPointElement = document.createElement('div');
                quizPointElement.className = 'quiz-point';
                quizPointElement.style.top = `${punkt.top}%`;
                quizPointElement.style.left = `${punkt.left}%`;

                // Prüfe, ob es sich um den korrekten Punkt handelt
                const correctAnswer = index === 0;
                quizPointElement.onclick = () => antwortPrüfen(correctAnswer);
                
                quizPointsContainer.appendChild(quizPointElement);
            });

            // Setze die Frage
            quizQuestionElement.textContent = quizQuestion;
        } else {
            // Alle Fragen wurden beantwortet
            alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show alert-sm" role="alert">
                    Glückwunsch! Du hast alle Fragen beantwortet.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="restartQuiz()"></button>
                </div>
            `;
        }
    }

    function antwortPrüfen(istKorrekt) {
        // Hier kannst du die Logik für die Überprüfung der Antworten implementieren
        // Zum Beispiel eine Bootstrap Alert-Meldung anzeigen:
        alertContainer.innerHTML = `
            <div class="alert ${istKorrekt ? 'alert-success' : 'alert-danger'} alert-dismissible fade show alert-sm" role="alert">
                ${istKorrekt ? 'Richtig! Das ist die korrekte Antwort.' : 'Leider falsch. Bitte versuche es erneut.'}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="loadNextQuestion()"></button>
            </div>
        `;
    }

    window.loadNextQuestion = function() {
        currentQuestionIndex++;
        if (currentQuestionIndex >= data.bilder.length) {
            // Alle Fragen wurden durchlaufen, setze den Index zurück
            currentQuestionIndex = 0;
        }
        loadQuestion();
    };

    window.restartQuiz = function() {
        // Setze den Index zurück und lade die erste Frage
        currentQuestionIndex = 0;
        loadQuestion();
    };
}
