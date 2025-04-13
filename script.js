let incidents = [];

window.onload = function() {
    loadIncidents();
};

// Load incidents from a local array (no persistence in this version)
function loadIncidents() {
    const container = document.getElementById('incident-list');
    container.innerHTML = '';

    incidents.forEach((incident, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>ID ${index + 1}</strong>: ${incident.description}<br>
            <em>Officers:</em> ${incident.officers.join(', ') || 'None'}<br>
            <em>People:</em> ${incident.profiles.people.join(', ') || 'None'}<br>
            <em>Plates:</em> ${incident.profiles.plates.join(', ') || 'None'}
        `;

        // Add buttons for each incident
        const btnContainer = document.createElement('div');
        btnContainer.innerHTML = `
            <button class="green-btn" onclick="updateIncident(${index})">Update Incident</button>
            <button class="green-btn" onclick="addOfficer(${index})">Add Officer</button>
            <button class="green-btn" onclick="addProfile(${index})">Add Profiles</button>
            <button class="clear-btn" onclick="clearIncident(${index})">Clear</button>
        `;

        li.appendChild(btnContainer);
        container.appendChild(li);
    });
}

// Add a new incident to the incidents array
function addIncident() {
    const desc = document.getElementById('incident-desc').value.trim();
    if (!desc) return alert('Please enter a description.');

    const newIncident = {
        description: desc,
        officers: [],
        profiles: { people: [], plates: [] }
    };

    incidents.push(newIncident);
    loadIncidents(); // Refresh the list
    document.getElementById('incident-desc').value = ''; // Clear input
}

// Update an incident's description
function updateIncident(index) {
    const newDesc = prompt("Enter new description:");
    if (newDesc) {
        incidents[index].description = newDesc;
        loadIncidents(); // Refresh the list
    }
}

// Add an officer to the incident
function addOfficer(index) {
    const officerName = prompt("Enter officer's name:");
    if (officerName) {
        incidents[index].officers.push(officerName);
        loadIncidents(); // Refresh the list
    }
}

// Add profiles (people or license plates) to the incident
function addProfile(index) {
    const profileType = prompt("Enter 'people' to add a person, or 'plates' to add a plate:");
    const profileData = prompt(`Enter ${profileType === 'people' ? 'person\'s' : 'plate number'}:`);
    
    if (profileType === 'people') {
        incidents[index].profiles.people.push(profileData);
    } else if (profileType === 'plates') {
        incidents[index].profiles.plates.push(profileData);
    }

    loadIncidents(); // Refresh the list
}

// Clear an incident (remove it from the list)
function clearIncident(index) {
    incidents.splice(index, 1);
    loadIncidents(); // Refresh the list
}