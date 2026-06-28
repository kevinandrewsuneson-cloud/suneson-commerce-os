// Smooth scroll for in-page navigation links
const navAnchors = document.querySelectorAll('a[href^="#"]');

navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        const target = href ? document.querySelector(href) : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Operator notification helper for quick status feedback
function showMessage(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;

    const color = type === 'error'
        ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)'
        : 'linear-gradient(135deg, #00d4aa, #00a688)';

    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 0.9rem 1.2rem;
        border-radius: 0.7rem;
        background: ${color};
        color: white;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
        animation: slideIn 0.25s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.25s ease-out forwards';
        setTimeout(() => toast.remove(), 250);
    }, 2600);
}

// Reveal cards and sections as they enter the viewport
const animatedElements = document.querySelectorAll(
    '.module-card, .card, .timeline-item, .priority-item, .detail-table, .dashboard-card, .idea-result-card'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -35px 0px'
});

animatedElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(14px)';
    element.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
    observer.observe(element);
});

// Shift nav style when scrolling to strengthen dashboard framing
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');

    if (!navbar) {
        return;
    }

    if (window.scrollY > 40) {
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.32)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });

// Frontend-only idea generator with mock concepts
function toTitleCase(value) {
    return value
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function buildMockIdeas(inputs) {
    const niche = inputs.niche || 'Lifestyle Humor';
    const trend = inputs.trend || 'Retro Graphic Revival';
    const tone = inputs.tone || 'Bold';
    const productType = inputs.productType || 'Premium Tee';
    const targetCustomer = inputs.targetCustomer || '18-35 online shoppers';

    return [
        {
            shirtTitle: `${toTitleCase(niche)} Signal ${toTitleCase(productType)}`,
            shortConceptDescription: `A ${tone.toLowerCase()} front graphic concept inspired by ${trend.toLowerCase()} with clean, wearable typography.`,
            suggestedAudience: targetCustomer,
            marketingAngle: `Position as an identity piece for ${niche.toLowerCase()} fans who want high-repeat casual wear.`,
            estimatedMarginScore: '8.6 / 10'
        },
        {
            shirtTitle: `${toTitleCase(trend)} Club ${toTitleCase(productType)}`,
            shortConceptDescription: `Back-print heavy concept with a small chest lockup and a ${tone.toLowerCase()} voice for social-first merchandising.`,
            suggestedAudience: `${targetCustomer}, especially first-time buyers in the niche`,
            marketingAngle: `Sell through limited weekly drops and UGC hooks around ${trend.toLowerCase()} visuals.`,
            estimatedMarginScore: '7.9 / 10'
        },
        {
            shirtTitle: `${toTitleCase(niche)} Weekend Edition ${toTitleCase(productType)}`,
            shortConceptDescription: `Minimal but witty concept designed for everyday use with a ${tone.toLowerCase()} copy style tied to ${trend.toLowerCase()}.`,
            suggestedAudience: `${targetCustomer} looking for giftable and evergreen designs`,
            marketingAngle: 'Bundle with complementary products to lift AOV while preserving ad efficiency.',
            estimatedMarginScore: '8.3 / 10'
        }
    ];
}

function renderIdeas(ideas) {
    const generatedIdeas = document.getElementById('generatedIdeas');

    if (!generatedIdeas) {
        return;
    }

    generatedIdeas.innerHTML = ideas.map((idea) => `
        <article class="idea-result-card">
            <h3>${idea.shirtTitle}</h3>
            <p>${idea.shortConceptDescription}</p>
            <p class="idea-detail"><strong>Suggested Audience:</strong> ${idea.suggestedAudience}</p>
            <p class="idea-detail"><strong>Marketing Angle:</strong> ${idea.marketingAngle}</p>
            <p class="idea-detail"><strong>Estimated Margin Score:</strong> ${idea.estimatedMarginScore}</p>
        </article>
    `).join('');
}

const generateIdeasBtn = document.getElementById('generateIdeasBtn');

if (generateIdeasBtn) {
    generateIdeasBtn.addEventListener('click', () => {
        const inputs = {
            niche: document.getElementById('nicheInput')?.value.trim(),
            trend: document.getElementById('trendInput')?.value.trim(),
            tone: document.getElementById('toneInput')?.value.trim(),
            productType: document.getElementById('productTypeInput')?.value.trim(),
            targetCustomer: document.getElementById('targetCustomerInput')?.value.trim()
        };

        const ideas = buildMockIdeas(inputs);
        renderIdeas(ideas);
        showMessage('3 mock product ideas generated.', 'success');
    });
}

// Product launch checklist with localStorage persistence
const checklistStorageKey = 'sunesonCommerceOsLaunchChecklist';
const checklistInputs = document.querySelectorAll('#launchChecklistList input[type="checkbox"]');
const checklistProgress = document.getElementById('checklistProgress');

function loadChecklistState() {
    try {
        const raw = localStorage.getItem(checklistStorageKey);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveChecklistState(state) {
    localStorage.setItem(checklistStorageKey, JSON.stringify(state));
}

function updateChecklistVisuals() {
    const total = checklistInputs.length;
    let completed = 0;

    checklistInputs.forEach((input) => {
        const item = input.closest('.checklist-item');
        if (!item) {
            return;
        }

        if (input.checked) {
            item.classList.add('is-complete');
            completed += 1;
        } else {
            item.classList.remove('is-complete');
        }
    });

    if (checklistProgress) {
        checklistProgress.textContent = `${completed} of ${total} items complete`;
    }
}

function initializeChecklist() {
    if (!checklistInputs.length) {
        return;
    }

    const savedState = loadChecklistState();

    checklistInputs.forEach((input) => {
        const itemId = input.dataset.checklistId;
        if (itemId && savedState[itemId]) {
            input.checked = true;
        }

        input.addEventListener('change', () => {
            const currentState = loadChecklistState();
            if (itemId) {
                currentState[itemId] = input.checked;
                saveChecklistState(currentState);
            }

            updateChecklistVisuals();
        });
    });

    updateChecklistVisuals();
}

initializeChecklist();

console.log('Suneson Commerce OS internal dashboard initialized.');
