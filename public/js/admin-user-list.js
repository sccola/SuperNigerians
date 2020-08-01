function toSuspend(userId, userName, csrf) {
    swal({
        title: `Are you sure you want to suspend ${userName}?`,
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No.',
    }).then(async (result) => {
        if (result.value) {
            await fetch(`/admin/suspend/${userId}`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            swal({
                title: 'Suspended!',
                text: `You have successfully suspended ${userName} from Super Nigeria platform`,
                type: 'success',
            }).then(() => {
                swal({
                    title: 'Deleted!',
                    text: `You have successfully deleted ${userName} from Super Nigeria platform`,
                    type: 'success',
                }).then(() => {
                    window.location = '/admin/dashboard/users';
                });
            })
        }
    });
}