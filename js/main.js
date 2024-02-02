// main.js

// Variables
let page = 1;
const perPage = 10;
let searchName = null;

// Function to load listings data
function loadListingsData() {
  const url = `/api/listings?page=${page}&perPage=${perPage}${
    searchName ? `&name=${searchName}` : ""
  }`;

  fetch(url)
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      if (data.length > 0) {
        // Update the data variable
        updateTable(data);
        addClickEvents();
        updatePaginationButtons(data); // Pass the data to updatePaginationButtons
      } else {
        if (page > 1) {
          page--; // Reduce page by one if the user is not on the first page
        } else {
          showNoDataMessage(); // Add a single row to the "listingsTable" informing the user that no data is available
        }
      }
    })
    .catch((err) => {
      console.error("Error fetching listings:", err);
    });
}

// Function to update table with <tr> elements
function updateTable(data) {
  const tableBody = document
    .getElementById("listingsTable")
    .querySelector("tbody");

  // Verify if tableBody is not null
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((listing) => {
      const tableRow = document.createElement("tr");
      tableRow.dataset.id = listing._id;

      // Create <td> elements and populate with data
      const nameCell = document.createElement("td");
      nameCell.textContent = listing.name;

      const typeCell = document.createElement("td");
      typeCell.textContent = listing.room_type;

      const locationCell = document.createElement("td");
      locationCell.textContent = listing.address
        ? listing.address.street
        : "N/A";

      const summaryCell = document.createElement("td");
      summaryCell.innerHTML = `${
        listing.summary ? listing.summary : "N/A"
      }<br><br>
            <strong>Accommodates:</strong> ${listing.accommodates || "N/A"}<br>
            <strong>Rating:</strong> ${
              listing.review_scores
                ? listing.review_scores.review_scores_rating
                : "N/A"
            } 
            (${listing.number_of_reviews || 0} Reviews)`;

      tableRow.appendChild(nameCell);
      tableRow.appendChild(typeCell);
      tableRow.appendChild(locationCell);
      tableRow.appendChild(summaryCell);

      tableBody.appendChild(tableRow);
    });
  } else {
    console.error("Error: Unable to find tableBody element.");
  }
}

// Function to add click events to <tr> elements
function addClickEvents() {
  const rows = document
    .getElementById("listingsTable")
    .querySelectorAll("tbody tr");

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const listingId = row.dataset.id;
      loadListingDetails(listingId);
    });
  });
}

// Function to load and display listing details in the modal
function loadListingDetails(listingId) {
  const detailsUrl = `/api/listings/${listingId}`;

  fetch(detailsUrl)
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      // Create elements
      const modalBody = document.querySelector(".modal-body");
      modalBody.innerHTML = ""; // Clear existing content

      // Create and append the image element
      const imageElement = document.createElement("img");
      imageElement.id = "photo";
      imageElement.onerror =
        "this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'";
      imageElement.classList.add("img-fluid", "w-100");
      imageElement.src =
        data.images && data.images.length > 0
          ? data.images[0].url
          : "https://placehold.co/600x400?text=Photo+Not+Available";
      modalBody.appendChild(imageElement);

      // // Add line breaks
      modalBody.appendChild(document.createElement("br"));
      modalBody.appendChild(document.createElement("br"));

      // Create and append the neighborhood overview text
      if (data.neighborhood_overview) {
        const neighborhoodText = document.createTextNode(
          data.neighborhood_overview
        );
        modalBody.appendChild(neighborhoodText);
      }

      // Add line breaks
      modalBody.appendChild(document.createElement("br"));
      modalBody.appendChild(document.createElement("br"));

      // Create and append the price, room type, bed type, and beds information
      modalBody.innerHTML += `
        <strong>Price:</strong> ${
          data.price ? `$${data.price.toFixed(2)}` : "N/A"
        }<br>
        <strong>Room:</strong> ${data.room_type || "N/A"}<br>
        <strong>Bed:</strong> ${
          data.bed_type ? `${data.bed_type} (${data.beds || 1})` : "N/A"
        }<br><br>
      `;

      // Show the modal
      const modal = new bootstrap.Modal(
        document.getElementById("detailsModal")
      );
      modal.show();
    })
    .catch((err) => {
      console.error("Error fetching listing details:", err);
    });
}

// Function to populate modal with listing details
function populateModal(listing) {
  // Assuming your modal has elements with IDs like "modalImage" and "modalDetails"
  const modalImage = document.getElementById("modalImage");
  const modalDetails = document.getElementById("modalDetails");

  // Populate modal elements with listing details
  modalImage.src = listing.image_url; // Replace with the actual property name in your data
  modalDetails.innerHTML = `<strong>Name:</strong> ${listing.name}<br>
                           <strong>Type:</strong> ${listing.room_type}<br>
                           <strong>Location:</strong> ${
                             listing.address ? listing.address.street : "N/A"
                           }<br>
                           <strong>Summary:</strong> ${
                             listing.summary ? listing.summary : "N/A"
                           }<br>
                           <strong>Accommodates:</strong> ${
                             listing.accommodates || "N/A"
                           }<br>
                           <strong>Rating:</strong> ${
                             listing.review_scores
                               ? listing.review_scores.review_scores_rating
                               : "N/A"
                           } (${listing.number_of_reviews || 0} Reviews)`;
}

// Function to update pagination buttons
function updatePaginationButtons(data) {
  // Update current page element
  document.getElementById("current-page").textContent = page;

  // Enable or disable previous page button based on page value
  const previousPageButton = document.getElementById("previous-page");
  previousPageButton.disabled = page === 1;

  // Enable or disable next page button based on data length
  const nextPageButton = document.getElementById("next-page");
  nextPageButton.disabled = page * perPage >= data.length;
}

// Function to show a message when no data is available
function showNoDataMessage() {
  const tableBody = document
    .getElementById("listingsTable")
    .querySelector("tbody");
  tableBody.innerHTML = `<tr><td colspan="4"><strong>No data available</strong></td></tr>`;
}

// Function to update pagination buttons
function updatePaginationButtons(data) {
  // Update current page element
  document.getElementById("current-page").textContent = page;

  // Enable or disable previous page button based on page value
  const previousPageButton = document.getElementById("previous-page");
  previousPageButton.disabled = page === 1;

  // Enable or disable next page button based on data length
  const nextPageButton = document.getElementById("next-page");
  nextPageButton.disabled = page * perPage >= data.length;
}

// Initial load when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadListingsData();

  // Click event for the "previous page" pagination button
  const previousPageButton = document.getElementById("previous-page");
  previousPageButton.addEventListener("click", () => {
    if (page > 1) {
      page--;
      loadListingsData();
    }
  });

  // Click event for the "next page" pagination button
  const nextPageButton = document.getElementById("next-page");
  nextPageButton.addEventListener("click", () => {
    page++;
    loadListingsData();
  });

  // Click event for the "searchForm" form
  const searchForm = document.getElementById("searchForm");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchName = document.getElementById("name").value;
    page = 1;
    loadListingsData();
  });

  // Click event for the "searchBtn" button
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", () => {
    searchName = document.getElementById("name").value;
    page = 1;
    loadListingsData();
  });

  // Click event for the "clearForm" button
  const clearFormButton = document.getElementById("clearForm");
  clearFormButton.addEventListener("click", () => {
    document.getElementById("name").value = "";
    searchName = null;
    page = 1;
    loadListingsData();
  });
});

updateTable(data);
addClickEvents();
