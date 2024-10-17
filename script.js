document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si on est sur la page index.html pour exécuter le script du calculateur
    if (document.getElementById('triathlon-size')) {
        // Obtenir les éléments du DOM
        const triathlonSizeSelect = document.getElementById('triathlon-size');
        const swimPaceMinInput = document.getElementById('swim-pace-min');
        const swimPaceSecInput = document.getElementById('swim-pace-sec');
        const t1MinInput = document.getElementById('t1-min');
        const t1SecInput = document.getElementById('t1-sec');
        const bikePaceInput = document.getElementById('bike-pace');
        const t2MinInput = document.getElementById('t2-min');
        const t2SecInput = document.getElementById('t2-sec');
        const runPaceMinInput = document.getElementById('run-pace-min');
        const runPaceSecInput = document.getElementById('run-pace-sec');
        const durabilityGauge = document.getElementById('durability-gauge');
        const totalTimeDisplay = document.getElementById('total-time');
        const swimTimeDisplay = document.getElementById('swim-time');
        const t1TimeDisplay = document.getElementById('t1-time');
        const bikeTimeDisplay = document.getElementById('bike-time');
        const t2TimeDisplay = document.getElementById('t2-time');
        const runTimeDisplay = document.getElementById('run-time');

        let swimDistance = 750; // mètres
        let bikeDistance = 20;  // kilomètres
        let runDistance = 5;    // kilomètres

        // Mettre à jour les distances en fonction de la taille du triathlon
        triathlonSizeSelect.addEventListener('change', updateDistances);

        function updateDistances() {
            const size = triathlonSizeSelect.value;
            switch (size) {
                case 'S': // Sprint
                    swimDistance = 750;
                    bikeDistance = 20;
                    runDistance = 5;
                    break;
                case 'M': // Olympique
                    swimDistance = 1500;
                    bikeDistance = 40;
                    runDistance = 10;
                    break;
                case 'L': // Half Ironman
                    swimDistance = 1900;
                    bikeDistance = 90;
                    runDistance = 21.1;
                    break;
                case 'XL': // Ironman
                    swimDistance = 3800;
                    bikeDistance = 180;
                    runDistance = 42.2;
                    break;
                default:
                    swimDistance = 750;
                    bikeDistance = 20;
                    runDistance = 5;
            }
            // Mettre à jour les calculs lorsque la distance change
            calculateTimes();
        }

        // Écouteurs d'événements pour les changements d'entrée
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', validateTimeInput);
        });

        function validateTimeInput(e) {
            let value = e.target.value.replace(',', '.');
            if (e.target.id !== 'bike-pace') {
                value = parseInt(value) || 0;
                if (value < 0) value = 0;
                if (value > 59) value = 59;
                e.target.value = value;
            } else {
                value = parseFloat(value) || 0;
                if (value < 1) value = 1;
                e.target.value = value;
            }
            calculateTimes();
        }

        // Calculer les temps
        function calculateTimes() {
            const swimPaceMin = parseInt(swimPaceMinInput.value) || 0;
            const swimPaceSec = parseInt(swimPaceSecInput.value) || 0;
            const t1Min = parseInt(t1MinInput.value) || 0;
            const t1Sec = parseInt(t1SecInput.value) || 0;
            let bikePace = bikePaceInput.value.replace(',', '.');
            bikePace = parseFloat(bikePace) || 0;
            const t2Min = parseInt(t2MinInput.value) || 0;
            const t2Sec = parseInt(t2SecInput.value) || 0;
            const runPaceMin = parseInt(runPaceMinInput.value) || 0;
            const runPaceSec = parseInt(runPaceSecInput.value) || 0;

            // Vérifier si tous les rythmes sont saisis
            if ((swimPaceMin === 0 && swimPaceSec === 0) || bikePace === 0 || (runPaceMin === 0 && runPaceSec === 0)) {
                totalTimeDisplay.textContent = 'Veuillez entrer tous les rythmes.';
                return;
            }

            // Calculer les rythmes en minutes décimales
            const swimPace = swimPaceMin + (swimPaceSec / 60); // min par 100m
            const t1Time = t1Min + (t1Sec / 60);              // Temps en minutes
            const t2Time = t2Min + (t2Sec / 60);              // Temps en minutes
            const runPace = runPaceMin + (runPaceSec / 60);    // min par km

            // Calculer les temps pour chaque discipline
            const swimTime = (swimDistance / 100) * swimPace; // Temps en minutes
            const bikeTime = (bikeDistance / bikePace) * 60;  // Temps en minutes
            const runTime = runDistance * runPace;            // Temps en minutes

            // Afficher les temps par discipline
            swimTimeDisplay.textContent = formatTime(swimTime);
            t1TimeDisplay.textContent = formatTime(t1Time);
            bikeTimeDisplay.textContent = formatTime(bikeTime);
            t2TimeDisplay.textContent = formatTime(t2Time);
            runTimeDisplay.textContent = formatTime(runTime);

            const totalTime = swimTime + t1Time + bikeTime + t2Time + runTime;

            // Afficher le temps total
            totalTimeDisplay.textContent = formatTime(totalTime);

            // Mettre à jour la durabilité
            updateDurability(swimPace, bikePace, runPace);
        }

        function formatTime(timeInMinutes) {
            const hours = Math.floor(timeInMinutes / 60);
            const minutes = Math.floor(timeInMinutes % 60);
            const seconds = Math.round((timeInMinutes - Math.floor(timeInMinutes)) * 60);
            return `${hours}h ${minutes}m ${seconds}s`;
        }

        // Mettre à jour la durabilité
        function updateDurability(swimPace, bikePace, runPace) {
            let durability = 100;

            // Logique simplifiée pour calculer la durabilité
            durability -= (swimPace * swimDistance) / 100;    // Influence de la natation
            durability -= (bikeDistance / bikePace) * 2;      // Influence du vélo
            durability -= (runPace * runDistance) / 10;       // Influence de la course

            // Limiter la durabilité entre 0 et 100
            durability = Math.max(0, Math.min(100, durability));

            durabilityGauge.value = durability;
        }

        // Initialiser les distances et calculer les temps au chargement
        updateDistances();
    }

    // Gestion du mode nuit/jour
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);

        // Vérifier le thème actuel stocké dans le localStorage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    }

    // Fonction pour copier le code de l'iframe
    function copyEmbedCode(e) {
        e.preventDefault(); // Empêcher le comportement par défaut du lien
        const embedCode = '<iframe src="https://triathlon-runest.vercel.app/" width="100%" height="800px" frameborder="0"></iframe>';
        navigator.clipboard.writeText(embedCode).then(() => {
            const copyMessage = document.getElementById('copy-message');
            copyMessage.style.display = 'block';
            setTimeout(() => {
                copyMessage.style.display = 'none';
            }, 2000);
        });
    }

    // Ajouter un écouteur d'événement au bouton
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.addEventListener('click', copyEmbedCode);
    }
});
