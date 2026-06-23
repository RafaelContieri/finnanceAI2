// ============ PAGE NAVIGATION ============
class PageManager {
  constructor() {
    this.currentPage = 'home';
    this.user = null;
    this.cart = {
      planName: '',
      planPrice: 0,
      billingCycle: 'monthly'
    };
  }

  navigateTo(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show selected page
    const page = document.getElementById(`page-${pageName}`);
    if (page) {
      page.classList.add('active');
      this.currentPage = pageName;

      // Update header based on page
      this.updateHeader();

      // Update page-specific content
      if (pageName === 'confirmation') {
        setupConfirmationPage();
      } else if (pageName === 'settings') {
        updateSettingsPage();
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  updateHeader() {
    const header = document.querySelector('header');
    if (this.currentPage === 'login' || this.currentPage === 'signup') {
      header.style.display = 'none';
    } else {
      header.style.display = 'block';
    }

    // Update user profile visibility
    const userProfile = document.getElementById('user-profile');
    const headerLoginBtn = document.getElementById('header-login-btn');
    
    if (this.user && this.currentPage !== 'login' && this.currentPage !== 'signup') {
      userProfile.style.display = 'flex';
      headerLoginBtn.style.display = 'none';
      document.getElementById('user-name').textContent = this.user.name.split(' ')[0];
      document.getElementById('user-initial').textContent = this.user.name.charAt(0).toUpperCase();
    } else {
      userProfile.style.display = 'none';
      headerLoginBtn.style.display = 'flex';
    }
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return this.user || JSON.parse(localStorage.getItem('user') || 'null');
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    this.navigateTo('login');
  }
}

// ============ INITIALIZATION ============
const pageManager = new PageManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Check if user is logged in
  const storedUser = pageManager.getUser();
  if (storedUser) {
    pageManager.user = storedUser;
  }
  
  // Always start on home (landing page)
  pageManager.navigateTo('home');

  // Setup event listeners
  setupLoginEvents();
  setupSignupEvents();
  setupCheckoutEvents();
  setupChatEvents();
  setupNavigation();
});

// ============ NAVIGATION EVENTS ============
function setupNavigation() {
  // Logo click
  document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    pageManager.navigateTo('home');
  });

  // Header login button
  document.getElementById('header-login-btn').addEventListener('click', (e) => {
    e.preventDefault();
    pageManager.navigateTo('login');
  });

  // User profile click (only for logged in users)
  document.getElementById('user-profile').addEventListener('click', (e) => {
    if (e.target !== document.getElementById('logout-btn')) {
      pageManager.navigateTo('settings');
      updateSettingsPage();
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    pageManager.logout();
    pageManager.navigateTo('home');
  });

  // Header links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#pricing') {
        e.preventDefault();
        pageManager.navigateTo('home');
        setTimeout(() => {
          document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  });
}

// ============ LOGIN PAGE ============
function setupLoginEvents() {
  const loginForm = document.getElementById('login-form');
  const signupLink = document.getElementById('signup-link');
  const demoLoginBtn = document.getElementById('demo-login');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      showAlert('Por favor, preencha todos os campos!', 'error');
      return;
    }

    // Simulate login
    const user = {
      name: 'Rafael Silva',
      email: email,
      id: 'user_' + Math.random().toString(36).substr(2, 9)
    };

    pageManager.setUser(user);
    pageManager.navigateTo('home');
    showAlert(`Bem-vindo, ${user.name}!`, 'success');
  });

  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    pageManager.navigateTo('signup');
  });

  demoLoginBtn.addEventListener('click', () => {
    document.getElementById('login-email').value = 'demo@example.com';
    document.getElementById('login-password').value = 'password123';
  });
}

// ============ SIGNUP PAGE ============
function setupSignupEvents() {
  const signupForm = document.getElementById('signup-form');
  const loginLink = document.getElementById('login-link-signup');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const terms = document.getElementById('signup-terms').checked;

    // Validations
    if (!name || !email || !password || !confirmPassword) {
      showAlert('Por favor, preencha todos os campos!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('As senhas não conferem!', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('A senha deve ter no mínimo 6 caracteres!', 'error');
      return;
    }

    if (!terms) {
      showAlert('Você deve aceitar os termos de serviço!', 'error');
      return;
    }

    // Simulate signup
    const user = {
      name: name,
      email: email,
      id: 'user_' + Math.random().toString(36).substr(2, 9)
    };

    pageManager.setUser(user);
    pageManager.navigateTo('home');
    showAlert(`Conta criada com sucesso, ${name}!`, 'success');
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    pageManager.navigateTo('login');
  });
}

