# SocialNetworking (LinkedIn Clone)

## Overview

SocialNetworking is a full-stack web application that allows users to create profiles, connect with other users, and interact in a social network environment. The platform supports real-time updates for connections, likes, and comments, giving users an interactive experience similar to professional networking sites.

**Live Demo:** [SocialNetworking Live](https://socialnetworking-1.onrender.com)

## Features

* **User Authentication:** Secure login, logout, and session management using JWT.
* **Profile Management:** Users can create, view, and update their profiles, including profile and cover images.
* **Connections:** Send, accept, reject, and remove connection requests with real-time status updates.
* **Posts and Interactions:** Users can create posts, like posts, and comment, with real-time updates visible to all connected users.
* **Search Users:** Search for users by first name, last name, or username.
* **Responsive Design:** Works on both desktop and mobile devices.

## Tech Stack

* **Frontend:** React, Tailwind CSS, React Router, React Icons
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Real-time:** Socket.io for live updates on connections, likes, and comments
* **Authentication:** JWT, cookies
* **File Storage:** Cloudinary for images

## Installation

### Backend

1. Navigate to the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the backend server:

```bash
npm run dev
```

### Frontend

1. Navigate to the frontend folder:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set the backend server URL in `AuthContext.jsx`:

```js
export const serverUrl = "http://localhost:8000";
```

4. Start the frontend:

```bash
npm start
```

## Real-time Features

* **Connections:** When a connection request is sent, accepted, or removed, both users’ interfaces update immediately without reloading.
* **Likes & Comments:** Posts and comments are updated in real-time for all users.

## Usage

1. Sign up or log in to the platform.
2. Update your profile with personal information and images.
3. Search for users by first name, last name, or username.
4. Send, accept, or reject connection requests.
5. Create posts, like posts, and add comments. All interactions update in real-time.
