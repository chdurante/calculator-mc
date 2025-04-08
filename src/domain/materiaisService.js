export const DataStore = {
    receitas: {},
    receitasComCripto: {},
    reciclaveis: {},
    precos: {},
    itens: {},
    categorias: {}
  };
  
  export async function carregarDados() {
    const arquivos = [
      ["receitas", "receitas.json"],
      ["receitasComCripto", "receitasComCripto.json"],
      ["reciclaveis", "reciclaveis.json"],
      ["precos", "precos.json"],
      ["itens", "itens.json"],
      ["categorias", "categorias.json"]
    ];
  
    await Promise.all(
      arquivos.map(async ([chave, arquivo]) => {
        DataStore[chave] = await fetch(`data/${arquivo}`).then(res => res.json());
      })
    );
  }
  