// ============ CHAT EVENTS ============
function setupChatEvents() {
  const btnDemo = document.getElementById('btn-demo');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const waStatus = document.getElementById('wa-status');

  const sugestoes = [
    'Uber de ontem R$ 18',
    'Recebi salário R$ 4500',
    'Mercado deu 120 reais',
    'Quanto eu gastei até agora?',
    'Me dá um resumo do mês'
  ];
  let indexSugestao = 0;

  function mostrarDigitando() {
    waStatus.innerText = 'digitando...';
    waStatus.style.color = '#ebd12b';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message msg-bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML =
      '<span style="animation: blink 1s infinite 0.2s;">•</span><span style="animation: blink 1s infinite 0.4s;">•</span><span style="animation: blink 1s infinite 0.6s;">•</span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removerDigitando() {
    waStatus.innerText = 'online';
    waStatus.style.color = 'var(--primary)';
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  function processarMensagem(texto) {
    const t = texto.toLowerCase();

    if (t.includes('salário') || t.includes('recebi') || t.includes('ganhei')) {
      return '💰 Dinheiro na conta! Renda registrada com sucesso. Deseja aplicar a regra dos 50/30/20 para essa entrada?';
    }
    if (
      t.includes('mercado') ||
      t.includes('almoço') ||
      t.includes('padaria') ||
      t.includes('comer') ||
      t.includes('reais')
    ) {
      const valor = t.match(/\d+/);
      const valorTexto = valor ? `de R$ ${valor[0]}` : '';
      return `✅ Gasto ${valorTexto} catalogado em 🛒 Alimentação.\nSeu limite mensal para essa categoria está em 42%.`;
    }
    if (t.includes('uber') || t.includes('combustivel') || t.includes('posto') || t.includes('carro')) {
      return '🚗 Viagem anotada! Categoria: Transporte. Lembre-se que você definiu uma meta de gastos menor para transporte essa semana.';
    }
    if (t.includes('quanto') || t.includes('gastei') || t.includes('resumo') || t.includes('total')) {
      return 'Resumo de Junho 2026:\n• Entradas: R$ 4.500\n• Saídas: R$ 1.182\n• Economia atual: R$ 3.318\n\nSua saúde financeira está classificada como Excelente! 🚀';
    }

    return '💡 Entendi! Adicionei ao seu painel geral. Se quiser puxar um relatório completo, é só digitar "Resumo".';
  }

  function enviarMensagem(mensagem) {
    if (!mensagem.trim()) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'message msg-user';
    userDiv.innerText = mensagem.trim();
    chatBody.appendChild(userDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    mostrarDigitando();

    setTimeout(() => {
      removerDigitando();
      const resposta = processarMensagem(mensagem);

      const botDiv = document.createElement('div');
      botDiv.className = 'message msg-bot';
      botDiv.innerText = resposta;
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1200);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatInput.value;
    enviarMensagem(msg);
    chatInput.value = '';
  });

  if (btnDemo) {
    btnDemo.addEventListener('click', (e) => {
      e.preventDefault();
      const sugestaoAtual = sugestoes[indexSugestao];
      enviarMensagem(sugestaoAtual);
      indexSugestao = (indexSugestao + 1) % sugestoes.length;
    });
  }
}

// ============ CHECKOUT PAGE ============
function setupCheckoutEvents() {
  // Plan selection buttons in pricing
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.dataset.plan;
      const planPrice = btn.dataset.price;

      pageManager.cart.planName = planName;
      pageManager.cart.planPrice = planPrice;

      pageManager.navigateTo('checkout');
    });
  });

  // Checkout form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('full-name').value;
      const email = document.getElementById('email-checkout').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;
      const city = document.getElementById('city').value;
      const state = document.getElementById('state').value;
      const zipcode = document.getElementById('zipcode').value;
      const cardName = document.getElementById('card-name').value;
      const cardNumber = document.getElementById('card-number').value;
      const cardExpiry = document.getElementById('card-expiry').value;
      const cardCvv = document.getElementById('card-cvv').value;
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked');

      // Validations
      if (
        !fullName ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !zipcode ||
        !cardName ||
        !cardNumber ||
        !cardExpiry ||
        !cardCvv
      ) {
        showAlert('Por favor, preencha todos os campos!', 'error');
        return;
      }

      if (!paymentMethod) {
        showAlert('Por favor, selecione um método de pagamento!', 'error');
        return;
      }

      // Simulate payment processing
      showAlert('Processando pagamento...', 'info');

      setTimeout(() => {
        // Simulate successful payment
        const subscription = {
          id: 'sub_' + Math.random().toString(36).substr(2, 9),
          planName: pageManager.cart.planName,
          planPrice: pageManager.cart.planPrice,
          billingCycle: pageManager.cart.billingCycle,
          status: 'active',
          startDate: new Date().toLocaleDateString('pt-BR'),
          nextBillingDate: getNextBillingDate(),
          paymentMethod: paymentMethod.value
        };

        localStorage.setItem('subscription', JSON.stringify(subscription));
        pageManager.navigateTo('confirmation');
      }, 2000);
    });
  }

  // Billing cycle change
  document.querySelectorAll('input[name="billing-cycle"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const cycle = radio.value;
      pageManager.cart.billingCycle = cycle;

      // Update price based on billing cycle
      if (cycle === 'yearly') {
        pageManager.cart.planPrice *= 10; // Simulating yearly discount
      } else {
        pageManager.cart.planPrice /= 10;
      }

      updateCheckoutSummary();
    });
  });

  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => (m.style.borderColor = 'transparent'));
      method.style.borderColor = 'var(--primary)';
      method.querySelector('input[type="radio"]').checked = true;
    });
  });
}

function updateCheckoutSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;

  const planPriceEl = summary.querySelector('[data-plan-price]');
  if (planPriceEl) {
    planPriceEl.textContent = `R$ ${pageManager.cart.planPrice.toFixed(2)}`;
  }

  const totalEl = summary.querySelector('[data-total]');
  if (totalEl) {
    totalEl.textContent = `R$ ${pageManager.cart.planPrice.toFixed(2)}`;
  }
}

function getNextBillingDate() {
  const date = new Date();
  if (pageManager.cart.billingCycle === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toLocaleDateString('pt-BR');
}

// ============ CONFIRMATION PAGE ============
function setupConfirmationPage() {
  const subscription = JSON.parse(localStorage.getItem('subscription') || '{}');

  if (Object.keys(subscription).length > 0) {
    document.getElementById('confirmation-plan').textContent = subscription.planName;
    document.getElementById('confirmation-price').textContent = `R$ ${subscription.planPrice.toFixed(2)}`;
    document.getElementById('confirmation-date').textContent = subscription.startDate;
    document.getElementById('confirmation-next-billing').textContent = subscription.nextBillingDate;
  }
}

// ============ UTILITY FUNCTIONS ============
function showAlert(message, type = 'info') {
  // Remove existing alerts
  document.querySelectorAll('.alert').forEach(a => a.remove());

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <i data-lucide="${getAlertIcon(type)}" style="width: 20px; height: 20px; flex-shrink: 0;"></i>
    <span>${message}</span>
  `;

  // Insert after header or at the top
  const header = document.querySelector('header');
  if (header && header.style.display !== 'none') {
    header.parentNode.insertBefore(alert, header.nextSibling);
  } else {
    document.body.insertBefore(alert, document.body.firstChild);
  }

  lucide.createIcons();

  // Auto remove after 4 seconds
  setTimeout(() => alert.remove(), 4000);
}

function getAlertIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'info'
  };
  return icons[type] || 'info';
}

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// ============ CARD MASK FUNCTIONS ============
document.addEventListener('DOMContentLoaded', () => {
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^\d]/g, '');
      let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = formattedValue;
    });
  }

  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  const cardCvvInput = document.getElementById('card-cvv');
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
  }
});

// ============ SETTINGS PAGE ============
function updateSettingsPage() {
  const user = pageManager.user;
  if (!user) return;

  // Update profile info
  document.getElementById('settings-name').textContent = user.name || 'Rafael Silva';
  document.getElementById('settings-email').textContent = user.email || 'rafael@email.com';
  document.getElementById('profile-avatar-large').textContent = (user.name || 'R').charAt(0).toUpperCase();

  // Get subscription info from localStorage
  const subscription = JSON.parse(localStorage.getItem('subscription') || '{}');
  
  if (subscription.planName) {
    document.getElementById('current-plan-name').textContent = subscription.planName;
    document.getElementById('current-plan-price').textContent = formatCurrency(subscription.planPrice);
    document.getElementById('current-billing-cycle').textContent = subscription.billingCycle === 'monthly' ? 'Mensal' : 'Anual';
  }

  // Update dates
  const today = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('pt-BR', options);
  
  document.getElementById('settings-member-since').textContent = formattedDate;
  document.getElementById('subscription-start-date').textContent = formattedDate;
  
  const nextBilling = new Date(today);
  nextBilling.setMonth(nextBilling.getMonth() + 1);
  const formattedNextDate = nextBilling.toLocaleDateString('pt-BR', options);
  document.getElementById('subscription-next-billing').textContent = formattedNextDate;
}
