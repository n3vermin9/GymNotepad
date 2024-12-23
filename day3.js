let exerciseCount = 0; // Count of total exercises
const currentDay = 'day3';  // Change this for different days: 'day1', 'day2', 'day3'

// Define the exercise groups
const groups = {
    "Group A": { count: 0, element: createGroupElement("Group A") },
    "Group B": { count: 0, element: createGroupElement("Group B") }
};

// Store the current exercise being edited
let currentExercise = null;

// Append the groups to the exercise list
document.getElementById('exerciseList').appendChild(groups["Group A"].element);
document.getElementById('exerciseList').appendChild(groups["Group B"].element);

// Load exercises for the current day from localStorage
loadExercises();

// Add event listener for the exercise form submission
document.getElementById('exerciseForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const exerciseName = event.target[0].value; // Get exercise name
    const reps = event.target[1].value; // Get reps
    const weight = event.target[2].value; // Get weight
    const groupName = event.target[3].value; // Get selected group name from dropdown

    addExercise(exerciseName, reps, weight, groupName); // Add exercise as a card
    event.target.reset(); // Clear the form inputs
});

function addExercise(name, reps, weight, groupName) {
    const exerciseCard = document.createElement('div');
    exerciseCard.classList.add('exercise-card');

    exerciseCard.innerHTML = `
        <div class="exercise-info">
            <h3>${name}</h3>
            <p>Reps: <span class="reps">${reps}</span></p>
            <p>Weight: <span class="weight">${weight} kg</span></p>
        </div>
        <div class="exercise-actions">
            <button onclick="openEditModal(this)">Edit</button>
            <button onclick="deleteExercise(this)">Delete</button>
        </div>
    `;

    groups[groupName].element.querySelector('.exercise-cards').appendChild(exerciseCard);
    groups[groupName].count++;
    exerciseCount++;

    saveExercises(); // Save the exercises to localStorage
}

function createGroupElement(groupName) {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('exercise-group');
    const groupTitle = document.createElement('h2');
    groupTitle.textContent = groupName;
    const exerciseCards = document.createElement('div');
    exerciseCards.classList.add('exercise-cards');
    groupDiv.appendChild(groupTitle);
    groupDiv.appendChild(exerciseCards);
    return groupDiv;
}

function deleteExercise(button) {
    const exerciseCard = button.parentElement.parentElement;
    exerciseCard.remove();
    saveExercises(); // Save the updated list
}

function loadExercises() {
    const savedExercises = JSON.parse(localStorage.getItem(`exercises${currentDay}`)) || [];
    savedExercises.forEach(exercise => {
        addExercise(exercise.name, exercise.reps, exercise.weight, exercise.groupName);
    });
}

function saveExercises() {
    const exercises = [];
    for (const groupName in groups) {
        const exerciseCards = groups[groupName].element.querySelector('.exercise-cards').children;
        Array.from(exerciseCards).forEach(card => {
            const name = card.querySelector('.exercise-info h3').textContent;
            const reps = card.querySelector('.reps').textContent;
            const weight = card.querySelector('.weight').textContent.replace(' kg', '');
            exercises.push({ name, reps, weight, groupName });
        });
    }
    localStorage.setItem(`exercises${currentDay}`, JSON.stringify(exercises)); // Save using the current day's key
}

function openEditModal(button) {
    const exerciseCard = button.parentElement.parentElement;
    currentExercise = exerciseCard;

    // Get values from the card to populate the modal
    document.getElementById('modalExerciseName').value = exerciseCard.querySelector('.exercise-info h3').textContent;
    document.getElementById('modalReps').value = exerciseCard.querySelector('.reps').textContent;
    document.getElementById('modalWeight').value = exerciseCard.querySelector('.weight').textContent.replace(' kg', '');

    // Show the modal
    const modal = document.getElementById('editModal');
    modal.style.display = "block";
}

// Close the modal when the close button is clicked
document.getElementsByClassName("close")[0].onclick = function() {
    const modal = document.getElementById('editModal');
    modal.style.display = "none";
}

// Close modal click outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Handle saving changes in the modal
document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from the modal inputs
    const newExerciseName = document.getElementById('modalExerciseName').value;
    const newReps = document.getElementById('modalReps').value;
    const newWeight = document.getElementById('modalWeight').value;

    // Update the values in the exercise card
    currentExercise.querySelector('.exercise-info h3').textContent = newExerciseName;
    currentExercise.querySelector('.reps').textContent = newReps;
    currentExercise.querySelector('.weight').textContent = `${newWeight} kg`;

    // Close the modal
    document.getElementById('editModal').style.display = "none";
    saveExercises(); // Save the updated list
});