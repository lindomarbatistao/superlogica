import React, {useState} from "react"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './styles.css'

export default function Login(){
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const logar = async (e)=>{
        e.preventDefault()
        setMessage("")
        setLoading(true)
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token',
                {
                    username: user,
                    password: password
                }
            )
            
            const access = response.data.access

            localStorage.setItem("token", access)

            setMessage("Usuário logado")
            
            const me = await axios.get('http://127.0.0.1:8000/api/usuarios/me/',{
                headers: {Authorization: `Bearer ${access}`}
            })

            console.log("Dados: ", me.data);
            
            const {is_superuser, is_staff, is_active}= me.data

            if (!is_active){
                localStorage.removeItem("token")
                setMessage("Usuário inativo. Contate o Administrador")
                setLoading(false)
                return
            }


        } catch (error) {
            console.log("Error: ", error);
            setMessage("Usuário ou senha inválido...")
        }

    }

    return(
        <div className="container_login">
            <section className="section_1">
                <p className="user">Login</p>

                <p>Usuario</p>
                <input
                    className="caixa"
                    value={user}
                    onChange={(e)=>{setUser(e.target.value)}}
                    placeholder="User"
                />

                <p>Senha</p>
                <input
                    className="caixa"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    placeholder="Password"
                />

                <div className="text_1">
                    <p>{message}</p>
                </div>

                <button className="btn_1" onClick={logar}>Enter</button>
            </section>
        </div>
    )
}
