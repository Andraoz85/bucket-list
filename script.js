let activities = [];

function saveActivities() {
  try {
  localStorage.setItem("bucketActivities", JSON.stringify(activities));
  } catch (error){
    console.error("Kunde inte spara till localstorage: ", error);
  }
}

function getActivities() {
  const storedActivities = localStorage.getItem("bucketActivities");

  if (storedActivities) {
    try {
      activities = JSON.parse(storedActivities);
    } catch (error) {
      console.error("Kunde inte hämta aktiviteter från localstorage", error);
      activities = [];
    }
  }
}

function renderBucketList() {
  const bucketListsSection = document.getElementById("bucketLists");
  bucketListsSection.innerHTML = "";

  if (activities.length === 0) {
    const noActivitiesMsg = document.createElement("p");
    noActivitiesMsg.textContent =
      "Du har inga aktiviteter på din bucket list. Lägg till några!";
    bucketListsSection.appendChild(noActivitiesMsg);
    return;
  }

  const categories = {};

  // Gruppera aktiviteter efter kategori
  activities.forEach((activity) => {
    if (!categories[activity.category]) {
      categories[activity.category] = [];
    }
    categories[activity.category].push(activity);
  });

  const sortedCategories = Object.keys(categories).sort();

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

      // Knapp som växlar mellan "Klar" och "Ångra"
      const completeBtn = document.createElement("button");
      completeBtn.textContent = activity.completed ? "Ångra" : "Klar";
      completeBtn.classList.add(
        activity.completed ? "completed-btn" : "not-completed-btn"
      );

      completeBtn.addEventListener("click", () => {
        const activityIndex = activities.findIndex(
          (a) => a.name === activity.name && a.category === activity.category
        );
        toggleComplete(activityIndex);
      });
      li.appendChild(completeBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Ta bort";
      deleteBtn.classList.add("delete-btn");

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

      if (activity.completed) {
        li.classList.add("completed");
      }
      ul.appendChild(li);
    });

    bucketListsSection.appendChild(ul);
  });
}

function addActivity(name, category) {
  const activity = {
    name,
    category,
    completed: false
  };
  activities.push(activity);
  saveActivities();
  sortActivities();
  renderBucketList();
}

function deleteActivity(index) {
  if (index >= 0 && index < activities.length) {
    const removedActivity = activities[index];
    activities.splice(index, 1);
    saveActivities();
    renderBucketList();
  } else {
    console.error("Ogiltigt index för att ta bort aktivitet:", index);
  }
}

function toggleComplete(index) {
  if (index >= 0 && index < activities.length) {
    activities[index].completed = !activities[index].completed;
    saveActivities();
    sortActivities();
    renderBucketList();
  } else {
    console.error("Ogiltigt index", index);
  }
}

function sortActivities() {
  activities.sort((a, b) => {
    let categoryComparison = a.category.localeCompare(b.category);
    if (categoryComparison !== 0) {
      return categoryComparison;
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
}

// Eventlistener för formuläret
document.getElementById("bucketForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const activityName = document.getElementById("activityName").value.trim();
  const activityCategory = document.getElementById("activityCategory").value;

  if (activityName !== "") {
    addActivity(activityName, activityCategory);
    this.reset();
  } else {
    alert("Aktivitetsnamn är tomt. Aktiviteten lades inte till.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getActivities();
  renderBucketList();
});
