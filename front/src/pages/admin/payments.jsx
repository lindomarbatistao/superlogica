import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Payments() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [pagamentos, setPagamentos] = useState([]);
  const [lista, setLista] = useState([]);

  const [dataPagamento, setDataPagamento] = useState("");
  const [statusPagamento, setStatusPagamento] = useState("");

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
        "http://127.0.0.1:8000/api/pagamentos/",
        headers
      );
      setPagamentos(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível carregar a lista de pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  const pesquisar = async () => {
    setErro("");
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (dataPagamento) params.append("data_pagamento", dataPagamento);
      if (statusPagamento !== "") params.append("status", statusPagamento);

      const url = `http://127.0.0.1:8000/api/pagamentos/?${params.toString()}`;
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
    setDataPagamento("");
    setStatusPagamento("");
    setLista([]);
  };

  const editarPagamento = (id) => {
    navigate(`/admin/payments/edit/${id}`);
  };

  const excluirPagamento = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este pagamento?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/pagamentos/${id}/`, headers);

      setPagamentos((prev) => prev.filter((p) => p.id !== id));
      setLista((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.log(error);
      alert("Não foi possível excluir o pagamento.");
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
        "http://127.0.0.1:8000/api/importar_pagamentos/",
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
            <h2 className="dashboard__title">Pagamentos</h2>
            <p className="dashboard__subtitle">
              Acesso negado: token não encontrado
            </p>
          </div>
        </div>
      </div>
    );
  }

  const total = pagamentos.length;
  const pagos = pagamentos.filter((p) => p.status === true).length;
  const pendentes = pagamentos.filter((p) => p.status === false).length;

  const pillByStatus = (s) => {
    if (s === true) return "pill pill--ok";
    if (s === false) return "pill pill--warn";
    return "pill";
  };

  const textoStatus = (s) => {
    if (s === true) return "PAGO";
    if (s === false) return "PENDENTE";
    return "-";
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Pagamentos</h2>
          <p className="dashboard__subtitle">
            Gerenciamento e consulta de pagamentos cadastrados
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
            <button className="actionBtn" onClick={() => navigate("/admin/contracts")}>
              Contratos
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
            <p className="card__label">Total de pagamentos</p>
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
            <p className="card__label">Pagos</p>
            <p className="card__value">{pagos}</p>
            <p className="card__hint">Quitados</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--danger" />
          <div className="card__content">
            <p className="card__label">Pendentes</p>
            <p className="card__value">{pendentes}</p>
            <p className="card__hint">Aguardando pagamento</p>
          </div>
        </div>
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Pesquisar pagamentos</h3>

      <div className="tableWrap" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="inputSearch"
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
          />

          <select
            className="inputSearch"
            value={statusPagamento}
            onChange={(e) => setStatusPagamento(e.target.value)}
            style={{ width: 220 }}
          >
            <option value="">Status (todos)</option>
            <option value="true">PAGO</option>
            <option value="false">PENDENTE</option>
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

        {erro && (
          <p style={{ marginTop: 12, color: "rgba(255,255,255,0.75)" }}>
            {erro}
          </p>
        )}
      </div>

      <hr className="hr" />

      <h3 className="sectionTitle">Lista de Pagamentos</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data pagamento</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Contrato</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  {loading ? "Carregando..." : "Nenhum pagamento encontrado."}
                </td>
              </tr>
            ) : (
              pagamentos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.data_pagamento}</td>
                  <td>{p.valor}</td>
                  <td>
                    <span className={pillByStatus(p.status)}>
                      {textoStatus(p.status)}
                    </span>
                  </td>
                  <td>{p.contrato_id || p.contrato || "-"}</td>
                  <td>
                    <div className="acoesTabela">
                      <button
                        className="iconBtn editBtn"
                        onClick={() => editarPagamento(p.id)}
                        title="Editar pagamento"
                      >
                        ✏️
                      </button>

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => excluirPagamento(p.id)}
                        title="Excluir pagamento"
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
              <th>Data pagamento</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Contrato</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  {(dataPagamento || statusPagamento !== "")
                    ? "Nenhum resultado encontrado."
                    : "Use os filtros acima para pesquisar."}
                </td>
              </tr>
            ) : (
              lista.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.data_pagamento}</td>
                  <td>{p.valor}</td>
                  <td>
                    <span className={pillByStatus(p.status)}>
                      {textoStatus(p.status)}
                    </span>
                  </td>
                  <td>{p.contrato_id || p.contrato || "-"}</td>
                  <td>
                    <div className="acoesTabela">
                      <button
                        className="iconBtn editBtn"
                        onClick={() => editarPagamento(p.id)}
                        title="Editar pagamento"
                      >
                        ✏️
                      </button>

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => excluirPagamento(p.id)}
                        title="Excluir pagamento"
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