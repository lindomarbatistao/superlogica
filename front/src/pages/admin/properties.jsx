import React, { useEffect, useMemo, useRef, useState } from "react"; // ✅ MUDANÇA: adicionado useRef
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Properties() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // ✅ MUDANÇA: referência para abrir o input file oculto

  const [imoveis, setImoveis] = useState([]);
  const [lista, setLista] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const listar = async () => {
    setErro("");
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/imoveis/", headers);
      setImoveis(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível carregar a lista de imóveis.");
    } finally {
      setLoading(false);
    }
  };

  const pesquisar = async () => {
    setErro("");
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (titulo) params.append("titulo", titulo);
      if (tipo) params.append("tipo", tipo);
      if (status) params.append("status", status);

      const url = `http://127.0.0.1:8000/api/imoveis/?${params.toString()}`;
      const response = await axios.get(url, headers);

      setLista(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível realizar a pesquisa.");
    } finally {
      setLoading(false);
    }
  };

  const limparPesquisa = () => {
    setTitulo("");
    setTipo("");
    setStatus("");
    setLista([]);
  };

  const editarImovel = (id) => {
    navigate(`/admin/properties/edit/${id}`); // ✅ MUDANÇA: rota absoluta correta
  };

  const excluirImovel = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este imóvel?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/imoveis/${id}/`, headers);

      setImoveis((prev) => prev.filter((i) => i.id !== id));
      setLista((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.log(error);
      alert("Não foi possível excluir o imóvel.");
    }
  };

  const abrirSeletorExcel = () => { // ✅ MUDANÇA: nova função para abrir o seletor de arquivo
    fileInputRef.current?.click();
  };

  const importarExcel = async (event) => { // ✅ MUDANÇA: nova função para enviar o Excel
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setErro("");
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/importar_imoveis/", // ✅ MUDANÇA: endpoint de importação
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // ✅ MUDANÇA: necessário para upload
          },
        }
      );

      await listar(); // ✅ MUDANÇA: recarrega a tabela após importar
      alert("Importação realizada com sucesso.");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data); // ✅ MUDANÇA: ajuda a enxergar o erro real do backend
      setErro("Não foi possível importar a planilha.");
    } finally {
      setLoading(false);
      event.target.value = ""; // ✅ MUDANÇA: limpa o input para permitir reenviar o mesmo arquivo
    }
  };

  useEffect(() => {
    if (token) listar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Imóveis</h2>
            <p className="dashboard__subtitle">Acesso negado: token não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const pillByStatus = (s) => {
    if (s === "DISPONIVEL") return "pill pill--ok";
    if (s === "ALUGADO") return "pill pill--warn";
    return "pill";
  };

  const total = imoveis.length;
  const disponiveis = imoveis.filter((i) => i.status === "DISPONIVEL").length;
  const alugados = imoveis.filter((i) => i.status === "ALUGADO").length;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Imóveis</h2>
          <p className="dashboard__subtitle">Gerenciamento e consulta de imóveis cadastrados</p>

          <div className="actions">
            <button className="actionBtn" onClick={() => navigate("/admin/home")}>
              Dashboard
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/users")}>
              Usuários
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/payments")}>
              Pagamentos
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/contracts")}>
              Contratos
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex", // ✅ MUDANÇA: container vertical para "Conectado" + botão
            flexDirection: "column", // ✅ MUDANÇA
            gap: 10, // ✅ MUDANÇA
            alignItems: "flex-end", // ✅ MUDANÇA
          }}
        >
          <div className="dashboard__chip" title="Token carregado no navegador">
            <span className="dot" />
            <span>{loading ? "Carregando" : "Conectado"}</span>
          </div>

          <button
            className="actionBtn"
            onClick={abrirSeletorExcel} // ✅ MUDANÇA: botão para abrir seletor
            disabled={loading} // ✅ MUDANÇA
          >
            Importar Excel
          </button>

          <input
            ref={fileInputRef} // ✅ MUDANÇA: ligação com useRef
            type="file"
            accept=".xlsx,.xls" // ✅ MUDANÇA: aceita Excel
            style={{ display: "none" }} // ✅ MUDANÇA: input oculto
            onChange={importarExcel} // ✅ MUDANÇA: chama função de upload
          />
        </div>
      </div>

      <div className="status">
        <div className="card">
          <div className="card__badge badge--primary" />
          <div className="card__content">
            <p className="card__label">Total de imóveis</p>
            <p className="card__value">{total}</p>
            <p className="card__hint">Base cadastrada</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--secondary" />
          <div className="card__content">
            <p className="card__label">Pesquisa</p>
            <p className="card__value">{lista.length}</p>
            <p className="card__hint">Resultados filtrados</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--warn" />
          <div className="card__content">
            <p className="card__label">Disponíveis</p>
            <p className="card__value">{disponiveis}</p>
            <p className="card__hint">Prontos para alugar</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--danger" />
          <div className="card__content">
            <p className="card__label">Alugados</p>
            <p className="card__value">{alugados}</p>
            <p className="card__hint">Em contrato</p>
          </div>
        </div>
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Pesquisar imóveis</h3>

      <div className="tableWrap" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="inputSearch"
            placeholder="Título (ex: Casa, Apartamento...)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <input
            className="inputSearch"
            placeholder="Tipo (ex: casa, ap...)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />

          <select
            className="inputSearch"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: 220 }}
          >
            <option value="">Status (todos)</option>
            <option value="DISPONIVEL">DISPONÍVEL</option>
            <option value="ALUGADO">ALUGADO</option>
          </select>

          <button className="actionBtn" onClick={pesquisar} disabled={loading}>
            Pesquisar
          </button>

          <button className="actionBtn" onClick={limparPesquisa} disabled={loading}>
            Limpar
          </button>

          <button className="actionBtn" onClick={listar} disabled={loading}>
            Recarregar
          </button>
        </div>

        {erro && <p style={{ marginTop: 12, color: "rgba(255,255,255,0.75)" }}>{erro}</p>}
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Lista de Imóveis</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Locador</th>
              <th>Ações</th> {/* ✅ MUDANÇA: coluna de ações */}
            </tr>
          </thead>
          <tbody>
            {imoveis.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="7"> {/* ✅ MUDANÇA: colSpan ajustado */}
                  {loading ? "Carregando..." : "Nenhum imóvel encontrado."}
                </td>
              </tr>
            ) : (
              imoveis.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.titulo}</td>
                  <td>{i.tipo}</td>
                  <td>
                    <span className={pillByStatus(i.status)}>{i.status}</span>
                  </td>
                  <td>{i.valor_aluguel}</td>
                  <td>{i.locador_nome || i.locador_id || i.locador || "-"}</td> 
               {/* ✅ MUDANÇA: tenta mostrar nome */}
                  <td>
                    <div className="acoesTabela"> {/* ✅ MUDANÇA: container dos botões */}
                      <button
                        className="iconBtn editBtn" // ✅ MUDANÇA
                        onClick={() => editarImovel(i.id)} // ✅ MUDANÇA
                        title="Editar imóvel"
                      >
                        ✏️
                      </button>

                      <button
                        className="iconBtn deleteBtn" // ✅ MUDANÇA
                        onClick={() => excluirImovel(i.id)} // ✅ MUDANÇA
                        title="Excluir imóvel"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Resultado da Pesquisa</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Locador</th>
              <th>Ações</th> {/* ✅ MUDANÇA: coluna de ações */}
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="7"> {/* ✅ MUDANÇA: colSpan ajustado */}
                  {(titulo || tipo || status)
                    ? "Nenhum resultado encontrado."
                    : "Use os filtros acima para pesquisar."}
                </td>
              </tr>
            ) : (
              lista.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.titulo}</td>
                  <td>{i.tipo}</td>
                  <td>
                    <span className={pillByStatus(i.status)}>{i.status}</span>
                  </td>
                  <td>{i.valor_aluguel}</td>
                  <td>{i.locador_nome || i.locador_id || i.locador || "-"}</td> {/* ✅ MUDANÇA */}
                  <td>
                    <div className="acoesTabela"> {/* ✅ MUDANÇA */}
                      <button
                        className="iconBtn editBtn" // ✅ MUDANÇA
                        onClick={() => editarImovel(i.id)} // ✅ MUDANÇA
                        title="Editar imóvel"
                      >
                        ✏️
                      </button>

                      <button
                        className="iconBtn deleteBtn" // ✅ MUDANÇA
                        onClick={() => excluirImovel(i.id)} // ✅ MUDANÇA
                        title="Excluir imóvel"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <hr className="hr" />

      <footer className="footer">
        <div className="footerContent">
          <p className="footerSystem">Sistema de Gestão de Aluguéis</p>
          <p className="footerDev">
            Desenvolvido por <strong>Lindomar José Batistão</strong>
          </p>
          <p className="footerCopy">© {new Date().getFullYear()} Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
