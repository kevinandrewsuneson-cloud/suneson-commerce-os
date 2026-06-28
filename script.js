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
    '.module-card, .card, .timeline-item, .priority-item, .detail-table, .dashboard-card, .idea-result-card, .product-card, .publishing-queue-card'
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

function observeAnimatedElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(14px)';
    element.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
    observer.observe(element);
}

animatedElements.forEach((element) => {
    observeAnimatedElement(element);
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
            collection: toTitleCase(niche),
            shortConceptDescription: `A ${tone.toLowerCase()} front graphic concept inspired by ${trend.toLowerCase()} with clean, wearable typography.`,
            suggestedAudience: targetCustomer,
            marketingAngle: `Position as an identity piece for ${niche.toLowerCase()} fans who want high-repeat casual wear.`,
            estimatedMarginScore: '8.6 / 10'
        },
        {
            shirtTitle: `${toTitleCase(trend)} Club ${toTitleCase(productType)}`,
            collection: toTitleCase(niche),
            shortConceptDescription: `Back-print heavy concept with a small chest lockup and a ${tone.toLowerCase()} voice for social-first merchandising.`,
            suggestedAudience: `${targetCustomer}, especially first-time buyers in the niche`,
            marketingAngle: `Sell through limited weekly drops and UGC hooks around ${trend.toLowerCase()} visuals.`,
            estimatedMarginScore: '7.9 / 10'
        },
        {
            shirtTitle: `${toTitleCase(niche)} Weekend Edition ${toTitleCase(productType)}`,
            collection: toTitleCase(niche),
            shortConceptDescription: `Minimal but witty concept designed for everyday use with a ${tone.toLowerCase()} copy style tied to ${trend.toLowerCase()}.`,
            suggestedAudience: `${targetCustomer} looking for giftable and evergreen designs`,
            marketingAngle: 'Bundle with complementary products to lift AOV while preserving ad efficiency.',
            estimatedMarginScore: '8.3 / 10'
        }
    ];
}

// Local in-memory cache of generated ideas so action buttons can map to stable records.
let generatedIdeasCache = [];

