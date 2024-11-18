'use client';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfileClient() {
    const { user, error, isLoading } = useUser();
    console.log("Auth0 User: ", user);
    const userPicture = user?.picture || 'https://anycopy.io/favicon.ico';

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        user && (
            <div>
                <img src={userPicture} alt={user.name || 'User'} style={{
                    marginTop:'80px',
                    width: '50px',  // Set the desired width
                    height: '50px', // Set the desired height
                    borderRadius: '50%', // Makes the image round
                    objectFit: 'cover'   // Ensures the image content fits nicely
                }} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
}
