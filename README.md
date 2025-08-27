# dinetime
This app helps you to book table in your favorite restaurants.

# 📌 Project Overview

The Dinner Table Booking App is a mobile application designed to help users easily search, discover, and reserve tables at their favorite restaurants. Instead of manually calling or visiting restaurants to check availability, users can conveniently browse nearby dining options and book a table in just a few taps.
The app leverages Firebase as the backend for authentication, data storage, and real-time updates. Restaurants are stored in Firestore, and users can perform search queries (with filters) to quickly find the right place.

# 📱 **React Native Project Documentation**

This project is built using React Native with several libraries and techniques to ensure a smooth, responsive, and user-friendly mobile application experience. Below is the detailed documentation of the features, libraries, and concepts used in the project.

# 🚀 **Getting Started**
### 1. <ins>[Features](#-features)</ins>
### 2. <ins>[Key Features/Third party libraries Implemented](#-key-featuresthird-party-libraries-implemented)</ins>
### 3. <ins>[Core Functionalities](#-core-functionalities)</ins>
### 4. <ins>[Technologies & Tools Used](#️-technologies--tools-used)</ins>
### 5. <ins>[Project Workflow](#-project-workflow)</ins>
### 6. <ins>[Signals & Navigation Usage](#-signals--navigation-usage)</ins>
### 7. <ins>[Conclusion](#-conclusion)</ins>

# 🚀 **Features**

🔐 User Authentication – Secure login and signup using Firebase Authentication.
🍴 Restaurant Listings – Displays a list of restaurants stored in Firestore.
🔍 Smart Search – Users can search restaurants by name with real-time suggestions.
📅 Table Booking System – Reserve a table for a specific date and time.
🕑 Booking History – Keep track of past and upcoming reservations.
☁️ Cloud Firestore Integration – Real-time updates for restaurant availability and bookings.
📱 Responsive UI – Clean and user-friendly interface built with React Native.

# 🚀 **Key Features/Third party libraries Implemented**

Ionicons – Used for adding scalable and customizable icons across the application.
Formik – A third-party library for handling forms such as sign-up, sign-in, and profile updates.
Expo Linear Gradient – For smooth and vibrant background designs, with multiple colors and sleek transitions in linear directions.
Expo Router – A file-based routing system where the file/folder structure defines routes automatically. This makes navigation across different screens of the app simple and structured.

# 📑 **Core Functionalities**

Add User – Add and store user details.
Add DOC – Add and manage document details.
Update DOC – Update already existing document details.
Update User – Update user profile information.
Delete DOC – Delete an existing document from the database.
Delete User – Remove an existing user’s details.
Display DOC – Display stored documents for the user.
Display User – Display stored user details.
Fetch Data from Firestore – Retrieve data in real-time from Firebase Firestore database.
Signal Alert – Error-based prompts to guide users during incorrect actions.
Signal Use Visuals – Properly designed UI alerts for both errors and success confirmations.
Navigation-based Signal – Auto-redirect the user after successful login, logout, or registration.

# ⚙️ Technologies & Tools Used

React Native – Base framework for mobile app development.
Expo – For faster development, testing, and deployment.
Formik – Easy form management with validations.
Expo Linear Gradient – For designing colorful backgrounds.
Expo Router – For file-based routing and navigation.
Firebase (Firestore & Authentication) – Backend database and authentication service.

# 📂 Project Workflow

1. User Authentication

     Signup & Signin forms built with Formik.
   
     Authentication handled using Firebase Authentication.
   
     After successful login → redirect user to Dashboard.

3. Profile Management

     Add, update, and delete user profile data.
       
     Form data stored and retrieved from Firestore.

5. Document Management (DOC)
   
     Add new documents with details.
   
     Update document details.

     Delete documents.

     Display documents stored in Firestore.

7. UI/UX Enhancements
   
     Icons via Ionicons.
     Smooth gradients via Expo Linear Gradient.  
     Error/success alerts via signal-based notifications.

# 🧩 Signals & Navigation Usage

   Signal Alert (C) → Error/Warning/Success alerts to guide users.
   
   Navigation Signal (C) → Automatically navigate users to dashboard, login, or profile page after certain actions (e.g., login success).
   
   Visual Signal → UI prompts for better user experience.   

#⚡ Getting Started 

Follow these steps to set up the project on your local machine:

1️⃣ Prerequisites
      Install Node.js(>= 16.x recommended)
      Install Expo Go app on your Android/iOS device
      Install Expo CLI globally:
          npm install -g expo-cli
          
2️⃣ Clone the Repository
      git clone https://github.com/<your-username>/<your-repo-name>.git
      cd <your-repo-name>
      
3️⃣ Install Dependencies
      npm install
      # or
      yarn install
    
4️⃣ Setup Firebase
      Create a Firebase project from the Firebase Console
      Enable Firestore Database and Authentication (Email/Password).
      Copy your Firebase config and add it to your project (usually in firebase.js).

5️⃣ Run the Project
      npm start
      # or
      yarn start
  -> This will open the Expo Dev Tools in your browser.
  -> Scan the QR code using the Expo Go app to preview on your device.

# 📖 Conclusion
   This project demonstrates how to build a scalable and responsive React Native mobile application by integrating Firebase, Expo, Formik, Expo Router, Linear Gradients, and custom signals. The structured           approach ensures easy navigation, smooth UI/UX, and real-time database connectivity.
      ⚡ This app is built to simplify the dining experience for users while giving restaurants a reliable platform to manage reservations.
