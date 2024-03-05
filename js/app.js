// Load All Posts
const loadAllPosts = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/retro-forum/posts');
    const data = await response.json();
    const allPosts = data.posts;
    // console.log(allPosts);

    // Get the posts container by ID
    const postsContainer = document.getElementById('mainPostsContainer');
    postsContainer.innerHTML = ''; // Clear the existing posts before loading new ones

    allPosts.forEach(post => {
        // console.log(post);
        
        //  Create a div in the post container
        const singlePost = document.createElement('div');
        singlePost.classList = 'posts-container';

        // Set inner HTML
        singlePost.innerHTML = `
            <div class="author-profile">
                <img src="${post.image}" alt="profile">
                <span class="active-status ${post.isActive}"></span>
            </div>
            <div class="post-content-area">
                <p class="font-bold">
                    <span>#${post.category}</span>
                    <span>Author: ${post.author.name}</span>
                </p>
                <h1 class="font-bold text-xl mt-1 mb-5">${post.title}</h1>
                <p class="text-[18px] text-[#6C6C7D]">${post.description}</p>
                <div class="flex justify-between mt-7 border-t-2 border-dashed pt-5 border-[#BABBC3] post-meta-bottom">
                    <div class="flex space-x-5 items-center">
                        <p><i class="fa-solid fa-comment"></i> <span>${post.comment_count}</span></p>
                        <p><i class="fa-solid fas fa-eye"></i> <span>${post.view_count}</span></p>
                        <p><i class="fa-solid fa-clock"></i> <span>${post.posted_time} min</span></p>
                    </div>
                    <div>
                        <button onclick="handleMarkButton(${JSON.stringify(post)})" class="marked-post-button"><i class="fa-solid fa-envelope"></i></button>
                    </div>
                </div>
            </div>
        `
        // AppendChild
        postsContainer.appendChild(singlePost);
        // Add event listener to the button
        const markedPostButton = singlePost.querySelector('.marked-post-button');
        markedPostButton.addEventListener('click', () => {
            // console.log('Button clicked');
            if (markedPostButton.classList.contains('marked')) {
                // If the button is marked, remove the 'marked' class and change the icon to fa-envelope
                markedPostButton.classList.remove('marked');
                markedPostButton.innerHTML = '<i class="fa-solid fa-envelope"></i>';
            } else {
                // If the button is not marked, add the 'marked' class and change the icon to fa-envelope-open
                markedPostButton.classList.add('marked');
                markedPostButton.innerHTML = '<i class="fa-solid fa-envelope-open"></i>';
            }
            handleMarkButton(post);
        });


    });
    // Hide loading spinner after loading is complete
    toggleLoader(false);
}

// Load Latest posts data 
const loadLatestPostsdata = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/retro-forum/latest-posts');
    const data = await response.json();
    const latestPosts = data;
    // console.log(latestPosts);

    // Step 1: Get the latest container Div by Tag
    const latestPostsContainer = document.getElementById('latest-posts-container');
    // loop forEach
    latestPosts.forEach(latestPost => {
        // console.log(latestPost);
        // Step 2: Create div in the latest post container
        const latestSingle = document.createElement('div');
        latestSingle.classList = 'post-content-inner';

        // Step 3: Set inner HTML
        latestSingle.innerHTML = `
            <div class="post-thumbnail">
                <img src="${latestPost.cover_image}" alt="">
            </div>
            <div class="post-content">
                <p class="mb-2"><i class="fa-solid fa-calendar-days"></i> <span>${latestPost?.author?.posted_date || 'No publish date'}</span></p>
                <h1 class="font-extrabold text-[18px] mb-2">${latestPost.title}</h1>
                <p>${latestPost.description.slice(0, 100)}</p>
            </div>
            <div class="latest-post-author">
                <div>
                    <img src="${latestPost.profile_image}" alt="">
                </div>
                <div>
                    <h3 class="font-extrabold text-base">${latestPost.author.name}</h3>
                    <p>${latestPost?.author?.designation || 'Unknown'}</p>
                </div>
            </div>
        `
        latestPostsContainer.appendChild(latestSingle);
    })
}

// Function to display the count of marked posts
const displayMarkedPostsCount = () => {
    const markAsReadContainer = document.getElementById('markasread');
    const countMarkedPosts = markAsReadContainer.children.length;

    // Update the content of the #markedAsReadCount tag
    const markedAsReadCount = document.getElementById('markedAsReadCount');
    markedAsReadCount.textContent = countMarkedPosts;
}
// Dynamic Function For Mark As Read div 
const handleMarkButton = (post) => {
    console.log('handleMarkButton called'); // Add this line to check if the function is called
    // Get the markasread container where you want to append the marked post
    const markAsRead = document.getElementById('markasread');

    // Check if the post is already marked
    const markedPost = markAsRead.querySelector(`[data-post-id="${post.id}"]`);
    if (markedPost) {
        // If the post is already marked, remove it
        markedPost.remove();
        displayMarkedPostsCount(); // Update count after unmarking a post
        return; // Exit the function
    }

    // Get the title and view_count from the post object
    const { id, title, view_count } = post;

    // Create a div to hold the marked post information
    let singleMarkRead = document.createElement('div');
    
    // Set inner HTML with dynamic data
    singleMarkRead.innerHTML = `
        <p id="mark-post-title">${title}</p>
        <span><i class="fa far fa-eye"></i> <span id="mark-post-views">${view_count}</span></span>
    `;

    // Add data attribute to identify the marked post
    singleMarkRead.setAttribute('data-post-id', id);

    // Append the dynamically created element to the markasread container
    markAsRead.appendChild(singleMarkRead);

    displayMarkedPostsCount(); // Update count after marking a post
}

