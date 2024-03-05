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


loadAllPosts();