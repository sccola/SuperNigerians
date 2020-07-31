function Delete(userId, userName, csrf) {
    swal({
        title: `Are you sure you want to delete ${userName}?`,
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No.',
    }).then(async (result) => {
        if (result.value) {
            await fetch(`/admin/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                },
            });
            swal({
                title: 'Deleted!',
                text: `You have successfully deleted ${userName} from Super Nigeria platform`,
                type: 'success',
            }).then(() => {
                window.location = '/admin/dashboard/users';
            });
        }
    });
}