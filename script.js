// tom array för att spara aktiviteter
let activities = [];

// spara aktiviteter i local storage
function saveActivities() {
  localStorage.setItem("bucketActivities", JSON.stringify(activities));
  console.log("Aktiviteter sparade till localstorage:", activities);
}

// hämta aktiviteter från local storage
function getActivities() {
  console.log("Hämtar aktiviteter från localstorage...");
  const storedActivities = localStorage.getItem("bucketActivities");

  if (storedActivities) {
    try {
      activities = JSON.parse(storedActivities);
      console.log("Aktiviteter från localstorage", activities);
    } catch (error) {
      console.error("Kunde inte hämta aktiviteter från localstorage", error);
      activities = [];
    }
  } else {
    console.log("Inga sparade aktiviteter hittades");
  }
}

// Uppdatera listan med aktiviteter
function refreshBucketList() {
  const bucketListsSection = document.getElementById("bucketLists");
  bucketListsSection.innerHTML = ""; // Rensa listan

  //Skapa en ul för alla aktiviteter
  const ul = document.createElement("ul");

  // Loopa igenom listan och skapa en li för varje aktivitet
  activities.forEach((activity, index) => {
    // Skapa ett li-element för varje aktivitet
    const li = document.createElement("li");

    // skapa ett span-element för aktivitetsnamnet och kategorin
    const span = document.createElement("span");
    span.textContent = `${activity.name} (${activity.category})`;
    li.appendChild(span);

    // Skapa en knapp för att markera aktiviteten som klar
    const completeBtn = document.createElement("button");
    completeBtn.textContent = activity.completed ? "Klar" : "Att göra";
    console.log(`Aktivitet #${index} completed status: ${activity.completed}`);

    // Lägg till en CSS-klass baserat på status
    if (activity.completed) {
      completeBtn.classList.add("completed-btn");
    } else {
      completeBtn.classList.add("not-completed-btn");
    }

    // Lägg till en klickhändelse för completeBtn
    completeBtn.addEventListener("click", () => {
      console.log(
        `Klickade på "${completeBtn.textContent}" för aktivitet #${index}`
      );
      toggleComplete(index);
    });
    li.appendChild(completeBtn);

    // Skapa en knapp för att ta bort aktiviteten
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Ta bort";
    deleteBtn.classList.add("delete-btn"); // CSS-klass för styling

    // Lägg till en klickhändelse för deleteBtn
    deleteBtn.addEventListener("click", () => {
      console.log(
        `Klickade på "Ta bort" för aktivitet ${index}`,
        activity.name
      );
      const confirmDelete = confirm(
        `Är du säker på att du vill ta bort "${activity.name}"?`
      );
      if (confirmDelete) {
        deleteActivity(index);
        console.log(`Aktivitet ${activity.name} borttagen`);
      }
    });
    li.appendChild(deleteBtn);

    // Om aktiviteten är klar, lägg till en CSS-klass för styling
    if (activity.completed) {
      li.classList.add("completed");
      console.log(`Aktivitet #${index} ${activity.name} är klar.`);
    }
    ul.appendChild(li);
  });

  bucketListsSection.appendChild(ul);
}

function addActivity(name, category) {
  const activity = {
    name,
    category,
    completed: false, // default är att aktiviteten inte är klar
  };
  activities.push(activity);
  console.log("Lägger till ny aktivitet:", activity);
  saveActivities(); // spara aktiviteten i local storage
  sortActivities(); // sortera aktiviteterna
  refreshBucketList(); // uppdatera listan
}

function deleteActivity(index) {
  if (index >= 0 && index < activities.length) {
    const removedActivity = activities[index];
    activities.splice(index, 1); // ta bort aktiviteten från listan
    console.log("Aktivitet borttagen:", removedActivity);
    saveActivities();
    refreshBucketList();
  } else {
    console.error("Ogiltigt index för att ta bort aktivitet:", index);
  }
}

function toggleComplete(index) {
  if (index >= 0 && index < activities.length) {
    activities[index].completed = !activities[index].completed; // byt status
    console.log(`växlar status för aktivitet #${index}: `, activities[index]);
    saveActivities();
    sortActivities();
    refreshBucketList();
  } else {
    console.error("Ogiltigt index", index);
  }
}

function sortActivities() {
  activities.sort((a, b) => {
    // Sortera aktiviteter efter kategori
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;

    // Om kategorierna är samma, sortera efter namn
    if (a.name < b.name.toLowerCase()) return -1;
    if (a.name > b.name.toLowerCase()) return 1;

    return 0; // behåll ordningen om både kategoru och namn är samma
  });
  console.log("Aktiviteter sorterade:", activities);
}

// Eventlistener för formuläret
document.getElementById("bucketForm").addEventListener("submit", function (e) {
  e.preventDefault(); // förhindra att sidan laddas om

  // Hämta aktivitetsnamn och kategori från formuläret
  const activityName = document.getElementById("activityName").value.trim();
  const activityCategory = document.getElementById("activityCategory").value;

  // Lägg till aktiviteten om aktivitetsnamnet inte är tomt
  if (activityName !== "") {
    addActivity(activityName, activityCategory);
    this.reset(); // Rensa formuläret
  } else {
    alert("Aktivitetsnamn är tomt. Aktiviteten lades inte till.");
  }
});

// Ladda aktiviteter från local storage och refresha listan
document.addEventListener("DOMContentLoaded", () => {
  getActivities();
  refreshBucketList();
});
