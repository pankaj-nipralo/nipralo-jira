import React from 'react'
import SettingsProfile from '@/components/MyAccount/SettingsProfile'


const mockUser = {
  username: "jane_doe",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "Project Manager",
  avatar: "/window.svg", // or null to use default
};

const MyAccount = () => {
  return (
    <SettingsProfile user={mockUser} />
      
  )
}

export default MyAccount
