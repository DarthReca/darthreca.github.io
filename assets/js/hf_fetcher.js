async function fetchData(endpoint, listElementId, loaderElementId) {
  const listElement = document.getElementById(listElementId);
  const loaderElement = document.getElementById(loaderElementId);

  try {
    // Fetch data from the Hugging Face API, filtering by author, expanding to get all-time downloads, and sorting by downloads
    const response = await fetch(
      `https://huggingface.co/api/${endpoint}?author=DarthReca&sort=downloads&expand[]=downloadsAllTime&expand[]=createdAt`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    data = data
      .sort((a, b) => b.downloadsAllTime - a.downloadsAllTime)
      .slice(0, 5);
    // Clear the list before adding new items
    listElement.innerHTML = "";

    // Handle case where no data is returned
    if (data.length === 0) {
      listElement.innerHTML = `<li class="text-center text-gray-500">No public ${endpoint} found for this user.</li>`;
      loaderElement.style.display = "none";
      return;
    }

    // Create and append list items for each item in the fetched data
    data.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.className =
        "flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200";

      const itemInfo = document.createElement("div");
      itemInfo.className = "flex-grow truncate mr-4";

      const itemName = document.createElement("div");
      itemName.className = "font-medium text-gray-700 truncate";
      // Add a link to the repository on Hugging Face
      itemName.innerHTML = `<a href="https://huggingface.co/${
        endpoint === "models" ? "" : "datasets/"
      }${item.id}" target="_blank" class="hover:underline" title="${item.id}">${
        index + 1
      }. ${item.id}</a>`;

      const itemAge = document.createElement("div");
      itemAge.className = "text-xs text-gray-500 mt-1";
      itemAge.textContent = `Created ${getAge(item.createdAt)}`;

      itemInfo.appendChild(itemName);
      itemInfo.appendChild(itemAge);

      const itemDownloads = document.createElement("span");
      itemDownloads.className =
        "text-sm font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full flex-shrink-0";
      // Format the number with commas for readability, using the all-time download count
      itemDownloads.textContent = `${(
        item.downloadsAllTime || 0
      ).toLocaleString()} downloads`;

      listItem.appendChild(itemInfo);
      listItem.appendChild(itemDownloads);
      listElement.appendChild(listItem);
    });
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    listElement.innerHTML = `<li class="text-center text-red-500">Failed to load data.</li>`;
  } finally {
    // Hide the loader once data is loaded or an error occurs
    loaderElement.style.display = "none";
  }
}

function getAge(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  let interval = seconds / 31536000; // 60 * 60 * 24 * 365
  if (interval > 1) {
    const years = Math.floor(interval);
    return years + (years === 1 ? " year ago" : " years ago");
  }
  interval = seconds / 2592000; // 60 * 60 * 24 * 30
  if (interval > 1) {
    const months = Math.floor(interval);
    return months + (months === 1 ? " month ago" : " months ago");
  }
  interval = seconds / 86400; // 60 * 60 * 24
  if (interval > 1) {
    const days = Math.floor(interval);
    return days + (days === 1 ? " day ago" : " days ago");
  }
  interval = seconds / 3600; // 60 * 60
  if (interval > 1) {
    const hours = Math.floor(interval);
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  }
  return Math.floor(seconds) + " seconds ago";
}
