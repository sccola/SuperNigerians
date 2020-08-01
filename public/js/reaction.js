const like = document.getElementById('user-like');
const unlike = document.getElementById('user-unlike');
console.log(unlike)
let likelist = like.dataset.like
let dislikelist = unlike.dataset.dislike
let id = like.dataset.creator

if (JSON.parse(likelist).indexOf(id) !== -1) {
    document.getElementById('like').innerHTML = 'liked';
} else {
    document.getElementById('like').innerHTML = 'like';
}


if (JSON.parse(dislikelist).indexOf(id) !== -1) {
    document.getElementById('unlike').innerHTML = 'disliked';
} else {
    document.getElementById('unlike').innerHTML = 'dislike';
}

like.addEventListener('click', () => {
    const slug = like.dataset.slug
    axios({
            method: 'patch',
            url: `/post/${slug}/like`,
            headers: {
                'X-CSRF-TOKEN': like.dataset.token,
            }
        })
        .then(function (response) {
            console.log(response);
            console.log(response.data.result.like)
            if (response.data.status) {
                document.getElementById('like').innerHTML = 'liked';
            } else {
                document.getElementById('like').innerHTML = 'like';
            }
        })
        .catch(function (error) {
            console.log(error);
        });

})

unlike.addEventListener('click', () => {
    const slug = like.dataset.slug
    axios({
            method: 'patch',
            url: `/post/${slug}/dislike`,
            headers: {
                'X-CSRF-TOKEN': like.dataset.token,
            }
        })
        .then(function (response) {
            console.log(response);
            console.log(response.data.result.dislike)
            if (response.data.status) {
                document.getElementById('unlike').innerHTML = 'disliked';
            } else {
                document.getElementById('unlike').innerHTML = 'dislike';
            }
        })
        .catch(function (error) {
            console.log(error);
        });

})
