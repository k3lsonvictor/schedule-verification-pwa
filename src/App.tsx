import React, { useEffect, useRef } from 'react';
import { useState } from 'react'
import './App.css'
import axios from 'axios';

interface ShadowDomWrapperProps {
  htmlContent: string;
}

const ShadowDomWrapper: React.FC<ShadowDomWrapperProps> = ({ htmlContent }) => {
  const shadowRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shadowRootRef.current) {
      // Verificar se o Shadow Root já existe
      let shadowRoot = shadowRootRef.current.shadowRoot;
      if (!shadowRoot) {
        // Criar o Shadow DOM apenas se ele ainda não existir
        shadowRoot = shadowRootRef.current.attachShadow({ mode: "open" });
      }
      // Limpar o conteúdo existente no Shadow DOM
      shadowRoot.innerHTML = "";

      // Adicionar o conteúdo HTML ao Shadow DOM
      const container = document.createElement("div");
      container.innerHTML = htmlContent;

      // Adicionar estilos isolados
      const style = document.createElement("style");
      style.textContent = `
        * {
          all: revert; /* Restaura o comportamento padrão dos elementos */
        }
        body {
          font-family: Arial, sans-serif;
          color: black;
        }
        div {
          color: black;
        }
        img {
          max-width: 100%; /* Garante que imagens não ultrapassem o contêiner */
        }
        a {
          color: blue;
          text-decoration: underline;
        }
        .img-fluid{
          width: 100px;
        }
        .card-title {
          width: max-content;
          font-size: 1.5rem;
        }
      `;

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(container);
    }
  }, [htmlContent]);

  return <div ref={shadowRootRef} className='scale-90'></div>;
};


function App() {
  const [email, setEmail] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [currentScreen, setCurrentScreen] = useState<"register" | "search">("register");
  const [htmlResult, setHtmlResult] = useState<string>("");
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");

  useEffect(() => {
    // Carregar códigos salvos ao entrar na tela "Verificar agendamentos"
    if (currentScreen === "search") {
      const storedCodes = JSON.parse(localStorage.getItem("savedCodes") || "[]");
      setSavedCodes(storedCodes);
    }
  }, [currentScreen]);

  const addCode = () => {
    if (codeInput.trim() && !codes.includes(codeInput.trim())) {
      setCodes([...codes, codeInput.trim()]);
      setCodeInput("");
    }
  };

  const removeCode = (codeToRemove: string) => {
    setCodes(codes.filter((code) => code !== codeToRemove));
  };

  const searchSchedule = async (code: string) => {
    try {
      const response = await axios.get(`https://agendamentos.sus.fms.pmt.pi.gov.br/detail_scheduling/index?utf8=%E2%9C%93&number_id=${code}`);
      if (!response || !response.data) {
        console.error("Erro ao buscar agendamento: ");
        return;
      }
      setHtmlResult(fixImagePaths(response.data));
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
    }
  }

  function fixImagePaths(html: string): string {
    const baseUrl = "https://agendamentos.sus.fms.pmt.pi.gov.br";
    html = html.replace(/src="\/(assets\/[^"]+)"/g, `src="${baseUrl}/$1"`);
    html = html.replace(/href="\/(assets\/[^"]+)"/g, `href="${baseUrl}/$1"`);
    return html;
  }

  return (
    <div className="">
      <div className='flex gap-4 mb-4'>
        <button
          onClick={() => setCurrentScreen("register")}
          className={`px-4 py-2 rounded-md ${currentScreen === "register" ? "bg-blue-800 text-white" : "bg-gray-300 text-black"
            }`}
        >
          Cadastrar email
        </button>
        <button
          onClick={() => setCurrentScreen("search")}
          className={`px-4 py-2 rounded-md ${currentScreen === "search" ? "bg-blue-800 text-white" : "bg-gray-300 text-black"
            }`}
        >
          Verificar agendamentos
        </button>
      </div>
      {currentScreen === "register" ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full border border-gray-300">
          {/* Tela de cadastro */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mt-2 text-black">Notificação de Agendamentos SUS</div>
          </div>
          <div className="bg-gray-200 text-sm text-center text-gray-700 rounded-md p-2 mb-4">
            Cadastre os seus códigos de agendamentos e um email de contato para receber as notificações quando as suas consultas e exames forem agendadas
          </div>
          {/* Formulário */}
          <div className="space-y-4">
            {/* Email */}
            <div className='flex flex-col items-start'>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Códigos */}
            <div className='flex flex-col items-start'>
              <label htmlFor="codes" className="block text-sm font-medium text-gray-700">
                códigos de agendamento <a className="text-blue-600 text-xs ml-2 hover:underline" href="#">onde encontrar?</a>
              </label>
              <div className="flex mt-1 gap-2 w-full">
                <input
                  type="text"
                  id="codes"
                  value={codeInput}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    setCodeInput(numericValue);
                  }}
                  className="w-full text-black flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={addCode}
                  className="bg-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-400 transition text-black cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
              {/* Lista de códigos */}
              <div className="flex flex-wrap gap-2 mt-2">
                {codes.map((code, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 px-3 py-1 rounded-lg flex items-center text-sm text-gray-700"
                  >
                    {code}
                    <button
                      onClick={() => removeCode(code)}
                      className="ml-2 text-gray-600 hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Botão Agendar */}
            <button className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition cursor-pointer">
              Cadastrar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6  w-full border border-gray-300">
          {/* Tela de busca */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mt-2 text-black">Buscar Agendamentos</div>
          </div>
          <div className="bg-gray-200 text-sm text-center text-gray-700 rounded-md p-2 mb-4">
            Insira o código de agendamento para verificar os detalhes
          </div>
          <div className="space-y-4">
            <div className='flex flex-col items-start'>
              <label htmlFor="searchCode" className="block text-sm font-medium text-gray-700">
                Código de agendamento
              </label>
              <input
                type="text"
                id="searchCode"
                placeholder="Digite o código"
                className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setCodeInput(numericValue);
                }}
                value={codeInput}
              />
            </div>
            <button
              className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition cursor-pointer"
              onClick={() => {
                searchSchedule(codeInput);
              }}
            >
              Buscar
            </button>
            <button
              className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition cursor-pointer mt-2"
              onClick={() => {
                if (codeInput.trim()) {
                  const savedCodes = JSON.parse(localStorage.getItem("savedCodes") || "[]");
                  if (!savedCodes.includes(codeInput.trim())) {
                    savedCodes.push(codeInput.trim());
                    localStorage.setItem("savedCodes", JSON.stringify(savedCodes));
                    alert("Código salvo com sucesso!");
                  } else {
                    alert("Este código já está salvo.");
                  }
                } else {
                  alert("Por favor, insira um código válido.");
                }
              }}
            >
              Salvar Código
            </button>

            {/* Renderizar códigos salvos */}
            {savedCodes.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Códigos Salvos:</div>
                <div className="flex flex-wrap gap-2">
                  {savedCodes.map((savedCode, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCode(savedCode);
                        searchSchedule(savedCode)
                      }}
                      className="bg-gray-300 px-3 py-1 rounded-lg text-sm text-gray-700 hover:bg-gray-400 transition cursor-pointer"
                    >
                      {savedCode}
                    </button>

                  ))}
                </div>
              </div>
            )}

            {htmlResult && (
              <div className="mt-4">
                <div className='text-black font-semibold'>Agendamento {selectedCode}</div>
                <ShadowDomWrapper htmlContent={htmlResult} />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App
