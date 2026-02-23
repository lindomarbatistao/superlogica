import React, {useEffect} from "react"
import axios from "axios"

export default function HomeUser() {

    const token = localStorage.getItem('token')

    const listar = async ()=>{
        const response = await axios.get('http://localhost:8000/api/usuarios')
        console.log("Lista de usuários: ", response.data);
        
    }

    useEffect(()=>{listar()}, [])

    return (
        <div>
            <p>Essa é a página HOME USER</p>
            
        </div>
    )
}