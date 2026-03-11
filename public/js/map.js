document.addEventListener("DOMContentLoaded", async function () {

    if (!window.locationText) return;

    try {
        // Convert location to coordinates using OpenStreetMap
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${window.locationText}`
        );

        const data = await response.json();

        if (!data || data.length === 0) {
            console.log("Location not found");
            return;
        }

        const lat = data[0].lat;
        const lon = data[0].lon;

        // Create map
        const map = L.map("map").setView([lat, lon], 10);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${window.listingTitle}</b><br>${window.locationText}`)
            .openPopup();

    } catch (err) {
        console.log("Map error:", err);
    }
});

setTimeout(() => {
    map.invalidateSize();
}, 100);
