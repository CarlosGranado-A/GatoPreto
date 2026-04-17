import { useState, useEffect } from "react";
import logoGatoPreto from "./imagensFront/logoGatoPreto.png";

function Home() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [gatoSelecionado, setGatoSelecionado] = useState(null);

    const [form, setForm] = useState({
        nome: "",
        sexo: "",
        peso: "",
        fiv_felv: "Nao testado",
        foto: null
    });

    const [gatos, setGatos] = useState([]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function handleFile(e) {
        setForm({
            ...form,
            foto: e.target.files[0]
        });
    }

    function fecharModal() {
        setMostrarModal(false);
        setEditando(null);
        setForm({
            nome: "",
            sexo: "",
            peso: "",
            fiv_felv: "Nao testado",
            foto: null
        });
    }

    function abrirEdicao(gato) {
        setForm({
            nome: gato.nome,
            sexo: gato.sexo,
            peso: gato.peso,
            fiv_felv: gato.fiv_felv,
            foto: null
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
        const confirmar = window.confirm("Tem certeza que deseja deletar este gato?");
        if (!confirmar) return;

        try {
            await fetch(`http://localhost:8800/gatos/${id}`, {
                method: "DELETE"
            });

            alert("Gato deletado!");
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
                method: method,
                body: formData
            });

            alert(editando ? "Gato atualizado!" : "Gato cadastrado!");

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
            <div className="Header">
                <img src={logoGatoPreto} alt="Logo" width="150" />
            </div>

            <button onClick={() => setMostrarModal(true)}>
                <h1>Adicionar Gato</h1>
            </button>

            <h2 style={{ marginLeft: "20px" }}>Gatos cadastrados:</h2>

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
                            <button onClick={(e) => { e.stopPropagation(); abrirEdicao(gato); }}>
                                Editar
                            </button>

                            <button onClick={(e) => { e.stopPropagation(); deletarGato(gato.id); }}>
                                Deletar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL CADASTRO */}
            {mostrarModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{editando ? "Editar Gato" : "Novo Gato"}</h2>

                        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />

                        <select name="sexo" value={form.sexo} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                        </select>

                        <input name="peso" placeholder="Peso" value={form.peso} onChange={handleChange} />

                        <select name="fiv_felv" value={form.fiv_felv} onChange={handleChange}>
                            <option value="Nao testado">Não testado</option>
                            <option value="Positivo">Positivo</option>
                            <option value="Negativo">Negativo</option>
                        </select>

                        <input type="file" onChange={handleFile} />

                        <button onClick={salvarGato}>Salvar</button>
                        <button onClick={fecharModal}>Fechar</button>
                    </div>
                </div>
            )}

            {/* MODAL DETALHES */}
            {gatoSelecionado && (
                <div className="modal">
                    <div className="modal-content">

                        <button onClick={() => setGatoSelecionado(null)}>X</button>

                        <img 
                            src={`http://localhost:8800/uploads/${gatoSelecionado.foto}`} 
                            style={{ width: "250px", borderRadius: "10px" }}
                        />

                        <h2>{gatoSelecionado.nome}</h2>

                        <p><strong>Sexo:</strong> {gatoSelecionado.sexo}</p>
                        <p><strong>Peso:</strong> {gatoSelecionado.peso} Kg</p>
                        <p><strong>FIV/FELV:</strong> {gatoSelecionado.fiv_felv}</p>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;