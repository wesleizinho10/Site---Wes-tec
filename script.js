
const numeroWhatsApp = "5543996469627";
  const taxaDescontoPix = 0.05;

  const produtos = [
    { id: 1, categoria: "Sistemas", nome: "Micro ERP Mellea (Mensalidade)", preco: 250.00,
      desc: "Sistema ágil e modular para substituir planilhas e organizar sua operação do dia a dia com controle total.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
    { id: 2, categoria: "Sistemas", nome: "Licença Anual ERP Mellea", preco: 2500.00,
      desc: "Desconto especial para contrato anual do sistema Mellea. Economia garantida com suporte completo incluso.",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop" },
    { id: 3, categoria: "Dados", nome: "Dashboard Financeiro BI", preco: 1800.00,
      desc: "DRE, fluxo de caixa e indicadores em tempo real com Power BI. Tome decisões mais rápidas e seguras.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
    { id: 4, categoria: "Dados", nome: "Infraestrutura de Dados", preco: 3500.00,
      desc: "Modelagem avançada, Data Warehouse e pipelines ETL robustos para sua empresa crescer com dados confiáveis.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop" },
    { id: 5, categoria: "Serviços", nome: "Robô de Automação (RPA)", preco: 2100.00,
      desc: "Automatize tarefas repetitivas com robôs inteligentes. Ganhe tempo, reduza erros e libere sua equipe.",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop" },
    { id: 6, categoria: "Serviços", nome: "Consultoria em Inteligência Artificial", preco: 500.00,
      desc: "Análise de viabilidade e estratégia de IA por hora técnica com especialistas certificados e experientes.",
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop" }
  ];

  let carrinho = [];

  /* ── Tema ── */
  function alternarTema() {
    const html = document.documentElement;
    const atual = html.getAttribute('data-tema');
    const novo = atual === 'escuro' ? 'claro' : 'escuro';
    html.setAttribute('data-tema', novo);
    document.getElementById('btn-tema').textContent = novo === 'escuro' ? '🌙' : '☀️';
    localStorage.setItem('wt-tema', novo);
  }
  (function() {
    const salvo = localStorage.getItem('wt-tema');
    if (salvo) {
      document.documentElement.setAttribute('data-tema', salvo);
      document.getElementById('btn-tema').textContent = salvo === 'escuro' ? '🌙' : '☀️';
    }
  })();

  /* ── Catálogo ── */
  function renderizarProdutos(cat = 'Todos') {
    const grid = document.getElementById('grid-produtos');
    grid.innerHTML = '';
    const lista = cat === 'Todos' ? produtos : produtos.filter(p => p.categoria === cat);
    lista.forEach(p => {
      grid.innerHTML += `
        <div class="card-produto">
          <div class="card-img-wrap">
            <img src="${p.img}" alt="${p.nome}" class="img-produto"
              onerror="this.src='https://placehold.co/600x210/111/dc2626?text=Wes+Tec'">
            <div class="card-img-overlay"></div>
            <span class="tag-categoria">${p.categoria}</span>
          </div>
          <div class="info-produto">
            <h3>${p.nome}</h3>
            <p>${p.desc}</p>
            <div class="card-footer">
              <div class="preco">
                <small>a partir de</small>
                R$ ${p.preco.toFixed(2).replace('.', ',')}
              </div>
              <button class="btn-add" onclick="adicionarAoCarrinho(${p.id})">+ Adicionar</button>
            </div>
          </div>
        </div>`;
    });
  }

  function filtrarProdutos(cat) {
    document.querySelectorAll('.btn-filtro').forEach(btn => {
      btn.classList.remove('ativo');
      const txt = btn.innerText;
      if (cat === 'Todos' && txt === 'Todos') btn.classList.add('ativo');
      else if (txt.includes(cat)) btn.classList.add('ativo');
    });
    renderizarProdutos(cat);
  }

  /* ── Carrinho ── */
  function adicionarAoCarrinho(id) {
    const prod = produtos.find(p => p.id === id);
    const existe = carrinho.find(i => i.id === id);
    if (existe) existe.qtd++;
    else carrinho.push({ ...prod, qtd: 1 });
    atualizarInterfaceCarrinho();
    mostrarToast();
  }

  function alterarQtd(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) removerDoCarrinho(id);
    else atualizarInterfaceCarrinho();
  }

  function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    atualizarInterfaceCarrinho();
  }

  function atualizarInterfaceCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    lista.innerHTML = '';
    let subtotal = 0, totalItens = 0;

    if (!carrinho.length) {
      lista.innerHTML = '<p style="color:var(--texto2);text-align:center;margin-top:48px;font-size:14px;">Nenhum item adicionado ainda.</p>';
    } else {
      carrinho.forEach(item => {
        subtotal += item.preco * item.qtd;
        totalItens += item.qtd;
        lista.innerHTML += `
          <div class="item-carrinho">
            <div class="item-info">
              <h4>${item.nome}</h4>
              <span class="item-preco">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="controles-qtd">
              <div class="qtd-botoes">
                <button class="btn-qtd" onclick="alterarQtd(${item.id}, -1)">−</button>
                <span class="qtd-valor">${item.qtd}</span>
                <button class="btn-qtd" onclick="alterarQtd(${item.id}, 1)">+</button>
              </div>
              <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">Remover</button>
            </div>
          </div>`;
      });
    }

    document.getElementById('badge-carrinho').innerText = totalItens;
    const pag = document.querySelector('input[name="pagamento"]:checked').value;
    const desconto = pag === 'Pix' ? subtotal * taxaDescontoPix : 0;
    document.getElementById('linha-desconto').style.display = pag === 'Pix' ? 'flex' : 'none';
    document.getElementById('txt-subtotal').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('txt-desconto').innerText = `− R$ ${desconto.toFixed(2).replace('.', ',')}`;
    document.getElementById('txt-total').innerText = `R$ ${(subtotal - desconto).toFixed(2).replace('.', ',')}`;
  }

  function enviarParaWhatsApp() {
    if (!carrinho.length) { alert('Adicione itens ao carrinho antes de enviar!'); return; }
    const nome = document.getElementById('cli-nome').value.trim();
    const cidade = document.getElementById('cli-cidade').value.trim();
    const pag = document.querySelector('input[name="pagamento"]:checked').value;
    if (!nome || !cidade) { alert('Preencha o nome e a cidade para continuar.'); return; }

    let subtotal = 0;
    let msg = `*NOVO PEDIDO | WES TEC* 🚀\n\n*Cliente:* ${nome}\n*Local:* ${cidade}\n\n*ITENS:*\n`;
    carrinho.forEach(i => {
      subtotal += i.preco * i.qtd;
      msg += `• ${i.qtd}x ${i.nome} → R$ ${(i.preco * i.qtd).toFixed(2).replace('.', ',')}\n`;
    });
    const desc = pag === 'Pix' ? subtotal * taxaDescontoPix : 0;
    msg += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    if (desc) msg += `*Desconto Pix (5%):* − R$ ${desc.toFixed(2).replace('.', ',')}\n`;
    msg += `*TOTAL:* R$ ${(subtotal - desc).toFixed(2).replace('.', ',')}\n`;
    msg += `*Pagamento:* ${pag}\n\nAguardo o retorno para darmos andamento!`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function abrirCarrinho() {
    document.getElementById('carrinho').classList.add('ativo');
    document.getElementById('overlay').classList.add('ativo');
  }
  function fecharCarrinho() {
    document.getElementById('carrinho').classList.remove('ativo');
    document.getElementById('overlay').classList.remove('ativo');
  }
  function mostrarToast() {
    const t = document.getElementById('toast');
    t.className = 'mostrar';
    setTimeout(() => { t.className = ''; }, 3000);
  }

  window.onload = () => {
    renderizarProdutos('Todos');
    atualizarInterfaceCarrinho();
  };