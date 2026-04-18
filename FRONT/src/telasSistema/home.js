import { useState, useEffect } from "react";
import logoGatoPreto from "./imagensFront/logoGatoPreto.png";

function Home() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [gatoSelecionado, setGatoSelecionado] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(false);
const [acaoConfirm, setAcaoConfirm] = useState(null);
const [mensagemConfirm, setMensagemConfirm] = useState("");

  const [form, setForm] = useState({
    nome: "",
    sexo: "",
    peso: "",
    fiv_felv: "Nao testado",
    foto: null,
    fotoAtual: null
  });

  const [gatos, setGatos] = useState([]);
function abrirConfirmacao(mensagem, callback) {
  setMensagemConfirm(mensagem);
  setAcaoConfirm(() => callback);
  setModalConfirm(true);
}

function confirmarAcao() {
  if (acaoConfirm) acaoConfirm();
  setModalConfirm(false);
}

function fecharConfirm() {
  setModalConfirm(false);
}
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    setForm({ ...form, foto: e.target.files[0] });
  }

  function fecharModal() {
    setMostrarModal(false);
    setEditando(null);
    setForm({
      nome: "",
      sexo: "",
      peso: "",
      fiv_felv: "Nao testado",
      foto: null,
      fotoAtual: null
    });
  }

  function abrirEdicao(gato) {
    setForm({
      nome: gato.nome,
      sexo: gato.sexo,
      peso: gato.peso,
      fiv_felv: gato.fiv_felv,
      foto: null,
      fotoAtual: gato.foto
    });

    setEditando(gato.id);
    setMostrarModal(true);
  }

  function abrirDetalhes(gato) {
    setGatoSelecionado(gato);
  }

  async function buscarGatos() {
    try {
      const response = await fetch("http://localhost:8800/gatos");
      const data = await response.json();
      setGatos(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deletarGato(id) {
    if (!window.confirm("Tem certeza que deseja deletar este gato?")) return;

    try {
      await fetch(`http://localhost:8800/gatos/${id}`, {
        method: "DELETE"
      });
      buscarGatos();
    } catch (err) {
      console.error(err);
    }
  }

  async function salvarGato() {
    try {
      let url = "http://localhost:8800/gatos";
      let method = "POST";

      if (editando) {
        url = `http://localhost:8800/gatos/${editando}`;
        method = "PUT";
      }

      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("sexo", form.sexo);
      formData.append("peso", form.peso);
      formData.append("fiv_felv", form.fiv_felv);

      if (form.foto) {
        formData.append("foto", form.foto);
      }

      await fetch(url, {
        method,
        body: formData
      });

      buscarGatos();
      fecharModal();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    buscarGatos();
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="Header">
        <img src={logoGatoPreto} alt="Logo" className="logo" />
      </div>

      <div className="container">
        <button className="btn-adicionar" onClick={() => setMostrarModal(true)}>
          Adicionar gato
        </button>

        <h3 className="titulo">Gatos disponíveis para adoção</h3>
        <div className="divider"></div>

        <div className="lista">
          {gatos.map((gato) => (
            <div
              key={gato.id}
              className="card"
              onClick={() => abrirDetalhes(gato)}
            >
              {gato.foto && (
                <img
                  src={`http://localhost:8800/uploads/${gato.foto}`}
                  alt={gato.nome}
                />
              )}

              <div className="overlay">
                <h3>{gato.nome}</h3>
                <p>{gato.sexo}</p>
              </div>

              <div className="acoes">
                <button
                  className="btn-acao"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirEdicao(gato);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="btn-acao"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletarGato(gato.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CADASTRO / EDIÇÃO */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content detalhe">
            <button className="close" onClick={fecharModal}>✕</button>

            {/* IMAGEM */}
            <div className="foto-placeholder">
              {form.foto ? (
                <img
                  src={URL.createObjectURL(form.foto)}
                  className="foto-detalhe"
                />
              ) : form.fotoAtual ? (
                <img
                  src={`http://localhost:8800/uploads/${form.fotoAtual}`}
                  className="foto-detalhe"
                />
              ) : (
                <span>Sem imagem</span>
              )}
            </div>

            <h2 className="modal-title">
              {editando ? form.nome : "Novo gato"}
            </h2>

            <div className="info">
              <div className="info-item">
                <span>Nome</span>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="info-item">
                <span>Sexo</span>
                <select name="sexo" value={form.sexo} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div className="info-item">
                <span>FIV / FELV</span>
                <select
                  name="fiv_felv"
                  value={form.fiv_felv}
                  onChange={handleChange}
                >
                  <option value="Nao testado">Não testado</option>
                  <option value="Positivo">Positivo</option>
                  <option value="Negativo">Negativo</option>
                </select>
              </div>

              <div className="info-item">
                <span>Peso</span>
                <input
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                />
              </div>
            </div>

            <input type="file" onChange={handleFile} />

            <button className="btn-salvar" onClick={salvarGato}>
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETALHES */}
      {gatoSelecionado && (
        <div className="modal">
          <div className="modal-content detalhe">
            <button className="close" onClick={() => setGatoSelecionado(null)}>✕</button>

            <div className="foto-placeholder">
              {gatoSelecionado.foto && (
                <img
                  src={`http://localhost:8800/uploads/${gatoSelecionado.foto}`}
                  className="foto-detalhe"
                />
              )}
            </div>

            <h2 className="modal-title">{gatoSelecionado.nome}</h2>

            <div className="info">
              <div className="info-item">
                <span>Sexo</span>
                <strong>{gatoSelecionado.sexo}</strong>
              </div>

              <div className="info-item">
                <span>Peso</span>
                <strong>{gatoSelecionado.peso} Kg</strong>
              </div>

              <div className="info-item">
                <span>FIV / FELV</span>
                <strong>{gatoSelecionado.fiv_felv}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;