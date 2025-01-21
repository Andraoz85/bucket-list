// tom array för att spara aktiviteter
let activities = [];

// spara aktiviteter i local storage
function saveActivities() {
  try {
  localStorage.setItem("bucketActivities", JSON.stringify(activities));
  console.log("Aktiviteter sparade till localstorage:", activities);
  } catch (error){
    console.error("Kunde inte spara till localstorage: ", error);
  }
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

function renderBucketList() {
  const bucketListsSection = document.getElementById("bucketLists");
  bucketListsSection.innerHTML = ""; // Rensa listan

  if (activities.length === 0) {
    const noActivitiesMsg = document.createElement("p");
    noActivitiesMsg.textContent =
      "Du har inga aktiviteter på din bucket list. Lägg till några!";
    bucketListsSection.appendChild(noActivitiesMsg);
    return;
  }

  // Skapa ett objekt för att lagra aktiviteter efter kategori
  const categories = {};

  // Gruppera aktiviteter efter kategori
  activities.forEach((activity) => {
    if (!categories[activity.category]) {
      categories[activity.category] = [];
    }
    categories[activity.category].push(activity);
  });

  // Sortera kategorier i bokstavsordning
  const sortedCategories = Object.keys(categories).sort();

  // Loopa igenom kategorierna och skapar en lista för varje kategori
  sortedCategories.forEach((category) => {
    const categoryHeader = document.createElement("h2");
    categoryHeader.textContent = category;
    bucketListsSection.appendChild(categoryHeader);

    const ul = document.createElement("ul");

    categories[category].forEach((activity) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = `${activity.name}`;
      li.appendChild(span);

      // knapp för att markera aktiviteten som klar
      const completeBtn = document.createElement("button");
      completeBtn.textContent = activity.completed ? "Ångra" : "Klar";
      completeBtn.classList.add(
        activity.completed ? "completed-btn" : "not-completed-btn"
      );

      // Lägg till en klickhändelse för completeBtn
      completeBtn.addEventListener("click", () => {
        const activityIndex = activities.findIndex(
          (a) => a.name === activity.name && a.category === activity.category
        );
        toggleComplete(activityIndex);
      });
      li.appendChild(completeBtn);

      // knapp för att ta bort aktiviteten
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Ta bort";
      deleteBtn.classList.add("delete-btn");

      // Lägg till en klickhändelse för deleteBtn
      deleteBtn.addEventListener("click", () => {
        const activityIndex = activities.findIndex(
          (a) => a.name === activity.name && a.category === activity.category
        );
        const confirmDelete = confirm(
          `Är du säker på att du vill ta bort "${activity.name}"?`
        );
        if (confirmDelete) {
          deleteActivity(activityIndex);
        }
      });
      li.appendChild(deleteBtn);

      // Lägg till en CSS-klass om aktiviteten är klar
      if (activity.completed) {
        li.classList.add("completed");
        console.log(`Aktivitet "${activity.name}" är klar.`);
      }

      ul.appendChild(li);
    });
    bucketListsSection.appendChild(ul);
  });
}

// Lägg till en ny aktivitet
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
  renderBucketList(); // uppdatera listan
}

// Ta bort en aktivitet
function deleteActivity(index) {
  if (index >= 0 && index < activities.length) {
    const removedActivity = activities[index];
    activities.splice(index, 1); // ta bort aktiviteten från listan
    console.log("Aktivitet borttagen:", removedActivity);
    saveActivities();
    renderBucketList();
  } else {
    console.error("Ogiltigt index för att ta bort aktivitet:", index);
  }
}

// Växla status för en aktivitet
function toggleComplete(index) {
  if (index >= 0 && index < activities.length) {
    activities[index].completed = !activities[index].completed; // byt status
    console.log(`växlar status för aktivitet #${index}: `, activities[index]);
    saveActivities();
    sortActivities();
    renderBucketList();
  } else {
    console.error("Ogiltigt index", index);
  }
}

// Sortera aktiviteter efter kategori och namn
function sortActivities() {
  activities.sort((a, b) => {
    // sortera först efter kategori
    let categoryComparison = a.category.localeCompare(b.category);
    if (categoryComparison !== 0) {
      return categoryComparison;
    }
    // Om kategorierna är samma, sortera efter namn
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
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
  renderBucketList();
});
