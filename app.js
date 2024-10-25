// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9wpzpI2Bjv1YqW7U01q2bz7s2SGdByQ8",
  authDomain: "login-form-5853d.firebaseapp.com",
  projectId: "login-form-5853d",
  storageBucket: "login-form-5853d.appspot.com",
  messagingSenderId: "518112213922",
  appId: "1:518112213922:web:bb1c5fa297247442a890fb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Handle the sign-up form submission
const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default form submission

  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validate passwords
  if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match!';
      successMessage.textContent = '';
      return;
  }

  // Create user with Firebase Authentication
  auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
          const user = userCredential.user;

          // Update user profile with name
          return user.updateProfile({
              displayName: name,
          });
      })
      .then(async () => {
          // Optionally, save user data in Firestore
          try {
              await firestore.collection('users').doc(user.uid).set({
                  name: name,
                  email: email,
                  phone: phone,
                  uid: user.uid,
              });
              successMessage.textContent = 'Sign up successful!';
              errorMessage.textContent = '';
              signupForm.reset();
          } catch (error) {
              errorMessage.textContent = 'Error saving user data: ' + error.message;
          }
      })
      .catch((error) => {
          const errorMsg = error.message;
          errorMessage.textContent = errorMsg; // Display the error message
          successMessage.textContent = '';
      });
});