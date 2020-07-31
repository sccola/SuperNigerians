const Model = {
  getFormData(formEl) {
    const formData = Object.fromEntries(new FormData(formEl).entries());
    formData["location"] = Model.getLocation(formData);
    return formData;
  },
  getLocation({ country, stateOrCity }) {
    let location = country ? country + ", " : "";
    location += stateOrCity || "";
    return location;
  },
};

const View = {
  displayToastProfileUpdateNotif(message) {
    document.querySelector(".toast-body").innerHTML = message;
    $("#tstProfileUpdate").toast("show");
  },
};

const Controller = {
  init() {
    Controller.initEventListeners();
  },
  initEventListeners() {
    document
      .getElementById("btnUpdateProfile")
      .addEventListener("click", Controller.submitProfileUpdateForm, false);
  },
 async submitProfileUpdateForm(event) {
    event.preventDefault();
    const form = document.getElementById('updateProfileFormId');
    let addValidation = true;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else if (form.checkValidity()) {
      event.preventDefault();

      const userData = Model.getFormData(document.forms.updateProfileForm)
      const response = await Controller.updateProfile(userData);
      const redirect = () => {
        window.location.href = '/user/dashboard';
      };
      if (response.status === 'success') {
        toaster(response.message, 'success');
        removeToaster(3000);
        setTimeout(3100);
      } else {
        toaster(response.message, 'error');
        removeToaster(3000);
      }
    }
    if (addValidation) {
      form.classList.add('was-validated');
    }
    event.preventDefault();
  },
  async updateProfile(userData){
    const profileUrl = '/user/update';
    const [csrf] = document.getElementsByName('_csrf');

    try {
      axios.defaults.xsrfCookieName = 'csrftoken';
      axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

      const { data } = await axios({
        method: 'PUT',
        url: profileUrl,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'csrf-token': csrf.value,
        },
        data: userData,
      });

      return data;
    } catch (e) {
      return e.response.data;
    }
  }
};

Controller.init();