window.onload = function() {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'none';
};
// Search Spinner
const toggleLoader = (isLoading, callback) => {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (isLoading) {
        loadingSpinner.style.display = 'block'; // Show loading spinner
    } else {
        // Hide the loading spinner
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            // Call the callback function after hiding the spinner
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, 2000);
    }
}


// Updated search function
const loadSearchPosts = async (searchValue) => {
    const defaultPostsContainer = document.getElementById('mainPostsContainer');
    const searchPostContainer = document.getElementById('searchposts');
    searchPostContainer.style.display = 'none'; // Hide search container before loading

    // Show loading spinner
    toggleLoader(true);

    // Clear another section before search new post
    mainPostsContainer.innerHTML = '';

    const response = await fetch(`https://openapi.programming-hero.com/api/retro-forum/posts?category=${searchValue}`);
    const data = await response.json();
    const searchPosts = data.posts;
    
    // Clear Search container before search new post
    searchPostContainer.innerHTML = '';
    

    if (searchPosts.length === 0 && searchValue.trim() !== '') {
        // If no search results are found and the search value is not empty, display a message
        searchPostContainer.innerHTML = '<p class="text-xl font-extrabold mb-10">No results found.</p>';
    } else {
        // If search results are found or the search value is empty, display each post
        searchPosts.forEach(searchPost => {
            // Create and append the post elements
            const singleSearchPost = document.createElement('div');
            singleSearchPost.classList = 'posts-container';
            singleSearchPost.innerHTML = `
            <div class="author-profile">
                <img src="${searchPost.image}" alt="profile">
                <span class="active-status ${searchPost.isActive}"></span>
            </div>
            <div class="post-content-area">
                <p class="font-bold">
                    <span>#${searchPost.category}</span>
                    <span>Author: ${searchPost.author.name}</span>
                </p>
                <h1 class="font-bold text-xl mt-1 mb-5">${searchPost.title}</h1>
                <p class="text-[18px] text-[#6C6C7D]">${searchPost.description}</p>
                <div class="flex justify-between mt-7 border-t-2 border-dashed pt-5 border-[#BABBC3] post-meta-bottom">
                    <div class="flex space-x-5 items-center">
                        <p><i class="fa-solid fa-comment"></i> <span>${searchPost.comment_count}</span></p>
                        <p><i class="fa-solid fas fa-eye"></i> <span>${searchPost.view_count}</span></p>
                        <p><i class="fa-solid fa-clock"></i> <span>${searchPost.posted_time} min</span></p>
                    </div>
                    <div>
                        <button onclick="handleMarkButton(${JSON.stringify(searchPost)})" class="marked-post-button"><i class="fa-solid fa-envelope"></i></button>
                    </div>
                </div>
            </div>
            `;
            searchPostContainer.appendChild(singleSearchPost);

            // Mark as read for search
            const markedPostButton = singleSearchPost.querySelector('.marked-post-button');
            markedPostButton.addEventListener('click', () => {
                // console.log('Button clicked 1');
                if (markedPostButton.classList.contains('marked')) {
                    // If the button is marked, remove the 'marked' class and change the icon to fa-envelope
                    markedPostButton.classList.remove('marked');
                    markedPostButton.innerHTML = '<i class="fa-solid fa-envelope"></i>';
                } else {
                    // If the button is not marked, add the 'marked' class and change the icon to fa-envelope-open
                    markedPostButton.classList.add('marked');
                    markedPostButton.innerHTML = '<i class="fa-solid fa-envelope-open"></i>';
                }
                handleMarkButton(searchPost);
            });
        });
    }

    // Hide loader and show the search container after loading is complete
    toggleLoader(false, () => {
        searchPostContainer.style.display = 'block';
    });
}

// Handle Search Bar
const handleSearch = () => {
    toggleLoader(true);
    const searchInput = document.getElementById('searchinput');
    const searchButton = document.getElementById('searchbutton');
    const searchValue = searchInput.value.trim(); // Trim whitespace from input value

    // Disable the button if the input is empty
    searchButton.disabled = searchValue === '';

    if (searchValue !== '') {
        loadSearchPosts(searchValue);

        // Clear the input field
        searchInput.value = '';

        // Disable the search button after submitting the search
        searchButton.disabled = true;
    }
}

const searchInput = document.getElementById('searchinput');
const searchButton = document.getElementById('searchbutton');

// Add event listener to the search input field
searchInput.addEventListener('input', () => {
    // Enable the search button if the input is not empty
    searchButton.disabled = searchInput.value.trim() === '';
});


loadSearchPosts();

loadLatestPostsdata();
loadAllPosts();