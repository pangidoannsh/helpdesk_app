import { UserContext } from '@/context/UserProvider'
import React, { useContext } from 'react'

export default function ProfilePage() {
    const { user } = useContext(UserContext)
    console.log(user);

    return (
        <div>
            Profile
        </div>
    )
}

