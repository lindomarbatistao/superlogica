import React, { useEffect, useState } from "react"
import axios from "axios"

export default function HomeUser() {
    const [user, setUser] = useState([])
    const [password, setPassword] = useState('')
    const [nome, setNome] = useState('')
    const [lista, setLista] = useState([])

    const token = localStorage.getItem('token')

    const listar = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            })
            // console.log("Lista de usuários: ", response.data); 
            setUser(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    const pesquisar = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/usuarios?nome=${encodeURIComponent(nome)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setLista(response.data)
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => { listar() }, [])

    return (
        <div>
            <h2>Lista de Usuários</h2>
            {/*Tabela principal */}
            <table border="1" cellPadding="6" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nome}</td>
                            <td>{u.email}</td>
                            <td>{u.telefone}</td>
                            <td>{u.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr style={{ margin: "20px 0" }} />

            <div>
                Pesquisar
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <input
                        style={{ padding: '5px' }}
                        placeholder="Digite um nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        type="text"
                    />
                    <button onClick={pesquisar} style={{ fontSize: '11px', padding: '5px' }}>Ok</button>
                </div>
                <table border="1" cellPadding="6" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nome}</td>
                            <td>{u.email}</td>
                            <td>{u.telefone}</td>
                            <td>{u.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}