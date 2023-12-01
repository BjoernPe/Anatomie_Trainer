document.addEventListener('DOMContentLoaded', function () {
    const quizImage = document.getElementById('quiz-image');
    const quizPointsContainer = document.getElementById('quiz-points-container');
    const saveBtn = document.getElementById('save-btn');
    const deletePointsBtn = document.getElementById('delete-points-btn');
    const imageSelector = document.getElementById('image-selector');

    // Hier solltest du den Pfad zu deiner source.json anpassen
    const sourceJsonPath = './data/source.json';
    const quizJsonPath = './data/quiz.json';

    let currentImageIndex = 0;
    let quizData = [];
    let selectedImageData = null;

    // Lade die Quelldaten und setze das Bild
    loadSourceData();

    function loadSourceData() {
        fetch(sourceJsonPath)
            .then(response => response.json())
            .then(data => {
                quizData = data.bilder; // Annahme: Deine Bilder sind unter dem Schlüssel "bilder" in der JSON-Datei
                populateImageSelector();
                showImage();
            });
    }

    function populateImageSelector() {
        quizData.forEach((imageData, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.text = imageData.name; // Verwende den Namen des Bildes statt "Bild n"
            imageSelector.add(option);
        });

        // Event-Listener für die Auswahländerung im Dropdown-Menü
        imageSelector.addEventListener('change', function () {
            currentImageIndex = parseInt(imageSelector.value);
            showImage();
        });
    }

    function showImage() {
        selectedImageData = quizData[currentImageIndex];
        quizImage.src = selectedImageData.imgSrc;
        quizPointsContainer.innerHTML = ''; // Lösche vorherige Punkte

        // Füge die vorhandenen Punkte hinzu
        selectedImageData.points.forEach(point => addQuizPoint(point));
    }

    function addQuizPoint(point) {
        const pointElement = document.createElement('div');
        pointElement.className = 'quiz-point';
        pointElement.style.top = `${point.top}%`;
        pointElement.style.left = `${point.left}%`;

        // Füge die Punkte dem Container hinzu
        quizPointsContainer.appendChild(pointElement);
    }

    // Mausklick-Event, um Quiz-Punkte hinzuzufügen
    quizImage.addEventListener('click', function (event) {
        const rect = quizImage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const point = {
            top: (y / rect.height) * 100,
            left: (x / rect.width) * 100
        };

        addQuizPoint(point);
    });

    // Löschen-Button Event
    deletePointsBtn.addEventListener('click', function () {
        deleteQuizPoints();
        clearInputField();
    });


// Speichern-Button Event
saveBtn.addEventListener('click', function () {
    // Überprüfung, ob mindestens zwei Punkte gesetzt wurden und das Eingabefeld nicht leer ist
    const quizPoints = getQuizPoints();
    const questionInputValue = document.getElementById('questionInput').value;

    if (quizPoints.length < 2 || questionInputValue.trim() === '') {
        showAlert('Bitte mindestens zwei Punkte setzen und eine Frage eingeben.', 'danger');
        return; // Stoppe die Ausführung, da die Bedingung nicht erfüllt ist
    }

    // Hier werden die Daten im gewünschten Format erstellt
    const savedData = {
        url: selectedImageData.imgSrc,
        frage: questionInputValue,
        punkte: quizPoints
    };

    // Hier erfolgt der Fetch-Request zum Speichern der Daten
    fetch('http://localhost:3000/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(savedData)
    })
    .then(response => {
        if (response.ok) {
            showAlert('Daten erfolgreich gespeichert.', 'success');
            console.log(savedData);
        } else {
            showAlert('Fehler beim Speichern der Daten. Bitte versuche es erneut.', 'danger');
        }
    })
    .catch(error => {
        showAlert('Fehler beim Senden der Daten an den Server: ' + error.message, 'danger');
    });
});



// Funktion zum Anzeigen des Bootstrap-Alerts
function showAlert(message, alertType) {
    const alertContainer = document.getElementById('alert-container');

    // Erstelle das Alert-Element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alertType} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        <strong>${alertType === 'success' ? 'Erfolg:' : 'Fehler:'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Füge das Alert-Element dem Container hinzu
    alertContainer.innerHTML = ''; // Lösche vorherige Alerts
    alertContainer.appendChild(alertElement);

    // Automatisches Schließen des Alerts nach 5 Sekunden
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

    // Hilfsfunktion, um Quiz-Punkte in Prozentkoordinaten zu erhalten
    function getQuizPoints() {
        const points = Array.from(document.querySelectorAll('.quiz-point'));
        return points.map(point => ({
            top: parseFloat(point.style.top),
            left: parseFloat(point.style.left)
        }));
    }

    // Funktion zum Löschen der Quiz-Punkte
    function deleteQuizPoints() {
        quizPointsContainer.innerHTML = ''; // Lösche alle Punkte
    }

    // Funktion zum Leeren des Eingabefelds
    function clearInputField() {
        document.getElementById('questionInput').value = ''; // Leere das Eingabefeld
    }
});
