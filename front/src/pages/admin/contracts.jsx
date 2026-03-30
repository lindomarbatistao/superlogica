import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Contracts() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [contratos, setContratos] = useState([]);
  const [lista, setLista] = useState([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [valor, setValor] = useState("");

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
      const response = await axios.get(
        "http://127.0.0.1:8000/api/contratos/",
        headers
      );
      setContratos(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível carregar a lista de contratos.");
    } finally {
      setLoading(false);
    }
  };

  const pesquisar = async () => {
    setErro("");
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (dataInicio) params.append("data_inicio", dataInicio);
      if (dataFim) params.append("data_fim", dataFim);
      if (valor) params.append("valor", valor);

      const url = `http://127.0.0.1:8000/api/contratos/?${params.toString()}`;
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
    setDataInicio("");
    setDataFim("");
    setValor("");
    setLista([]);
  };

  const editarContrato = (id) => {
    navigate(`/admin/contracts/edit/${id}`);
  };

  const excluirContrato = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este contrato?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/contratos/${id}/`, headers);

      setContratos((prev) => prev.filter((c) => c.id !== id));
      setLista((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log(error);
      alert("Não foi possível excluir o contrato.");
    }
  };

  const abrirSeletorExcel = () => {
    fileInputRef.current?.click();
  };

  const importarExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setErro("");
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/importar_contratos/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await listar();
      alert("Importação realizada com sucesso.");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
      setErro("Não foi possível importar a planilha.");
    } finally {
      setLoading(false);
      event.target.value = "";
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
            <h2 className="dashboard__title">Contratos</h2>
            <p className="dashboard__subtitle">
              Acesso negado: token não encontrado
            </p>
          </div>
        </div>
      </div>
    );
  }

  const total = contratos.length;
  const encerrados = contratos.filter((c) => {
    if (!c.data_fim) return false;
    return new Date(c.data_fim) < new Date();
  }).length;

  const ativos = contratos.filter((c) => {
    if (!c.data_fim) return true;
    return new Date(c.data_fim) >= new Date();
  }).length;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Contratos</h2>
          <p className="dashboard__subtitle">
            Gerenciamento e consulta de contratos cadastrados
          </p>

          <div className="actions">
            <button className="actionBtn" onClick={() => navigate("/admin/home")}>
              Dashboard
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/users")}>
              Usuários
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/properties")}>
              Imóveis
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/payments")}>
              Pagamentos
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <div className="dashboard__chip" title="Token carregado no navegador">
            <span className="dot" />
            <span>{loading ? "Carregando" : "Conectado"}</span>
          </div>

          <button
            className="actionBtn"
            onClick={abrirSeletorExcel}
            disabled={loading}
          >
            Importar Excel
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={importarExcel}
          />
        </div>
      </div>

      <div className="status">
        <div className="card">
          <div className="card__badge badge--primary" />
          <div className="card__content">
            <p className="card__label">Total de contratos</p>
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
            <p className="card__label">Ativos</p>
            <p className="card__value">{ativos}</p>
            <p className="card__hint">Dentro da vigência</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--danger" />
          <div className="card__content">
            <p className="card__label">Encerrados</p>
            <p className="card__value">{encerrados}</p>
            <p className="card__hint">Com data final vencida</p>
          </div>
        </div>
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Pesquisar contratos</h3>

      <div className="tableWrap" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="inputSearch"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />

          <input
            className="inputSearch"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />

          <input
            className="inputSearch"
            type="number"
            step="0.01"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

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

        {erro && (
          <p style={{ marginTop: 12, color: "rgba(255,255,255,0.75)" }}>
            {erro}
          </p>
        )}
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Lista de Contratos</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data início</th>
              <th>Data fim</th>
              <th>Valor</th>
              <th>Imóvel</th>
              <th>Locador</th>
              <th>Locatário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contratos.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="8">
                  {loading ? "Carregando..." : "Nenhum contrato encontrado."}
                </td>
              </tr>
            ) : (
              contratos.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.data_inicio}</td>
                  <td>{c.data_fim}</td>
                  <td>{c.valor}</td>
                  <td>{c.imovel_titulo || c.imovel_id || c.imovel || "-"}</td>
                  <td>{c.locador_nome || c.locador_id || c.locador || "-"}</td>
                  <td>{c.locatario_nome || c.locatario_id || c.locatario || "-"}</td>
                  <td>
                    <div className="acoesTabela">
                      <button
                        className="iconBtn editBtn"
                        onClick={() => editarContrato(c.id)}
                        title="Editar contrato"
                      >
                        ✏️
                      </button>

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => excluirContrato(c.id)}
                        title="Excluir contrato"
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
              <th>Data início</th>
              <th>Data fim</th>
              <th>Valor</th>
              <th>Imóvel</th>
              <th>Locador</th>
              <th>Locatário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="8">
                  {(dataInicio || dataFim || valor)
                    ? "Nenhum resultado encontrado."
                    : "Use os filtros acima para pesquisar."}
                </td>
              </tr>
            ) : (
              lista.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.data_inicio}</td>
                  <td>{c.data_fim}</td>
                  <td>{c.valor}</td>
                  <td>{c.imovel_titulo || c.imovel_id || c.imovel || "-"}</td>
                  <td>{c.locador_nome || c.locador_id || c.locador || "-"}</td>
                  <td>{c.locatario_nome || c.locatario_id || c.locatario || "-"}</td>
                  <td>
                    <div className="acoesTabela">
                      <button
                        className="iconBtn editBtn"
                        onClick={() => editarContrato(c.id)}
                        title="Editar contrato"
                      >
                        ✏️
                      </button>

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => excluirContrato(c.id)}
                        title="Excluir contrato"
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
          <p className="footerCopy">
            © {new Date().getFullYear()} Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}