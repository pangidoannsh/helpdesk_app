import AuthApi from '@/services/authApi';
import React, { ReactNode, useEffect, useState } from 'react'

interface User {
  id?: any;
  name?: string;
  level?: string;
  fungsi?: {
    id: any,
    name: any
  }
}
interface UserContextProps {
  user: User,
  setUser: (user: User) => void;
}
export const UserContext = React.createContext<UserContextProps>({
  user: {},
  setUser: () => { },
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({});

  let hasMount = false;
  useEffect(() => {
    if (!hasMount) {
      AuthApi.get("/auth/profile").then((res: any) => {
        setUser(res.data);
      }).catch((err: any) => {
        console.log(err);
      })
    }
    return () => {
      hasMount = true;
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
