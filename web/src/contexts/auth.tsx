import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string,
    name: string,
    login: string,
    avatar_url: string
}

type AuthContextData = {
    user: User | null,
    signInURL: string,
    signOut: () => void
}

type AuthProvider = {
    children: ReactNode
}

type AuthResponse = {
    token: string,
    user: {
        id: string,
        avatar_url: string,
        name: string,
        login: string
    } 
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider (props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)
    const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=83bd294348faeb45c436`

    async function signIn (githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        })

        const {token, user} = response.data
        api.defaults.headers.common.authorization = `Bearer ${token}`

        localStorage.setItem('@DoWhile:token', token)

        setUser(user)        
    }

    function signOut () {
        setUser(null)
        localStorage.removeItem('@DoWhile:token')
    }

    useEffect(() => {
        const token = localStorage.getItem('@DoWhile:token')
        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    })

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [pageUrl, githubCode] = url.split('?code=')
            window.history.pushState({}, '', pageUrl)
            signIn(githubCode)
        }
    }, [])
    return (
        <AuthContext.Provider value={{signInURL, user, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}