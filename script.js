document.addEventListener('DOMContentLoaded', () => {
    const weekSelector = document.getElementById('week-selector');
    const weekModal = document.getElementById('week-modal');
    const closeModal = document.querySelector('.close');
    const weekLinks = document.getElementById('week-links');
    const weeklyContent = document.getElementById('weekly-content');
    const currentDate = document.getElementById('current-date');

    // Initialize by loading week 1
    loadWeekContent(1);

    // Function to check if a date is in the future
    function isFutureDate(date) {
        const today = new Date();
        return date > today;
    }

    // Function to generate date for a given week number
    function getWeekDate(weekNumber) {
        // Start date: November 29th, 2024
        const startDate = new Date(2024, 10, 29); // Month is 0-based, so 10 = November
        // Add (weekNumber - 1) weeks to start date
        const weekDate = new Date(startDate);
        weekDate.setDate(startDate.getDate() + ((weekNumber - 1) * 7));
        return weekDate;
    }

    // Format date for display
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
        });
    }

    // Layout templates
    const layoutTemplates = [
        // Layout 1: Traditional column layout
        function(week, content) {
            return `
                <div class="article-block main-story" style="grid-column: span 3;">
                    <h2>${content.articles[0].headline}</h2>
                    <div class="article-image" style="float: right; margin: 0 0 10px 10px;">
                        <img src="images/week-${week}-image-1.jpg" alt="Main story image">
                        <div class="image-caption">${content.articles[0].imageCaption}</div>
                    </div>
                    <p>${content.articles[0].content}</p>
                </div>
                <div class="article-block" style="grid-column: span 1;">
                    <h2>${content.articles[1].headline}</h2>
                    <p>${content.articles[1].content}</p>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <div class="article-image" style="width: 100%; margin-bottom: 10px;">
                        <img src="images/week-${week}-image-2.jpg" alt="Secondary story image">
                        <div class="image-caption">${content.articles[1].imageCaption}</div>
                    </div>
                    <h2>${content.articles[2].headline}</h2>
                    <p>${content.articles[2].content}</p>
                </div>
            `;
        },
        // Layout 2: Feature image layout
        function(week, content) {
            return `
                <div class="article-block" style="grid-column: span 4;">
                    <div class="article-image full-width">
                        <img src="images/week-${week}-image-1.jpg" alt="Feature image">
                        <div class="image-caption">${content.articles[0].imageCaption}</div>
                    </div>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <h2>${content.articles[0].headline}</h2>
                    <p>${content.articles[0].content}</p>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <h2>${content.articles[1].headline}</h2>
                    <p>${content.articles[1].content}</p>
                    <div class="article-image" style="margin-top: 10px;">
                        <img src="images/week-${week}-image-2.jpg" alt="Secondary image">
                        <div class="image-caption">${content.articles[1].imageCaption}</div>
                    </div>
                </div>
            `;
        },
        // Layout 3: Magazine style
        function(week, content) {
            return `
                <div class="article-block" style="grid-column: span 2;">
                    <div class="article-image" style="float: left; margin: 0 10px 10px 0;">
                        <img src="images/week-${week}-image-1.jpg" alt="Lead story image">
                        <div class="image-caption">${content.articles[0].imageCaption}</div>
                    </div>
                    <h2>${content.articles[0].headline}</h2>
                    <p>${content.articles[0].content}</p>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <h2>${content.articles[1].headline}</h2>
                    <p>${content.articles[1].content}</p>
                </div>
                <div class="article-block" style="grid-column: span 4;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="article-image">
                            <img src="images/week-${week}-image-2.jpg" alt="Story image">
                            <div class="image-caption">${content.articles[1].imageCaption}</div>
                        </div>
                        <div class="article-image">
                            <img src="images/week-${week}-image-3.jpg" alt="Story image">
                            <div class="image-caption">${content.articles[2].imageCaption}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    ];

    // Generate week links with dates
    function generateWeekLinks() {
        weekLinks.innerHTML = ''; // Clear existing links
        
        // Generate regular week links
        for (let week = 1; week <= 52; week++) {
            const weekDate = getWeekDate(week);
            const weekLink = document.createElement('a');
            weekLink.href = `#week-${week}`;
            weekLink.className = 'week-link';
            weekLink.textContent = `Week ${week} - ${formatDate(weekDate)}`;

            // Check if this week is in the future
            if (isFutureDate(weekDate)) {
                weekLink.classList.add('future');
            } else {
                weekLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadWeekContent(week);
                    weekModal.style.display = 'none';
                });
            }

            weekLinks.appendChild(weekLink);
        }

        // Add special box for Swami's 100th Birthday
        const specialLink = document.createElement('a');
        specialLink.href = '#centennial';
        specialLink.className = 'week-link special-edition';
        specialLink.innerHTML = `
            <span class="special-title">Swami's 100th Birthday Special Edition</span>
            <span class="special-date">November 23rd, 2025</span>
        `;
        specialLink.classList.add('future');
        weekLinks.appendChild(specialLink);
    }

    // Load week content from JSON file
    async function loadWeekContent(week) {
        weeklyContent.innerHTML = '';
        const weekDate = getWeekDate(week);
        
        try {
            console.log('Fetching content for week:', week);
            // Add timestamp to prevent caching
            const response = await fetch(`content/week${week}.json?t=${new Date().getTime()}`);
            console.log('Response status:', response.status);
            
            // Log the raw response
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Content not found: ${response.status}`);
            }
            
            // Parse the JSON after logging
            const content = JSON.parse(text);
            console.log('Parsed content:', content);
            
            currentDate.textContent = `Sai Centennial Satsang - Week ${week} (${formatDate(weekDate)})`;

            // Create newspaper-style layout
            const layout = document.createElement('div');
            layout.classList.add('newspaper-layout');

            // Select layout template
            const layoutIndex = (week - 1) % layoutTemplates.length;
            layout.innerHTML = layoutTemplates[layoutIndex](week, content);

            // Add weather report if it exists
            if (content.weatherReport) {
                const weatherSection = document.createElement('div');
                weatherSection.classList.add('weather-report');
                weatherSection.innerHTML = `
                    <h3>Weather Report</h3>
                    <p>${content.weatherReport.forecast}</p>
                    <p>${content.weatherReport.temperature}</p>
                    <p>${content.weatherReport.weekOutlook}</p>
                `;
                layout.appendChild(weatherSection);
            }

            // Add agenda items
            if (content.agenda && content.agenda.length > 0) {
                const todoList = document.createElement('div');
                todoList.classList.add('todo-list');
                todoList.innerHTML = `
                    <h3>This Week's Agenda</h3>
                    <ul>
                        ${content.agenda.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
                layout.appendChild(todoList);
            }

            weeklyContent.appendChild(layout);
        } catch (error) {
            console.error('Error loading content:', error);
            weeklyContent.innerHTML = `
                <div class="error-message">
                    <h2>Content Not Available</h2>
                    <p>The content for Week ${week} (${formatDate(weekDate)}) is coming soon.</p>
                </div>
            `;
        }
    }

    // Modal functionality
    weekSelector.addEventListener('click', (e) => {
        e.preventDefault();
        weekModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        weekModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === weekModal) {
            weekModal.style.display = 'none';
        }
    });

    // Photo Gallery functionality
    const photoGallery = document.getElementById('photo-gallery');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryContainer = document.getElementById('gallery-container');

    async function loadGallery() {
        galleryContainer.innerHTML = ''; // Clear existing content
        
        // Loop through weeks
        for (let week = 1; week <= 52; week++) {
            const weekDate = getWeekDate(week);
            
            // Only show galleries for past and current weeks
            if (!isFutureDate(weekDate)) {
                const weekGallery = document.createElement('div');
                weekGallery.className = 'week-gallery';
                weekGallery.innerHTML = `
                    <h3>Week ${week} - ${formatDate(weekDate)}</h3>
                    <div class="photo-grid" id="week-${week}-photos"></div>
                `;
                
                const photoGrid = weekGallery.querySelector('.photo-grid');
                
                // Add all possible image files
                for (let i = 1; i <= 20; i++) { // Support up to 20 images per week
                    const extensions = ['jpg', 'jpeg', 'png']; // Support multiple image formats
                    
                    extensions.forEach(ext => {
                        const photoItem = document.createElement('div');
                        photoItem.className = 'photo-item';
                        photoItem.innerHTML = `
                            <img src="images/week${week}/photo${i}.${ext}" 
                                 alt="Week ${week} Photo ${i}"
                                 onerror="this.parentElement.remove()">
                        `;
                        photoGrid.appendChild(photoItem);
                    });
                }
                
                // Only append the week gallery if it has photos
                setTimeout(() => {
                    if (photoGrid.children.length > 0) {
                        galleryContainer.appendChild(weekGallery);
                    }
                }, 100); // Small delay to allow onerror to process
            }
        }
    }

    photoGallery.addEventListener('click', async (e) => {
        e.preventDefault();
        await loadGallery();
        galleryModal.style.display = 'block';
    });

    // Close gallery modal when clicking the close button or outside
    galleryModal.querySelector('.close').addEventListener('click', () => {
        galleryModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === galleryModal) {
            galleryModal.style.display = 'none';
        }
    });

    // Initialize week links
    generateWeekLinks();
});
