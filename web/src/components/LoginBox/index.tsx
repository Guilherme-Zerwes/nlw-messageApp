import styles from './styles.module.scss'
import {VscGithub} from 'react-icons/vsc'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

export function LoginBox() {

    const {signInURL} = useContext(AuthContext)

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInURL} className={styles.singInWithGithub}>
                <VscGithub size={24}/>
                Entrar com Github
            </a>
        </div>
    )
}