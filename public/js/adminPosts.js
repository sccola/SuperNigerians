function toDelete(postId, csrf) {
	swal({
		title: `Are you sure you want to delete this post?`,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Yes!',
		cancelButtonText: 'No.',
	}).then(async (result) => {
		if (result.value) {
			await fetch(`/admin/delete/${postId}`, {
				method: 'DELETE',
				headers: {
					'X-CSRF-TOKEN': csrf,
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
			}).then(() => {
				swal({
					title: 'Deleted!',
					text: 'Post successfully Deleted',
					type: 'success',
				}).then(() => {
					window.location = '/admin/dashboard/posts/verified';
				});
			});
		}
	});
}
