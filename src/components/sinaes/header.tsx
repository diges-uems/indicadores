'use client';

export function Header() {
  return (
    <header className="relative w-full max-w-7xl mx-auto mt-6 px-4 sm:px-8 mb-6 animate-fade-in">
      <div className="relative w-full min-h-[350px] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10">
        <img
          src="https://www.uems.br/anexos/imagens/conteudo/uems_imagens_2023-09-22_13-02-19.png"
          alt="Fachada principal UEMS"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).style.background = '#00338C';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#002255]/95 via-[#00338c]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col md:flex-row items-start md:items-end justify-between p-10 md:p-14 z-10 pb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight max-w-2xl">
              Portal de Indicadores de Ensino{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-white">
                SINAES
              </span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mt-4 font-medium max-w-xl">
              Monitoramento Estratégico Institucional para Gestão de Qualidade.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
