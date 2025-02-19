import matchesData from './data.js';
import { formatCurrency, calculatePotentialWin, validateBet, generateMatchCard } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // État de l'application
  let userState = {
    isLoggedIn: false,
    balance: 100,
    username: '',
    betsHistory: []
  };

  // Chargement initial des matches
  const matchesContainer = document.querySelector('.matches');
  matchesData.matches.forEach(match => {
    matchesContainer.innerHTML += generateMatchCard(match);
  });

  // Génération du menu des sports
  const sportsMenu = document.querySelector('.sports-menu ul');
  sportsMenu.innerHTML = matchesData.sports.map((sport, index) => `
    <li class="p-4 rounded-lg cursor-pointer flex items-center gap-3 ${index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-200 bg-white'} shadow-sm">
      <i class="${sport.icon}"></i> ${sport.name}
    </li>
  `).join('');

  // Fonction pour afficher les toasts
  function showToast(message, type = 'success') {
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: colors[type],
      },
    }).showToast();
  }

  // Éléments du DOM
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const userBalance = document.getElementById('user-balance');
  const oddBtns = document.querySelectorAll('.odd-btn');
  const betAmount = document.getElementById('bet-amount');
  const potentialWin = document.getElementById('potential-win');
  const selectedBets = document.getElementById('selected-bets');
  const placeBetBtn = document.getElementById('place-bet');
  const historyBtn = document.getElementById('history-btn');
  const historyModal = document.getElementById('history-modal');
  const historyList = document.getElementById('history-list');
  const sportsMenuItems = document.querySelectorAll('.sports-menu li');

  // Gestion de la connexion
  loginBtn.addEventListener('click', () => {
    if (userState.isLoggedIn) {
      logout();
    } else {
      loginModal.classList.remove('hidden');
      loginModal.classList.add('flex');
    }
  });

  function logout() {
    userState.isLoggedIn = false;
    userState.username = '';
    loginBtn.textContent = 'Connexion';
    updateBalanceDisplay();
    currentBets.clear();
    updateBetSlip();
    showToast('Déconnexion réussie', 'info');
  }

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.add('hidden');
      loginModal.classList.remove('flex');
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    userState.isLoggedIn = true;
    userState.username = username;
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
    loginBtn.textContent = 'Déconnexion';
    updateBalanceDisplay();
    loginForm.reset();
    showToast(`Bienvenue ${username}!`, 'success');
  });

  // Gestion des sports
  sportsMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      sportsMenuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      filterMatches(item.textContent.trim());
    });
  });

  function filterMatches(sport) {
    const matches = document.querySelectorAll('.match-card');
    matches.forEach(match => {
      if (match.dataset.sport === sport || sport === 'Tout') {
        match.style.display = 'block';
      } else {
        match.style.display = 'none';
      }
    });
  }

  // Gestion des paris
  let currentBets = new Map();

  oddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!userState.isLoggedIn) {
        showToast('Veuillez vous connecter pour placer des paris', 'error');
        loginModal.classList.remove('hidden');
        loginModal.classList.add('flex');
        return;
      }

      const matchCard = btn.closest('.match-card');
      const teams = matchCard.querySelector('.teams').textContent;
      const odd = parseFloat(btn.dataset.odd);
      
      matchCard.querySelectorAll('.odd-btn').forEach(b => b.classList.remove('selected'));
      
      if (currentBets.has(teams)) {
        currentBets.delete(teams);
        btn.classList.remove('selected');
      } else {
        currentBets.set(teams, {
          odd,
          type: btn.dataset.type,
          match: teams
        });
        btn.classList.add('selected');
      }
      
      updateBetSlip();
    });
  });

  function updateBalanceDisplay() {
    userBalance.textContent = userState.isLoggedIn 
      ? `Solde: ${userState.balance.toFixed(2)}€` 
      : '';
  }

  function updateBetSlip() {
    selectedBets.innerHTML = '';
    currentBets.forEach((betInfo, teams) => {
      const betElement = document.createElement('div');
      betElement.classList.add('selected-bet', 'bg-gray-50', 'rounded-lg', 'p-4', 'relative');
      betElement.innerHTML = `
        <div class="bet-info space-y-2">
          <p class="font-semibold text-gray-800">${teams}</p>
          <p class="text-sm text-gray-600 flex items-center gap-2">
            <span class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">${betInfo.type}</span>
            <span>Cote: ${betInfo.odd}</span>
          </p>
        </div>
        <button class="remove-bet absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200" data-teams="${teams}">×</button>
      `;
      selectedBets.appendChild(betElement);
    });

    document.querySelectorAll('.remove-bet').forEach(btn => {
      btn.addEventListener('click', () => {
        const teams = btn.dataset.teams;
        currentBets.delete(teams);
        document.querySelectorAll('.odd-btn').forEach(oddBtn => {
          if (oddBtn.closest('.match-card').querySelector('.teams').textContent === teams) {
            oddBtn.classList.remove('selected');
          }
        });
        updateBetSlip();
      });
    });

    updatePotentialWin();
  }

  betAmount.addEventListener('input', updatePotentialWin);

  function updatePotentialWin() {
    const amount = parseFloat(betAmount.value) || 0;
    let totalOdd = 1;
    currentBets.forEach(betInfo => {
      totalOdd *= betInfo.odd;
    });
    const potential = (amount * totalOdd).toFixed(2);
    potentialWin.textContent = `${potential}€`;
  }

  placeBetBtn.addEventListener('click', () => {
    if (!userState.isLoggedIn) {
      showToast('Veuillez vous connecter pour placer des paris', 'error');
      loginModal.classList.remove('hidden');
      loginModal.classList.add('flex');
      return;
    }

    if (currentBets.size === 0) {
      showToast('Veuillez sélectionner au moins un pari', 'warning');
      return;
    }
    
    const amount = parseFloat(betAmount.value);
    if (!amount || amount <= 0) {
      showToast('Veuillez entrer un montant valide', 'error');
      return;
    }

    if (amount > userState.balance) {
      showToast('Solde insuffisant', 'error');
      return;
    }

    // Placer le pari
    userState.balance -= amount;
    const betData = {
      date: new Date().toLocaleString(),
      bets: Array.from(currentBets.values()),
      amount: amount,
      potentialWin: parseFloat(potentialWin.textContent)
    };
    userState.betsHistory.push(betData);
    
    updateBalanceDisplay();
    showToast('Pari placé avec succès!', 'success');
    currentBets.clear();
    betAmount.value = 10;
    updateBetSlip();
    updateHistoryDisplay();
  });

  // Gestion de l'historique
  historyBtn?.addEventListener('click', () => {
    historyModal.classList.remove('hidden');
    historyModal.classList.add('flex');
    updateHistoryDisplay();
  });

  function updateHistoryDisplay() {
    if (!historyList) return;
    
    historyList.innerHTML = userState.betsHistory.map(bet => `
      <div class="history-item bg-white rounded-lg p-4 shadow-sm">
        <div class="history-header flex justify-between items-center mb-3">
          <span class="text-sm text-gray-500">${bet.date}</span>
          <span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            Mise: ${bet.amount}€
          </span>
        </div>
        <div class="history-bets space-y-2">
          ${bet.bets.map(b => `
            <div class="history-bet bg-gray-50 rounded-lg p-3">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-800">${b.match}</span>
                <span class="text-sm text-gray-600">${b.type} (${b.odd})</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="history-footer mt-3 text-right">
          <span class="text-green-500 font-semibold">
            Gain potentiel: ${bet.potentialWin}€
          </span>
        </div>
      </div>
    `).join('');
  }

  historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
      historyModal.classList.add('hidden');
      historyModal.classList.remove('flex');
    }
  });

  // Initialisation
  updateBalanceDisplay();
});