function renderIdeas(ideas) {
    const generatedIdeas = document.getElementById('generatedIdeas');

    if (!generatedIdeas) {
        return;
    }

    generatedIdeasCache = ideas;

    generatedIdeas.innerHTML = ideas.map((idea, index) => `
        <article class="idea-result-card">
            <h3>${idea.shirtTitle}</h3>
            <p>${idea.shortConceptDescription}</p>
            <p class="idea-detail"><strong>Suggested Audience:</strong> ${idea.suggestedAudience}</p>
            <p class="idea-detail"><strong>Marketing Angle:</strong> ${idea.marketingAngle}</p>
            <p class="idea-detail"><strong>Estimated Margin Score:</strong> ${idea.estimatedMarginScore}</p>
            <div class="idea-actions">
                <button class="btn btn-secondary move-to-library-btn" type="button" data-idea-index="${index}">Move to Design Queue</button>
            </div>
        </article>
    `).join('');

    generatedIdeas.querySelectorAll('.idea-result-card').forEach((card) => observeAnimatedElement(card));
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

// Product Library localStorage key and UI references.
const productLibraryStorageKey = 'sunesonCommerceOsProductLibrary';
const productGrid = document.getElementById('productGrid');
const productEntryForm = document.getElementById('productEntryForm');
const addProductBtn = document.getElementById('addProductBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const productTitleInput = document.getElementById('productTitleInput');
const productCollectionInput = document.getElementById('productCollectionInput');
const productTypeSelect = document.getElementById('productTypeSelect');
const productStatusSelect = document.getElementById('productStatusSelect');
const productPrioritySelect = document.getElementById('productPrioritySelect');
const estimatedPriceInput = document.getElementById('estimatedPriceInput');
const estimatedCostInput = document.getElementById('estimatedCostInput');
const estimatedMarginInput = document.getElementById('estimatedMarginInput');
const designStatusSelect = document.getElementById('designStatusSelect');
const launchChannelSelect = document.getElementById('launchChannelSelect');
const productNotesInput = document.getElementById('productNotesInput');

const collectionFilter = document.getElementById('collectionFilter');
const statusFilter = document.getElementById('statusFilter');
const titleSearchInput = document.getElementById('titleSearchInput');
const sortProductsSelect = document.getElementById('sortProductsSelect');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

// Publishing Queue localStorage key and UI references.
const publishingQueueStorageKey = 'sunesonCommerceOsPublishingQueue';
const publishingQueueGrid = document.getElementById('publishingQueueGrid');
const publishingQueueSummary = document.getElementById('publishingQueueSummary');
const clearPublishingQueueBtn = document.getElementById('clearPublishingQueueBtn');
const exportPublishingQueueCsvBtn = document.getElementById('exportPublishingQueueCsvBtn');

// Controlled status options for every queue checklist field.
const publishingChecklistOptions = {
    seoStatus: ['Not Started', 'Drafted', 'Approved'],
    mockupStatus: ['Not Started', 'Created', 'Approved'],
    descriptionStatus: ['Not Started', 'Drafted', 'Approved'],
    socialPostStatus: ['Not Started', 'Drafted', 'Scheduled'],
    publishStatus: ['Not Ready', 'Ready', 'Published']
};

// Track edit mode state so one form can handle create and update workflows.
let editingProductId = null;

// Load persisted products while handling malformed localStorage values safely.
function loadProductLibrary() {
    try {
        const raw = localStorage.getItem(productLibraryStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Persist the entire product list in localStorage as the single source of truth.
function saveProductLibrary(products) {
    localStorage.setItem(productLibraryStorageKey, JSON.stringify(products));
}

// Load Publishing Queue records while safely handling malformed localStorage data.
function loadPublishingQueue() {
    try {
        const raw = localStorage.getItem(publishingQueueStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Persist queue records to localStorage.
function savePublishingQueue(queueItems) {
    localStorage.setItem(publishingQueueStorageKey, JSON.stringify(queueItems));
}

// Generate a sequential product ID based on the highest existing product number.
function buildProductId(existingProducts) {
    const highestIndex = existingProducts.reduce((max, product) => {
        const suffix = Number.parseInt(String(product.id).replace('PROD-', ''), 10);
        if (Number.isNaN(suffix)) {
            return max;
        }

        return Math.max(max, suffix);
    }, 0);

    return `PROD-${String(highestIndex + 1).padStart(4, '0')}`;
}

// Escape dynamic values before rendering into HTML.
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// Parse a currency input and normalize invalid entries to null.
function parseMoneyInput(value) {
    if (value === '' || value === null || value === undefined) {
        return null;
    }

    const numericValue = Number.parseFloat(value);
    return Number.isFinite(numericValue) ? numericValue : null;
}

// Calculate margin percentage from price and cost if both are provided.
function calculateMarginPercent(price, cost) {
    if (price === null || cost === null || price <= 0) {
        return null;
    }

    return ((price - cost) / price) * 100;
}

// Convert numeric price or cost values to dashboard display text.
function formatCurrency(amount) {
    if (amount === null || amount === undefined) {
        return 'N/A';
    }

    return `$${amount.toFixed(2)}`;
}

// Convert numeric margin values to display text.
function formatMargin(marginValue) {
    if (marginValue === null || marginValue === undefined || Number.isNaN(marginValue)) {
        return 'N/A';
    }

    return `${marginValue.toFixed(1)}%`;
}

// Determine if a queue item is fully launch-ready based on required checklist statuses.
function isQueueItemReadyToPublish(queueItem) {
    const checklistApproved = queueItem.seoStatus === 'Approved'
        && queueItem.mockupStatus === 'Approved'
        && queueItem.descriptionStatus === 'Approved'
        && queueItem.socialPostStatus === 'Scheduled';

    return checklistApproved && (queueItem.publishStatus === 'Ready' || queueItem.publishStatus === 'Published');
}

// Build an initial Publishing Queue payload by copying fields from Product Library.
function createPublishingQueueItem(product) {
    return {
        queueId: `QUEUE-${product.id}`,
        productId: product.id,
        title: product.title,
        collection: product.collection,
        productType: product.productType,
        estimatedPrice: product.estimatedPrice,
        estimatedCost: product.estimatedCost,
        estimatedMargin: product.estimatedMargin,
        launchChannel: product.launchChannel || 'Shopify',
        seoStatus: 'Not Started',
        mockupStatus: 'Not Started',
        descriptionStatus: 'Not Started',
        socialPostStatus: 'Not Started',
        publishStatus: 'Not Ready',
        createdAt: new Date().toISOString()
    };
}

// Add a Product Library record into Publishing Queue if it is not already queued.
function addToPublishingQueue(product) {
    const queueItems = loadPublishingQueue();
    const existingIndex = queueItems.findIndex((item) => item.productId === product.id);

    if (existingIndex >= 0) {
        // Keep checklist progress but refresh copied product metadata.
        const existingItem = queueItems[existingIndex];
        queueItems[existingIndex] = {
            ...existingItem,
            title: product.title,
            collection: product.collection,
            productType: product.productType,
            estimatedPrice: product.estimatedPrice,
            estimatedCost: product.estimatedCost,
            estimatedMargin: product.estimatedMargin,
            launchChannel: product.launchChannel || existingItem.launchChannel
        };
        savePublishingQueue(queueItems);
        refreshPublishingQueue();
        showMessage(`${product.id} already in Publishing Queue. Details refreshed.`, 'success');
        return;
    }

    const queueItem = createPublishingQueueItem(product);
    savePublishingQueue([queueItem, ...queueItems]);
    refreshPublishingQueue();
    showMessage(`${product.id} moved to Publishing Queue.`, 'success');
}

// Update a single queue item's checklist status value.
function updatePublishingQueueStatus(queueId, fieldName, value) {
    const queueItems = loadPublishingQueue();
    const updatedItems = queueItems.map((item) => {
        if (item.queueId !== queueId) {
            return item;
        }

        return {
            ...item,
            [fieldName]: value
        };
    });

    savePublishingQueue(updatedItems);
    refreshPublishingQueue();
}

// Mark queue item as Published and sync the linked Product Library record status.
function markQueueItemPublished(queueId) {
    const queueItems = loadPublishingQueue();
    const targetItem = queueItems.find((item) => item.queueId === queueId);

    if (!targetItem) {
        showMessage('Queue item not found.', 'error');
        return;
    }

    const updatedQueue = queueItems.map((item) => {
        if (item.queueId !== queueId) {
            return item;
        }

        return {
            ...item,
            publishStatus: 'Published'
        };
    });

    const products = loadProductLibrary();
    const updatedProducts = products.map((product) => {
        if (product.id !== targetItem.productId) {
            return product;
        }

        return {
            ...product,
            status: 'Published'
        };
    });

    savePublishingQueue(updatedQueue);
    saveProductLibrary(updatedProducts);
    refreshPublishingQueue();
    refreshProductLibrary();
    showMessage(`${targetItem.productId} marked as Published.`, 'success');
}

// Convert queue records to CSV for download.
function publishingQueueToCsv(queueItems) {
    const headers = [
        'Product ID',
        'Product Title',
        'Collection',
        'Product Type',
        'Estimated Price',
        'Estimated Cost',
        'Estimated Margin %',
        'Launch Channel',
        'SEO Status',
        'Mockup Status',
        'Description Status',
        'Social Post Status',
        'Publish Status',
        'Ready to Publish'
    ];

    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    const rows = queueItems.map((item) => [
        item.productId,
        item.title,
        item.collection,
        item.productType,
        item.estimatedPrice ?? '',
        item.estimatedCost ?? '',
        item.estimatedMargin ?? '',
        item.launchChannel,
        item.seoStatus,
        item.mockupStatus,
        item.descriptionStatus,
        item.socialPostStatus,
        item.publishStatus,
        isQueueItemReadyToPublish(item) ? 'Yes' : 'No'
    ]);

    return [headers, ...rows]
        .map((row) => row.map(escapeCsv).join(','))
        .join('\n');
}

// Render a select control for a queue checklist field.
function renderQueueStatusSelect(queueId, fieldName, value) {
    const options = publishingChecklistOptions[fieldName] || [];
    const fieldLabels = {
        seoStatus: 'SEO Status',
        mockupStatus: 'Mockup Status',
        descriptionStatus: 'Description Status',
        socialPostStatus: 'Social Post Status',
        publishStatus: 'Publish Status'
    };
    const label = fieldLabels[fieldName] || fieldName;

    return `
        <label class="queue-select-wrap" for="${escapeHtml(`${queueId}-${fieldName}`)}">
            <span>${escapeHtml(label)}</span>
            <select
                id="${escapeHtml(`${queueId}-${fieldName}`)}"
                class="queue-status-select"
                data-queue-id="${escapeHtml(queueId)}"
                data-status-field="${escapeHtml(fieldName)}"
            >
                ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}
            </select>
        </label>
    `;
}

// Render the Publishing Queue section from localStorage data.
function refreshPublishingQueue() {
    if (!publishingQueueGrid) {
        return;
    }

    const queueItems = loadPublishingQueue();
    const sortedQueueItems = [...queueItems].sort((a, b) => {
        const aReady = isQueueItemReadyToPublish(a) ? 1 : 0;
        const bReady = isQueueItemReadyToPublish(b) ? 1 : 0;
        if (aReady !== bReady) {
            return bReady - aReady;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const readyCount = queueItems.filter((item) => isQueueItemReadyToPublish(item)).length;

    if (publishingQueueSummary) {
        publishingQueueSummary.textContent = `${queueItems.length} items in queue • ${readyCount} ready to publish`;
    }

    if (!sortedQueueItems.length) {
        publishingQueueGrid.innerHTML = '<article class="product-empty-state">No products in Publishing Queue yet. Use "Move to Publishing Queue" from Product Library cards to start launch prep.</article>';
        return;
    }

    publishingQueueGrid.innerHTML = sortedQueueItems.map((item) => {
        const readyBadge = isQueueItemReadyToPublish(item)
            ? '<span class="pill status-good">Ready to Publish</span>'
            : '<span class="pill status-warning">Launch Prep In Progress</span>';

        return `
            <article class="publishing-queue-card" data-queue-id="${escapeHtml(item.queueId)}">
                <div class="product-card-top">
                    <div>
                        <p class="product-id">${escapeHtml(item.productId)}</p>
                        <h3 class="product-title">${escapeHtml(item.title)}</h3>
                    </div>
                    ${readyBadge}
                </div>

                <div class="product-meta">
                    <p class="product-meta-item"><span class="product-meta-label">Collection</span><span class="product-meta-value">${escapeHtml(item.collection || 'N/A')}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Product Type</span><span class="product-meta-value">${escapeHtml(item.productType || 'N/A')}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Estimated Price</span><span class="product-meta-value">${escapeHtml(formatCurrency(item.estimatedPrice))}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Estimated Cost</span><span class="product-meta-value">${escapeHtml(formatCurrency(item.estimatedCost))}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Estimated Margin</span><span class="product-meta-value">${escapeHtml(formatMargin(item.estimatedMargin))}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Launch Channel</span><span class="product-meta-value">${escapeHtml(item.launchChannel || 'N/A')}</span></p>
                </div>

                <div class="publishing-checklist-grid">
                    ${renderQueueStatusSelect(item.queueId, 'seoStatus', item.seoStatus)}
                    ${renderQueueStatusSelect(item.queueId, 'mockupStatus', item.mockupStatus)}
                    ${renderQueueStatusSelect(item.queueId, 'descriptionStatus', item.descriptionStatus)}
                    ${renderQueueStatusSelect(item.queueId, 'socialPostStatus', item.socialPostStatus)}
                    ${renderQueueStatusSelect(item.queueId, 'publishStatus', item.publishStatus)}
                </div>

                <div class="publishing-queue-card-actions">
                    <button class="btn btn-primary mark-queue-published-btn" type="button" data-queue-id="${escapeHtml(item.queueId)}">Mark as Published</button>
                    <button class="btn btn-secondary delete-queue-item-btn" type="button" data-queue-id="${escapeHtml(item.queueId)}">Delete from Queue</button>
                </div>
            </article>
        `;
    }).join('');

    publishingQueueGrid.querySelectorAll('.publishing-queue-card').forEach((card) => observeAnimatedElement(card));
}

// Convert a mock idea score (e.g., 8.6 / 10) to an approximate margin percentage.
function convertMarginScoreToPercent(scoreText) {
    const numericScore = Number.parseFloat(scoreText);
    if (Number.isNaN(numericScore)) {
        return null;
    }

    return Math.round(numericScore * 4);
}

// Map idea score to operational priority for imported idea records.
function derivePriority(scoreText) {
    const numericScore = Number.parseFloat(scoreText);
    if (numericScore >= 8.5) {
        return 'High';
    }

    if (numericScore >= 8) {
        return 'Medium';
    }

    return 'Low';
}

// Build a complete product payload from current form values.
function buildProductFromForm(existingProducts) {
    const estimatedPrice = parseMoneyInput(estimatedPriceInput?.value.trim());
    const estimatedCost = parseMoneyInput(estimatedCostInput?.value.trim());
    const marginFromPriceCost = calculateMarginPercent(estimatedPrice, estimatedCost);
    const manualMarginInput = parseMoneyInput(estimatedMarginInput?.value.trim());
    const estimatedMargin = marginFromPriceCost ?? manualMarginInput;
    const timestamp = new Date();

    return {
        id: buildProductId(existingProducts),
        title: productTitleInput?.value.trim() || '',
        collection: productCollectionInput?.value || '',
        productType: productTypeSelect?.value || '',
        status: productStatusSelect?.value || 'Idea',
        priority: productPrioritySelect?.value || 'Medium',
        estimatedPrice,
        estimatedCost,
        estimatedMargin,
        designStatus: designStatusSelect?.value || 'Not Started',
        launchChannel: launchChannelSelect?.value || 'Manual',
        notes: productNotesInput?.value.trim() || '',
        createdAt: timestamp.toISOString(),
        dateCreated: timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
}

// Reset form state after create or edit operations.
function resetProductForm() {
    if (!productEntryForm) {
        return;
    }

    productEntryForm.reset();
    editingProductId = null;

    if (addProductBtn) {
        addProductBtn.textContent = 'Add Product';
    }

    if (cancelEditBtn) {
        cancelEditBtn.hidden = true;
    }

    if (productStatusSelect) {
        productStatusSelect.value = 'Idea';
    }

    if (productPrioritySelect) {
        productPrioritySelect.value = 'Medium';
    }

    if (designStatusSelect) {
        designStatusSelect.value = 'Not Started';
    }

    if (launchChannelSelect) {
        launchChannelSelect.value = 'Shopify';
    }
}

// Populate the form from an existing product and enter edit mode.
function populateProductForm(product) {
    if (!productEntryForm || !product) {
        return;
    }

    productTitleInput.value = product.title || '';
    productCollectionInput.value = product.collection || '';
    productTypeSelect.value = product.productType || '';
    productStatusSelect.value = product.status || 'Idea';
    productPrioritySelect.value = product.priority || 'Medium';
    estimatedPriceInput.value = product.estimatedPrice ?? '';
    estimatedCostInput.value = product.estimatedCost ?? '';
    estimatedMarginInput.value = product.estimatedMargin ?? '';
    designStatusSelect.value = product.designStatus || 'Not Started';
    launchChannelSelect.value = product.launchChannel || 'Manual';
    productNotesInput.value = product.notes || '';

    editingProductId = product.id;

    if (addProductBtn) {
        addProductBtn.textContent = 'Save Product Changes';
    }

    if (cancelEditBtn) {
        cancelEditBtn.hidden = false;
    }
}

// Apply search + filters to the current product list.
function filterProducts(products) {
    const selectedCollection = collectionFilter?.value || 'all';
    const selectedStatus = statusFilter?.value || 'all';
    const titleSearch = titleSearchInput?.value.trim().toLowerCase() || '';

    return products.filter((product) => {
        const collectionMatch = selectedCollection === 'all' || product.collection === selectedCollection;
        const statusMatch = selectedStatus === 'all' || product.status === selectedStatus;
        const titleMatch = !titleSearch || product.title.toLowerCase().includes(titleSearch);

        return collectionMatch && statusMatch && titleMatch;
    });
}

// Sort filtered products according to the selected dashboard control.
function sortProducts(products) {
    const selectedSort = sortProductsSelect?.value || 'newest';
    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    return [...products].sort((a, b) => {
        if (selectedSort === 'margin') {
            return (b.estimatedMargin ?? -Infinity) - (a.estimatedMargin ?? -Infinity);
        }

        if (selectedSort === 'priority') {
            const rankDifference = (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
            if (rankDifference !== 0) {
                return rankDifference;
            }
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

// Map status values to visual pill variants.
function statusClassForProduct(status) {
    if (status === 'Published') {
        return 'status-good';
    }

    if (status === 'Retired') {
        return 'status-warning';
    }

    return 'status-info';
}

// Map priority values to readable color accents.
function priorityClass(priority) {
    if (priority === 'High') {
        return 'product-priority-high';
    }

    if (priority === 'Low') {
        return 'product-priority-low';
    }

    return 'product-priority-medium';
}

// Render the Product Library card grid with all required fields and actions.
function renderProductGrid(products) {
    if (!productGrid) {
        return;
    }

    if (!products.length) {
        productGrid.innerHTML = '<article class="product-empty-state">No products found for the current controls. Add products manually or move ideas into the design queue to populate this library.</article>';
        return;
    }

    productGrid.innerHTML = products.map((product) => `
        <article class="product-card" data-product-id="${escapeHtml(product.id)}">
            <div class="product-card-top">
                <div>
                    <p class="product-id">${escapeHtml(product.id)}</p>
                    <h3 class="product-title">${escapeHtml(product.title)}</h3>
                </div>
                <span class="pill ${statusClassForProduct(product.status)}">${escapeHtml(product.status)}</span>
            </div>
            <div class="product-meta">
                <p class="product-meta-item"><span class="product-meta-label">Collection</span><span class="product-meta-value">${escapeHtml(product.collection)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Product Type</span><span class="product-meta-value">${escapeHtml(product.productType || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Priority</span><span class="product-meta-value ${priorityClass(product.priority)}">${escapeHtml(product.priority)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Estimated Price</span><span class="product-meta-value">${escapeHtml(formatCurrency(product.estimatedPrice))}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Estimated Cost</span><span class="product-meta-value">${escapeHtml(formatCurrency(product.estimatedCost))}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Estimated Margin</span><span class="product-meta-value">${escapeHtml(formatMargin(product.estimatedMargin))}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Design Status</span><span class="product-meta-value">${escapeHtml(product.designStatus || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Launch Channel</span><span class="product-meta-value">${escapeHtml(product.launchChannel || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Notes</span><span class="product-meta-value">${escapeHtml(product.notes || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Date Created</span><span class="product-meta-value">${escapeHtml(product.dateCreated)}</span></p>
            </div>
            <div class="product-card-actions">
                <button class="btn btn-secondary edit-product-btn" type="button" data-product-id="${escapeHtml(product.id)}">Edit</button>
                <button class="btn btn-secondary delete-product-btn" type="button" data-product-id="${escapeHtml(product.id)}">Delete</button>
                <button class="btn btn-secondary move-to-publishing-queue-btn" type="button" data-product-id="${escapeHtml(product.id)}">Move to Publishing Queue</button>
                <button class="btn btn-primary publish-product-btn" type="button" data-product-id="${escapeHtml(product.id)}">Mark as Published</button>
            </div>
        </article>
    `).join('');

    productGrid.querySelectorAll('.product-card').forEach((card) => observeAnimatedElement(card));
}

// Shared render path used by create/update/delete/filter/sort operations.
function refreshProductLibrary() {
    const allProducts = loadProductLibrary();
    const visibleProducts = sortProducts(filterProducts(allProducts));
    renderProductGrid(visibleProducts);
}

// Create a product payload from an idea card with required default statuses.
function createProductFromIdea(idea) {
    const existingProducts = loadProductLibrary();
    const timestamp = new Date();
    const importedMargin = convertMarginScoreToPercent(idea.estimatedMarginScore);

    const product = {
        id: buildProductId(existingProducts),
        title: idea.shirtTitle,
        collection: idea.collection || 'Seasonal',
        productType: 'T-Shirt',
        status: 'Idea',
        priority: derivePriority(idea.estimatedMarginScore),
        estimatedPrice: null,
        estimatedCost: null,
        estimatedMargin: importedMargin,
        designStatus: 'Not Started',
        launchChannel: 'Manual',
        notes: idea.marketingAngle || '',
        createdAt: timestamp.toISOString(),
        dateCreated: timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    saveProductLibrary([product, ...existingProducts]);
    refreshProductLibrary();
    showMessage(`${product.id} moved into Product Library.`, 'success');
}

// Persist a new product or save edits from the manual entry form.
if (productEntryForm) {
    productEntryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const existingProducts = loadProductLibrary();
        const formProduct = buildProductFromForm(existingProducts);

        if (!formProduct.title || !formProduct.collection || !formProduct.productType) {
            showMessage('Please complete required product fields.', 'error');
            return;
        }

        if (editingProductId) {
            const updatedProducts = existingProducts.map((product) => {
                if (product.id !== editingProductId) {
                    return product;
                }

                return {
                    ...product,
                    title: formProduct.title,
                    collection: formProduct.collection,
                    productType: formProduct.productType,
                    status: formProduct.status,
                    priority: formProduct.priority,
                    estimatedPrice: formProduct.estimatedPrice,
                    estimatedCost: formProduct.estimatedCost,
                    estimatedMargin: formProduct.estimatedMargin,
                    designStatus: formProduct.designStatus,
                    launchChannel: formProduct.launchChannel,
                    notes: formProduct.notes
                };
            });

            saveProductLibrary(updatedProducts);
            showMessage('Product updated.', 'success');
        } else {
            saveProductLibrary([formProduct, ...existingProducts]);
            showMessage(`${formProduct.id} added to Product Library.`, 'success');
        }

        resetProductForm();
        refreshProductLibrary();
    });
}

// Exit edit mode and return the manual form to create mode.
if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
        resetProductForm();
        showMessage('Edit canceled.', 'success');
    });
}

// Bind Product Library filter and sort controls.
if (collectionFilter) {
    collectionFilter.addEventListener('change', refreshProductLibrary);
}

if (statusFilter) {
    statusFilter.addEventListener('change', refreshProductLibrary);
}

if (titleSearchInput) {
    titleSearchInput.addEventListener('input', refreshProductLibrary);
}

if (sortProductsSelect) {
    sortProductsSelect.addEventListener('change', refreshProductLibrary);
}

// Convert products array to CSV content with quote-safe escaping.
function productsToCsv(products) {
    const headers = [
        'Product ID',
        'Product Title',
        'Collection',
        'Product Type',
        'Status',
        'Priority',
        'Estimated Price',
        'Estimated Cost',
        'Estimated Margin %',
        'Design Status',
        'Launch Channel',
        'Notes',
        'Date Created'
    ];

    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    const rows = products.map((product) => [
        product.id,
        product.title,
        product.collection,
        product.productType,
        product.status,
        product.priority,
        product.estimatedPrice ?? '',
        product.estimatedCost ?? '',
        product.estimatedMargin ?? '',
        product.designStatus,
        product.launchChannel,
        product.notes,
        product.dateCreated
    ]);

    return [headers, ...rows]
        .map((row) => row.map(escapeCsv).join(','))
        .join('\n');
}

// Download a text payload as a file from the browser.
function downloadTextFile(fileName, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

// Export Product Library as JSON.
if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
        const products = loadProductLibrary();
        downloadTextFile('suneson-product-library.json', JSON.stringify(products, null, 2), 'application/json');
        showMessage('Product Library exported as JSON.', 'success');
    });
}

// Export Product Library as CSV.
if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
        const products = loadProductLibrary();
        downloadTextFile('suneson-product-library.csv', productsToCsv(products), 'text/csv;charset=utf-8');
        showMessage('Product Library exported as CSV.', 'success');
    });
}

// Delegate product card action buttons (edit, delete, publish).
if (productGrid) {
    productGrid.addEventListener('click', (event) => {
        const actionButton = event.target.closest('button[data-product-id]');
        if (!actionButton) {
            return;
        }

        const productId = actionButton.dataset.productId;
        const products = loadProductLibrary();
        const targetProduct = products.find((product) => product.id === productId);

        if (!targetProduct) {
            showMessage('Product not found.', 'error');
            return;
        }

        if (actionButton.classList.contains('edit-product-btn')) {
            populateProductForm(targetProduct);
            document.querySelector('#product-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showMessage(`Editing ${targetProduct.id}.`, 'success');
            return;
        }

        if (actionButton.classList.contains('delete-product-btn')) {
            const remainingProducts = products.filter((product) => product.id !== productId);
            saveProductLibrary(remainingProducts);

            if (editingProductId === productId) {
                resetProductForm();
            }

            refreshProductLibrary();
            showMessage(`${productId} deleted.`, 'success');
            return;
        }

        if (actionButton.classList.contains('move-to-publishing-queue-btn')) {
            addToPublishingQueue(targetProduct);
            return;
        }

        if (actionButton.classList.contains('publish-product-btn')) {
            const updatedProducts = products.map((product) => {
                if (product.id !== productId) {
                    return product;
                }

                return {
                    ...product,
                    status: 'Published',
                    designStatus: product.designStatus === 'Approved' ? 'Approved' : product.designStatus
                };
            });

            saveProductLibrary(updatedProducts);
            refreshProductLibrary();
            showMessage(`${productId} marked as Published.`, 'success');
        }
    });
}

// Delegate idea action clicks so "Move to Design Queue" also creates Product Library records.
const generatedIdeasContainer = document.getElementById('generatedIdeas');

if (generatedIdeasContainer) {
    generatedIdeasContainer.addEventListener('click', (event) => {
        const targetButton = event.target.closest('.move-to-library-btn');
        if (!targetButton) {
            return;
        }

        const ideaIndex = Number.parseInt(targetButton.dataset.ideaIndex || '', 10);
        if (Number.isNaN(ideaIndex) || !generatedIdeasCache[ideaIndex]) {
            showMessage('Could not locate idea to move.', 'error');
            return;
        }

        createProductFromIdea(generatedIdeasCache[ideaIndex]);
    });
}

// Initialize Product Library from localStorage on every page load.
resetProductForm();
refreshProductLibrary();

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

// Delegate Publishing Queue checklist and action events.
if (publishingQueueGrid) {
    publishingQueueGrid.addEventListener('change', (event) => {
        const select = event.target.closest('.queue-status-select');
        if (!select) {
            return;
        }

        const queueId = select.dataset.queueId;
        const fieldName = select.dataset.statusField;
        const nextValue = select.value;

        if (!queueId || !fieldName) {
            return;
        }

        updatePublishingQueueStatus(queueId, fieldName, nextValue);
    });

    publishingQueueGrid.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-queue-item-btn');
        if (deleteButton) {
            const queueId = deleteButton.dataset.queueId;
            const remainingItems = loadPublishingQueue().filter((item) => item.queueId !== queueId);
            savePublishingQueue(remainingItems);
            refreshPublishingQueue();
            showMessage('Queue item removed.', 'success');
            return;
        }

        const publishButton = event.target.closest('.mark-queue-published-btn');
        if (publishButton) {
            const queueId = publishButton.dataset.queueId;
            if (!queueId) {
                return;
            }

            markQueueItemPublished(queueId);
        }
    });
}

// Clear all queue records.
if (clearPublishingQueueBtn) {
    clearPublishingQueueBtn.addEventListener('click', () => {
        savePublishingQueue([]);
        refreshPublishingQueue();
        showMessage('Publishing Queue cleared.', 'success');
    });
}

// Export queue records as CSV.
if (exportPublishingQueueCsvBtn) {
    exportPublishingQueueCsvBtn.addEventListener('click', () => {
        const queueItems = loadPublishingQueue();
        downloadTextFile('suneson-publishing-queue.csv', publishingQueueToCsv(queueItems), 'text/csv;charset=utf-8');
        showMessage('Publishing Queue exported as CSV.', 'success');
    });
}

// Initialize Publishing Queue from localStorage on page load.
refreshPublishingQueue();

console.log('Suneson Commerce OS internal dashboard initialized.');
