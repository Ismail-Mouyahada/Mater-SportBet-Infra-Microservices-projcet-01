export function formatCurrency(amount) {
  return `${amount.toFixed(2)}€`;
}

export function calculatePotentialWin(stake, odds) {
  return stake * odds;
}

export function validateBet(bet, userBalance) {
  if (!bet.stake || bet.stake <= 0) {
    return { valid: false, message: 'Veuillez entrer un montant valide' };
  }
  
  if (bet.stake > userBalance) {
    return { valid: false, message: 'Solde insuffisant' };
  }
  
  return { valid: true };
}

export function generateMatchCard(match) {
  return `
    <div class="match-card glass-effect rounded-xl p-6 shadow-sm" data-sport="${match.sport}" data-match-id="${match.id}">
      <div class="flex justify-between text-gray-600 text-sm font-medium">
        <span class="league flex items-center gap-2">
          <i class="fas fa-futbol text-green-500"></i>
          ${match.league}
        </span>
        <span class="time flex items-center gap-2">
          <i class="far fa-clock text-green-500"></i>
          ${match.time}
        </span>
      </div>
      <div class="teams flex justify-between items-center my-6 font-bold text-lg">
        <span>${match.homeTeam}</span>
        <span class="text-gray-400">vs</span>
        <span>${match.awayTeam}</span>
      </div>
      <div class="grid grid-cols-${Object.keys(match.odds).length} gap-4">
        ${Object.entries(match.odds).map(([type, odd]) => `
          <button class="odd-btn p-3 border-2 border-gray-200 rounded-lg hover:border-green-500 font-medium" 
                  data-odd="${odd}" 
                  data-type="${type}">
            ${odd}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}