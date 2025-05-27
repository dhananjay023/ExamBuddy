// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navLinks.contains(event.target);
        
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Add scroll event for navbar styling
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'var(--bg-primary)';
                navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                navbar.style.backgroundColor = 'transparent';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Simulated search function - would connect to a real search system in production
    function performSearch(query) {
        if (query.trim() === '') return;
        
        // In a real implementation, this would redirect to search results
        // For now, we'll just log the search and show an alert
        console.log('Search query:', query);
        alert(`Searching for: ${query}\n\nIn a complete implementation, this would show actual results.`);
        
        // Future implementation would redirect to a search results page like:
        // window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
    }
    
    // Animation for elements as they enter viewport
    const animatedElements = document.querySelectorAll('.feature-card, .class-card, .subject-card, .sample-card');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = elementTop < window.innerHeight && elementBottom > 0;
            
            if (isVisible) {
                element.classList.add('fadeIn');
            }
        });
    }
    
    // Initial check on load
    checkIfInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Toggle solution visibility
    const questions = document.querySelectorAll('.question');
    
    questions.forEach(question => {
        const solution = question.querySelector('.solution');
        if (solution) {
            // Add toggle functionality in the future if needed
            // For now, solutions are always visible
        }
    });
    
    // Initialize load more functionality
    setupLoadMore();
});

// Bookmarking functionality
const setupBookmarks = () => {
    // Get all bookmark buttons
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    // Get bookmarks from local storage or initialize empty array
    const getBookmarks = () => {
        const bookmarks = localStorage.getItem('learnncert-bookmarks');
        return bookmarks ? JSON.parse(bookmarks) : [];
    };
    
    // Save bookmarks to local storage
    const saveBookmarks = (bookmarks) => {
        localStorage.setItem('learnncert-bookmarks', JSON.stringify(bookmarks));
    };
    
    // Toggle bookmark
    const toggleBookmark = (id, title, type) => {
        const bookmarks = getBookmarks();
        const index = bookmarks.findIndex(bookmark => bookmark.id === id);
        
        if (index === -1) {
            // Add bookmark
            bookmarks.push({ id, title, type, date: new Date().toISOString() });
        } else {
            // Remove bookmark
            bookmarks.splice(index, 1);
        }
        
        saveBookmarks(bookmarks);
        updateBookmarkButtons();
        
        // Show feedback
        const message = index === -1 ? 'Bookmark added!' : 'Bookmark removed';
        showToast(message);
    };
    
    // Update bookmark button states
    const updateBookmarkButtons = () => {
        const bookmarks = getBookmarks();
        
        bookmarkButtons.forEach(button => {
            const id = button.dataset.id;
            const isBookmarked = bookmarks.some(bookmark => bookmark.id === id);
            
            if (isBookmarked) {
                button.classList.add('bookmarked');
                button.querySelector('i').classList.remove('far');
                button.querySelector('i').classList.add('fas');
            } else {
                button.classList.remove('bookmarked');
                button.querySelector('i').classList.remove('fas');
                button.querySelector('i').classList.add('far');
            }
        });
    };
    
    // Add click event listeners to bookmark buttons
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const title = button.dataset.title;
            const type = button.dataset.type;
            toggleBookmark(id, title, type);
        });
    });
    
    // Show toast notification
    const showToast = (message) => {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };
    
    // Initialize bookmark buttons
    updateBookmarkButtons();
};

// Initialize bookmarks when viewing content pages
if (document.querySelector('.bookmark-btn')) {
    setupBookmarks();
}

// Load More Resources Functionality
const setupLoadMore = () => {
    const resourcesGrid = document.querySelector('.resources-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (!resourcesGrid || !loadMoreBtn) return;
    
    const resourceCards = resourcesGrid.querySelectorAll('.resource-card');
    const cardsPerLoad = 3; // Number of cards to show per load
    let currentlyVisible = 0;
    
    // Function to show next batch of cards
    const showNextBatch = () => {
        const nextBatch = Array.from(resourceCards).slice(currentlyVisible, currentlyVisible + cardsPerLoad);
        
        if (nextBatch.length === 0) {
            loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Show loading state
        loadMoreBtn.classList.add('loading');
        const btnIcon = loadMoreBtn.querySelector('i');
        btnIcon.classList.remove('fa-chevron-down');
        btnIcon.classList.add('fa-spinner');
        
        // Simulate loading delay (remove in production)
        setTimeout(() => {
            nextBatch.forEach(card => {
                card.classList.add('visible');
            });
            
            currentlyVisible += cardsPerLoad;
            
            // Hide button if no more cards
            if (currentlyVisible >= resourceCards.length) {
                loadMoreBtn.style.display = 'none';
            }
            
            // Remove loading state
            loadMoreBtn.classList.remove('loading');
            btnIcon.classList.remove('fa-spinner');
            btnIcon.classList.add('fa-chevron-down');
        }, 500);
    };
    
    // Hide all cards initially
    resourceCards.forEach(card => {
        card.classList.remove('visible');
    });
    
    // Show initial batch
    showNextBatch();
    
    // Add click event listener
    loadMoreBtn.addEventListener('click', showNextBatch);
};