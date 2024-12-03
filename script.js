document.addEventListener('DOMContentLoaded', () => {
    const weekSelector = document.getElementById('week-selector');
    const weekModal = document.getElementById('week-modal');
    const closeModal = document.querySelector('.close');
    const weekLinks = document.getElementById('week-links');
    const weeklyContent = document.getElementById('weekly-content');
    const currentDate = document.getElementById('current-date');

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
                    <div class="article-author">By ${content.articles[0].author}</div>
                </div>
                <div class="article-block" style="grid-column: span 1;">
                    <h2>${content.articles[1].headline}</h2>
                    <p>${content.articles[1].content}</p>
                    <div class="article-author">By ${content.articles[1].author}</div>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <div class="article-image" style="width: 100%; margin-bottom: 10px;">
                        <img src="images/week-${week}-image-2.jpg" alt="Secondary story image">
                        <div class="image-caption">${content.articles[1].imageCaption}</div>
                    </div>
                    <h2>${content.articles[2].headline}</h2>
                    <p>${content.articles[2].content}</p>
                    <div class="article-author">By ${content.articles[2].author}</div>
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
                    <div class="article-author">By ${content.articles[0].author}</div>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <h2>${content.articles[1].headline}</h2>
                    <p>${content.articles[1].content}</p>
                    <div class="article-author">By ${content.articles[1].author}</div>
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
                    <div class="article-author">By ${content.articles[0].author}</div>
                </div>
                <div class="article-block" style="grid-column: span 2;">
                    <h2>${content.articles[1].headline}</h2>
                    <p>${content.articles[1].content}</p>
                    <div class="article-author">By ${content.articles[1].author}</div>
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

    // Generate week links
    function generateWeekLinks() {
        for (let week = 1; week <= 52; week++) {
            const weekLink = document.createElement('a');
            weekLink.href = `#week-${week}`;
            weekLink.textContent = `Edition ${week}`;
            weekLink.addEventListener('click', () => loadWeekContent(week));
            weekLinks.appendChild(weekLink);
        }
    }

    // Load week content from JSON file
    async function loadWeekContent(week) {
        // Clear existing content first
        weeklyContent.innerHTML = '';
        
        try {
            const response = await fetch(`content/week${week}.json`);
            if (!response.ok) {
                throw new Error('Content not found');
            }
            const content = await response.json();
            
            currentDate.textContent = `Volume 1 - ${content.date}`;

            // Create newspaper-style layout
            const layout = document.createElement('div');
            layout.classList.add('newspaper-layout');

            // Select layout template based on week number
            const layoutIndex = (week - 1) % layoutTemplates.length;
            layout.innerHTML = layoutTemplates[layoutIndex](week, content);

            // Add weather report
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

            // Add todo list with actual agenda items
            const todoList = document.createElement('div');
            todoList.classList.add('todo-list');
            todoList.style.gridColumn = layoutIndex === 0 ? 'span 1' : 'span 2';
            todoList.innerHTML = `
                <h3>This Week's Agenda</h3>
                <ul>
                    ${content.agenda.map(item => `<li><input type="checkbox"> ${item}</li>`).join('')}
                </ul>
            `;
            layout.appendChild(todoList);

            weeklyContent.appendChild(layout);
            weekModal.style.display = 'none';
        } catch (error) {
            console.error('Error loading content:', error);
            // Fall back to template content if JSON not found
            const templateContent = {
                articles: [
                    {
                        headline: "Create Your Content",
                        content: "To customize this week's content, create a JSON file at content/week" + week + ".json",
                        author: "System",
                        imageCaption: "Placeholder image"
                    },
                    {
                        headline: "Add More Articles",
                        content: "Add more articles to your JSON file to display them here",
                        author: "System",
                        imageCaption: "Placeholder image"
                    },
                    {
                        headline: "Customize Your Layout",
                        content: "Customize your layout by modifying the layout templates",
                        author: "System",
                        imageCaption: "Placeholder image"
                    }
                ],
                agenda: [
                    "Create weekly content",
                    "Add custom images",
                    "Customize layout"
                ]
            };
            
            const layout = document.createElement('div');
            layout.classList.add('newspaper-layout');
            const layoutIndex = (week - 1) % layoutTemplates.length;
            layout.innerHTML = layoutTemplates[layoutIndex](week, templateContent);
            weeklyContent.appendChild(layout);
            weekModal.style.display = 'none';
        }
    }

    // Modal functionality
    weekSelector.addEventListener('click', () => {
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

    // Initialize week links
    generateWeekLinks();

    // Load first week by default
    loadWeekContent(1);
});
