let incidents = [];
let officerList = [];

window.onload = function () {
  renderOfficerList();
  loadIncidents();
};

function addIncident() {
  const desc = document.getElementById('incident-desc').value.trim();
  if (!desc) return alert('Please enter a description.');

  const now = new Date();

  const newIncident = {
    description: desc,
    timestamp: now.toISOString(),
    officers: [],
    profiles: { people: [], plates: [] },
    updates: []
  };

  incidents.push(newIncident);
  document.getElementById('incident-desc').value = '';
  loadIncidents();
}

function addToOfficerList() {
  const nameInput = document.getElementById('officer-name');
  const name = nameInput.value.trim();
  if (!name) return alert('Please enter a name.');

  officerList.push(name);
  nameInput.value = '';
  renderOfficerList();
  loadIncidents();
}

function renderOfficerList() {
  renderOfficerStatusList();
}

function renderOfficerStatusList() {
  const statusList = document.getElementById('officer-status-list');
  if (!statusList) return;

  statusList.innerHTML = '';

  officerList.forEach(officer => {
    const isAssigned = incidents.some(incident => incident.officers.includes(officer));
    const status = isAssigned ? '1 for 1' : 'Active';

    const li = document.createElement('li');
    li.textContent = `${officer} - ${status}`;
    li.style.color = isAssigned ? 'limegreen' : 'lightgray';
    statusList.appendChild(li);
  });
}

function getTimeElapsed(timestamp) {
  const createdTime = new Date(timestamp);
  const now = new Date();
  const diffMs = now - createdTime;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `Open for ${hours} hour${hours > 1 ? 's' : ''}, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
  return `Open for ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

function loadIncidents() {
  const container = document.getElementById('incident-list');
  container.innerHTML = '';

  incidents.forEach((incident, index) => {
    const li = document.createElement('li');
    li.className = 'incident-item';

    const updatesDiv = document.createElement('div');
    updatesDiv.className = 'update-notes';
    updatesDiv.innerHTML = `<strong>Updates:</strong><br>`;
    if (incident.updates.length > 0) {
      incident.updates.forEach(update => {
        const updateEl = document.createElement('div');
        updateEl.className = 'update-note';
        updateEl.innerHTML = `${new Date(update.time).toLocaleTimeString()}: ${update.text}`;
        updatesDiv.appendChild(updateEl);
      });
    } else {
      updatesDiv.innerHTML += `<em>No updates yet.</em>`;
    }

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'incident-details';

    detailsDiv.innerHTML += `
      <strong>ID ${index + 1}</strong>: ${incident.description}<br>
      <em>Time:</em> ${new Date(incident.timestamp).toLocaleString()}<br>
      <em>${getTimeElapsed(incident.timestamp)}</em><br><br>
      <strong>Assigned Officers:</strong><br>
    `;

    const assignedDropdown = document.createElement('select');
    assignedDropdown.disabled = true;
    incident.officers.forEach((officer, officerIndex) => {
      const option = document.createElement('option');
      option.text = officer;
      assignedDropdown.appendChild(option);

      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.className = 'remove-btn';
      removeButton.onclick = () => removeOfficerFromIncident(index, officerIndex);
      detailsDiv.appendChild(removeButton);
    });

    detailsDiv.appendChild(assignedDropdown);
    detailsDiv.appendChild(document.createElement('br'));

    const officerDropdown = document.createElement('select');
    officerDropdown.id = `officer-select-${index}`;
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Officer --';
    officerDropdown.appendChild(defaultOption);

    officerList.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.text = name;
      officerDropdown.appendChild(option);
    });

    const assignBtn = document.createElement('button');
    assignBtn.textContent = 'Assign Officer';
    assignBtn.className = 'green-btn';
    assignBtn.onclick = () => assignOfficerToIncident(index);

    detailsDiv.appendChild(officerDropdown);
    detailsDiv.appendChild(assignBtn);

    detailsDiv.innerHTML += `
      <br>
      <button class="green-btn" onclick="updateIncident(${index})">Update Incident</button>
      <button class="green-btn" onclick="addProfile(${index})">Add Profiles</button>
      <button class="clear-btn" onclick="clearIncident(${index})">Clear</button>
    `;

    li.appendChild(updatesDiv);
    li.appendChild(detailsDiv);
    container.appendChild(li);
  });

  renderOfficerStatusList();
}

function assignOfficerToIncident(index) {
  const dropdown = document.getElementById(`officer-select-${index}`);
  const selectedOfficer = dropdown.value;
  if (!selectedOfficer) return alert("Please select an officer.");

  const incident = incidents[index];

  if (!incident.officers.includes(selectedOfficer)) {
    incident.officers.push(selectedOfficer);
    dropdown.value = ''; // Reset dropdown
    loadIncidents();
  } else {
    alert("Officer already assigned.");
  }
}

function removeOfficerFromIncident(incidentIndex, officerIndex) {
  incidents[incidentIndex].officers.splice(officerIndex, 1);
  loadIncidents();
}

function updateIncident(index) {
  const newDesc = prompt("Enter update note:");
  if (newDesc) {
    const updateNote = {
      text: newDesc,
      time: new Date().toISOString()
    };
    incidents[index].updates.push(updateNote);
    loadIncidents();
  }
}

function addProfile(index) {
  const type = prompt("Enter 'people' or 'plates':").toLowerCase();
  const data = prompt(`Enter ${type === 'people' ? 'person name' : 'plate number'}:`);

  if (!data) return;

  if (type === 'people') {
    incidents[index].profiles.people.push(data);
  } else if (type === 'plates') {
    incidents[index].profiles.plates.push(data);
  }

  loadIncidents();
}

function clearIncident(index) {
  incidents.splice(index, 1);
  loadIncidents();
}

function searchIncidents() {
  const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
  if (!searchTerm) {
    loadIncidents();
    return;
  }

  const filteredIncidents = incidents.filter(incident => {
    const incidentId = incident.timestamp.slice(-6);
    const officersMatch = incident.officers.some(officer => officer.toLowerCase().includes(searchTerm));
    return incidentId.includes(searchTerm) || officersMatch;
  });

  renderFilteredIncidents(filteredIncidents);
}

function renderFilteredIncidents(filteredIncidents) {
  const container = document.getElementById('incident-list');
  container.innerHTML = '';

  filteredIncidents.forEach((incident, index) => {
    const li = document.createElement('li');
    li.className = 'incident-item';
    li.innerHTML = `
      <div class="update-notes"><strong>Filtered:</strong></div>
      <div class="incident-details">
        <strong>ID ${index + 1}</strong>: ${incident.description}<br>
        <em>Time:</em> ${new Date(incident.timestamp).toLocaleString()}<br>
        <em>${getTimeElapsed(incident.timestamp)}</em><br>
      </div>
    `;
    container.appendChild(li);
  });

  renderOfficerStatusList();
}