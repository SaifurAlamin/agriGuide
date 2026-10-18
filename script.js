
document.addEventListener("DOMContentLoaded", function () {
    // Automatically update the copyright year.
    document.querySelectorAll(".current-year").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    // Farming guides: filter by crop, season and farming method.
    const cropFilter = document.getElementById("cropFilter");
    const seasonFilter = document.getElementById("seasonFilter");
    const methodFilter = document.getElementById("methodFilter");
    const guideItems = document.querySelectorAll(".guide-item");
    const guideCount = document.getElementById("guideCount");
    const noGuides = document.getElementById("noGuides");

    function filterGuides() {
        if (!cropFilter || !seasonFilter || !methodFilter) return;

        const crop = cropFilter.value;
        const season = seasonFilter.value;
        const method = methodFilter.value;
        let visibleCount = 0;

        guideItems.forEach(function (item) {
            const matchesCrop = crop === "all" || item.dataset.crop === crop;
            const matchesSeason = season === "all" || item.dataset.season === season;
            const matchesMethod = method === "all" || item.dataset.method === method;

            const visible = matchesCrop && matchesSeason && matchesMethod;
            item.classList.toggle("d-none", !visible);

            if (visible) visibleCount++;
        });

        if (guideCount) {
            guideCount.textContent =
                "Showing " + visibleCount + " farming guide(s).";
        }

        if (noGuides) {
            noGuides.classList.toggle("d-none", visibleCount !== 0);
        }
    }

    [cropFilter, seasonFilter, methodFilter].forEach(function (filter) {
        if (filter) filter.addEventListener("change", filterGuides);
    });

    if (cropFilter) filterGuides();

    // Crop details: search across all crop profile text.
    const cropSearch = document.getElementById("cropSearch");
    const cropProfiles = document.querySelectorAll(".crop-profile");
    const noCrops = document.getElementById("noCrops");

    function searchCrops() {
        if (!cropSearch) return;

        const query = cropSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        cropProfiles.forEach(function (profile) {
            const matches = profile.textContent.toLowerCase().includes(query);

            profile.classList.toggle("d-none", !matches);

            if (matches) visibleCount++;
        });

        // Hide category headings when no cards in that category match.
        document.querySelectorAll("#grains, #fruits, #vegetables, #cash-crops")
            .forEach(function (section) {
                const visibleProfiles = section.querySelectorAll(
                    ".crop-profile:not(.d-none)"
                );

                section.classList.toggle("d-none", visibleProfiles.length === 0);
            });

        if (noCrops) {
            noCrops.classList.toggle("d-none", visibleCount !== 0);
        }
    }

    if (cropSearch) {
        cropSearch.addEventListener("input", searchCrops);
    }

    // Contact form: frontend validation and demo confirmation.
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const attachment = document.getElementById("attachment");

    if (attachment) {
        attachment.addEventListener("change", function () {
            const file = attachment.files[0];

            if (!file) return;

            const allowedExtensions = /\.(jpg|jpeg|png|pdf|doc|docx)$/i;
            const maxSize = 5 * 1024 * 1024;

            if (!allowedExtensions.test(file.name)) {
                attachment.setCustomValidity(
                    "Please select a JPG, PNG, PDF, DOC or DOCX file."
                );
            } else if (file.size > maxSize) {
                attachment.setCustomValidity("The attachment must be 5 MB or smaller.");
            } else {
                attachment.setCustomValidity("");
            }

            if (!attachment.checkValidity()) {
                attachment.reportValidity();
                attachment.value = "";
                attachment.setCustomValidity("");
            }
        });
    }

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            formMessage.className = "alert alert-success";
            formMessage.textContent =
                "Your form passed validation. This is a demo website: " +
                "your inquiry has not been sent. Connect a backend or form service " +
                "to deliver your message.";

            formMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }
});
