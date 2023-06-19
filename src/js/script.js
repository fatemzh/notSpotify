//Search bar
window.onload = function() {

    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', function(e) {

        const term = e.target.value.toLowerCase();

        const rows = document.querySelectorAll('.table tbody tr');
        for (const row of rows) {

            const title = row.children[1].textContent.toLowerCase();

            const artist = row.children[2].textContent.toLowerCase();

            const album = row.children[3].textContent.toLowerCase();

            if (title.indexOf(term) === -1 && artist.indexOf(term) === -1 && album.indexOf(term) === -1) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        }
    });

    //Like function
    if (window.jQuery) {  
        $(".like-btn").on("click", function() {
            $(this).toggleClass("clicked");
        });
    } else {
       console.log("jQuery is not loaded");
    }
};