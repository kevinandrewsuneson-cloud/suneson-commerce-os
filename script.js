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
    '.module-card, .card, .timeline-item, .priority-item, .detail-table, .dashboard-card, .idea-result-card, .product-card, .publishing-queue-card, .marketing-package-card, .marketing-preview-card, .design-approval-card, .saved-listing-card'
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

// Design Approval Queue UI references.
const designQueueStatusFilter = document.getElementById('designQueueStatusFilter');
const designQueueCollectionFilter = document.getElementById('designQueueCollectionFilter');
const designQueuePriorityFilter = document.getElementById('designQueuePriorityFilter');
const designApprovalGrid = document.getElementById('designApprovalGrid');

// Mockup & Listing Builder localStorage key and UI references.
const mockupListingsStorageKey = 'sunesonCommerceOsMockupListings';
const mockupListingProductSelect = document.getElementById('mockupListingProductSelect');
const mockupImageUrlInput = document.getElementById('mockupImageUrlInput');
const listingProductTitleInput = document.getElementById('listingProductTitleInput');
const listingProductDescriptionInput = document.getElementById('listingProductDescriptionInput');
const listingSeoTitleInput = document.getElementById('listingSeoTitleInput');
const listingSeoMetaDescriptionInput = document.getElementById('listingSeoMetaDescriptionInput');
const listingTagsInput = document.getElementById('listingTagsInput');
const listingPriceInput = document.getElementById('listingPriceInput');
const listingCostInput = document.getElementById('listingCostInput');
const listingPrintProviderInput = document.getElementById('listingPrintProviderInput');
const listingColorsInput = document.getElementById('listingColorsInput');
const listingSizesInput = document.getElementById('listingSizesInput');
const generateDraftListingBtn = document.getElementById('generateDraftListingBtn');
const saveListingBtn = document.getElementById('saveListingBtn');
const markMockupCreatedBtn = document.getElementById('markMockupCreatedBtn');
const markListingReadyToPublishBtn = document.getElementById('markListingReadyToPublishBtn');
const savedListingsSummary = document.getElementById('savedListingsSummary');
const savedListingsGrid = document.getElementById('savedListingsGrid');
const exportListingsCsvBtn = document.getElementById('exportListingsCsvBtn');

// Publishing Queue localStorage key and UI references.
const publishingQueueStorageKey = 'sunesonCommerceOsPublishingQueue';
const publishingQueueGrid = document.getElementById('publishingQueueGrid');
const publishingQueueSummary = document.getElementById('publishingQueueSummary');
const clearPublishingQueueBtn = document.getElementById('clearPublishingQueueBtn');
const exportPublishingQueueCsvBtn = document.getElementById('exportPublishingQueueCsvBtn');

// Marketing Content Generator localStorage key and UI references.
const marketingPackagesStorageKey = 'sunesonCommerceOsMarketingPackages';
const marketingQueueProductSelect = document.getElementById('marketingQueueProductSelect');
const marketingToneInput = document.getElementById('marketingToneInput');
const marketingPlatformInput = document.getElementById('marketingPlatformInput');
const marketingGoalInput = document.getElementById('marketingGoalInput');
const marketingAudienceInput = document.getElementById('marketingAudienceInput');
const marketingPromoAngleInput = document.getElementById('marketingPromoAngleInput');
const generateMarketingPackageBtn = document.getElementById('generateMarketingPackageBtn');
const saveMarketingPackageBtn = document.getElementById('saveMarketingPackageBtn');
const marketingPreview = document.getElementById('marketingPreview');
const marketingPackagesGrid = document.getElementById('marketingPackagesGrid');
const marketingPackagesSummary = document.getElementById('marketingPackagesSummary');
const exportMarketingPackagesCsvBtn = document.getElementById('exportMarketingPackagesCsvBtn');
const marketingPackageModal = document.getElementById('marketingPackageModal');
const marketingPackageModalContent = document.getElementById('marketingPackageModalContent');
const closeMarketingPackageModalBtn = document.getElementById('closeMarketingPackageModalBtn');
const marketingPackageModalPanel = marketingPackageModal?.querySelector('.marketing-modal-panel') || null;

// Controlled status options for every queue checklist field.
const publishingChecklistOptions = {
    seoStatus: ['Not Started', 'Drafted', 'Approved'],
    mockupStatus: ['Not Started', 'Created', 'Approved'],
    descriptionStatus: ['Not Started', 'Drafted', 'Approved'],
    socialPostStatus: ['Not Started', 'Drafted', 'Scheduled'],
    publishStatus: ['Not Ready', 'Ready', 'Published']
};

// Temporary in-memory package that is generated before a user saves it.
let pendingMarketingPackage = null;
let editingListingId = null;

// Product design statuses that belong in the Design Approval Queue workflow.
const designApprovalQueueStatuses = ['Not Started', 'Prompt Written', 'AI Generated', 'Needs Revision'];

// Track edit mode state so one form can handle create and update workflows.
let editingProductId = null;

// Load persisted products while handling malformed localStorage values safely.
function loadProductLibrary() {
    try {
        const raw = localStorage.getItem(productLibraryStorageKey);
        const parsedProducts = raw ? JSON.parse(raw) : [];
        const legacyQueue = JSON.parse(localStorage.getItem(publishingQueueStorageKey) || '[]');
        const savedListings = JSON.parse(localStorage.getItem(mockupListingsStorageKey) || '[]');
        const savedMarketingPackages = JSON.parse(localStorage.getItem(marketingPackagesStorageKey) || '[]');

        const legacyQueueByProductId = new Map(legacyQueue.map((item) => [item.productId, item]));
        const savedListingsByProductId = new Map(savedListings.map((item) => [item.productId, item]));
        const marketingProducts = new Set(savedMarketingPackages.map((item) => item.productId));

        return parsedProducts.map((product) => normalizeProductRecord(
            product,
            legacyQueueByProductId.get(product.id),
            savedListingsByProductId.get(product.id),
            marketingProducts.has(product.id)
        ));
    } catch {
        return [];
    }
}

// Persist the entire product list in localStorage as the single source of truth.
function saveProductLibrary(products) {
    localStorage.setItem(productLibraryStorageKey, JSON.stringify(products));
}

// Convert an ISO timestamp into a compact dashboard date label.
function formatStoredDate(dateValue) {
    if (!dateValue) {
        return '';
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return '';
    }

    return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Derive the current workflow stage from the shared master product record.
function getWorkflowStage(product) {
    if (product.status === 'Published' || product.publishStatus === 'Published') {
        return 'Published';
    }

    if (product.status === 'Ready to Publish') {
        return 'Ready to Publish';
    }

    if (product.status === 'Ready for Mockup') {
        return 'Mockup';
    }

    if (product.designStatus === 'Approved') {
        return 'Approved';
    }

    if (product.status === 'In Design' || (product.designStatus && product.designStatus !== 'Not Started')) {
        return 'Design';
    }

    return 'Idea';
}

// Map workflow stages to a visual progress percentage.
function getWorkflowProgressPercent(product) {
    const workflowPercentByStage = {
        Idea: 16,
        Design: 34,
        Approved: 52,
        Mockup: 68,
        'Ready to Publish': 84,
        Published: 100
    };

    return workflowPercentByStage[getWorkflowStage(product)] || 0;
}

// Render a compact workflow progress indicator that can be reused across product cards.
function renderWorkflowProgress(product) {
    const stage = getWorkflowStage(product);
    const percent = getWorkflowProgressPercent(product);

    return `
        <div class="workflow-progress-block" aria-label="Workflow stage ${escapeHtml(stage)} at ${percent}%">
            <div class="workflow-progress-head">
                <span class="workflow-progress-label">Workflow Progress</span>
                <span class="workflow-progress-stage">${escapeHtml(stage)}</span>
            </div>
            <div class="workflow-progress-track"><span class="workflow-progress-fill" style="width: ${percent}%"></span></div>
        </div>
    `;
}

// Render the key workflow timeline dates that matter across modules.
function renderWorkflowTimeline(product) {
    const timelineItems = [
        { label: 'Date Created', value: product.dateCreated || formatStoredDate(product.createdAt) || 'Not set' },
        { label: 'Date Approved', value: product.dateApproved || 'Not set' },
        { label: 'Date Mockup Completed', value: product.dateMockupCompleted || 'Not set' },
        { label: 'Date Published', value: product.datePublished || 'Not set' }
    ];

    return `
        <div class="workflow-timeline">
            ${timelineItems.map((item) => `<p class="workflow-timeline-item"><span class="workflow-timeline-label">${escapeHtml(item.label)}</span><span class="workflow-timeline-value">${escapeHtml(item.value)}</span></p>`).join('')}
        </div>
    `;
}

// Normalize one raw product into the shared master record shape while absorbing legacy queue data.
function normalizeProductRecord(product, legacyQueueItem, savedListing, hasMarketingPackage) {
    const createdAt = product.createdAt || new Date().toISOString();
    const approvedAt = product.approvedAt || '';
    const mockupCompletedAt = product.mockupCompletedAt || '';
    const publishedAt = product.publishedAt || '';

    return {
        ...product,
        title: product.title || 'Untitled Product',
        collection: product.collection || 'Seasonal',
        productType: product.productType || 'T-Shirt',
        status: product.status || 'Idea',
        priority: product.priority || 'Medium',
        designStatus: product.designStatus || 'Not Started',
        designPrompt: product.designPrompt || '',
        artworkConcept: product.artworkConcept || '',
        revisionNotes: product.revisionNotes || '',
        seoStatus: product.seoStatus || legacyQueueItem?.seoStatus || 'Not Started',
        mockupStatus: product.mockupStatus || legacyQueueItem?.mockupStatus || (product.mockupImageUrl || savedListing?.mockupImageUrl ? 'Created' : 'Not Started'),
        descriptionStatus: product.descriptionStatus || legacyQueueItem?.descriptionStatus || (product.productDescription || savedListing?.productDescription ? 'Drafted' : 'Not Started'),
        socialPostStatus: product.socialPostStatus || legacyQueueItem?.socialPostStatus || (hasMarketingPackage ? 'Drafted' : 'Not Started'),
        publishStatus: product.publishStatus || legacyQueueItem?.publishStatus || (product.status === 'Published' ? 'Published' : product.status === 'Ready to Publish' ? 'Ready' : 'Not Ready'),
        launchChannel: product.launchChannel || legacyQueueItem?.launchChannel || 'Shopify',
        mockupImageUrl: product.mockupImageUrl || savedListing?.mockupImageUrl || '',
        productDescription: product.productDescription || savedListing?.productDescription || '',
        listingSeoTitle: product.listingSeoTitle || savedListing?.seoTitle || '',
        listingSeoMetaDescription: product.listingSeoMetaDescription || savedListing?.seoMetaDescription || '',
        listingTags: product.listingTags || savedListing?.tags || '',
        printProvider: product.printProvider || savedListing?.printProvider || '',
        productColors: product.productColors || savedListing?.productColors || '',
        availableSizes: product.availableSizes || savedListing?.availableSizes || '',
        listingId: product.listingId || savedListing?.listingId || '',
        createdAt,
        dateCreated: product.dateCreated || formatStoredDate(createdAt),
        approvedAt,
        dateApproved: product.dateApproved || formatStoredDate(approvedAt),
        mockupCompletedAt,
        dateMockupCompleted: product.dateMockupCompleted || formatStoredDate(mockupCompletedAt),
        publishedAt,
        datePublished: product.datePublished || formatStoredDate(publishedAt)
    };
}

// Load Publishing Queue records while safely handling malformed localStorage data.
function loadPublishingQueue() {
    return loadProductLibrary().filter((product) => product.status === 'Ready to Publish');
}

// Persist queue records to localStorage.
function savePublishingQueue(queueItems) {
    localStorage.setItem(publishingQueueStorageKey, JSON.stringify(queueItems));
}

// Load persisted marketing packages from localStorage.
function loadMarketingPackages() {
    try {
        const raw = localStorage.getItem(marketingPackagesStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Persist all marketing packages to localStorage.
function saveMarketingPackages(packages) {
    localStorage.setItem(marketingPackagesStorageKey, JSON.stringify(packages));
}

// Load saved mockup/listing records from localStorage.
function loadMockupListings() {
    try {
        const raw = localStorage.getItem(mockupListingsStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Persist mockup/listing records to localStorage.
function saveMockupListings(listings) {
    localStorage.setItem(mockupListingsStorageKey, JSON.stringify(listings));
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

// Publishing Queue membership is now derived from the master product workflow state.
function getPublishingQueueProducts(products) {
    return products.filter((product) => product.status === 'Ready to Publish');
}

// Marketing packages are created from the same launch-ready products shown in Publishing Queue.
function getMarketingEligibleProducts(products) {
    return getPublishingQueueProducts(products);
}

// Determine if a queue item is fully launch-ready based on required checklist statuses.
function isQueueItemReadyToPublish(queueItem) {
    const checklistApproved = queueItem.seoStatus === 'Approved'
        && queueItem.mockupStatus === 'Approved'
        && queueItem.descriptionStatus === 'Approved'
        && queueItem.socialPostStatus === 'Scheduled';

    return checklistApproved && (queueItem.publishStatus === 'Ready' || queueItem.publishStatus === 'Published');
}

// Add a Product Library record into Publishing Queue by moving its master workflow state forward.
function addToPublishingQueue(product) {
    updateProductDesignFields(product.id, {
        status: 'Ready to Publish',
        publishStatus: 'Ready',
        launchChannel: product.launchChannel || 'Shopify'
    });
    showMessage(`${product.id} moved to Publishing Queue.`, 'success');
}

// Update one publishing checklist field on the shared product record.
function updatePublishingQueueStatus(queueId, fieldName, value) {
    const nextUpdates = {
        [fieldName]: value
    };

    if (fieldName === 'publishStatus') {
        if (value === 'Published') {
            const publishedAt = new Date().toISOString();
            nextUpdates.status = 'Published';
            nextUpdates.publishedAt = publishedAt;
            nextUpdates.datePublished = formatStoredDate(publishedAt);
        } else if (value === 'Ready') {
            nextUpdates.status = 'Ready to Publish';
        } else if (value === 'Not Ready') {
            nextUpdates.status = 'Ready for Mockup';
        }
    }

    if (fieldName === 'mockupStatus' && (value === 'Created' || value === 'Approved')) {
        const mockupCompletedAt = new Date().toISOString();
        nextUpdates.mockupCompletedAt = mockupCompletedAt;
        nextUpdates.dateMockupCompleted = formatStoredDate(mockupCompletedAt);
    }

    updateProductDesignFields(queueId, nextUpdates);
}

// Mark the launch-ready product as published on the master record.
function markQueueItemPublished(queueId) {
    const publishedAt = new Date().toISOString();

    updateProductDesignFields(queueId, {
        status: 'Published',
        publishStatus: 'Published',
        publishedAt,
        datePublished: formatStoredDate(publishedAt)
    });
    showMessage(`${queueId} marked as Published.`, 'success');
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
        item.id,
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

    const queueItems = getPublishingQueueProducts(loadProductLibrary());
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
        refreshMarketingProductOptions();
        return;
    }

    publishingQueueGrid.innerHTML = sortedQueueItems.map((item) => {
        const readyBadge = isQueueItemReadyToPublish(item)
            ? '<span class="pill status-good">Ready to Publish</span>'
            : '<span class="pill status-warning">Launch Prep In Progress</span>';

        return `
            <article class="publishing-queue-card" data-queue-id="${escapeHtml(item.id)}">
                <div class="product-card-top">
                    <div>
                        <p class="product-id">${escapeHtml(item.id)}</p>
                        <h3 class="product-title">${escapeHtml(item.title)}</h3>
                    </div>
                    ${readyBadge}
                </div>

                ${renderWorkflowProgress(item)}

                ${renderWorkflowTimeline(item)}

                <div class="product-meta">
                    <p class="product-meta-item"><span class="product-meta-label">Collection</span><span class="product-meta-value">${escapeHtml(item.collection || 'N/A')}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Product Type</span><span class="product-meta-value">${escapeHtml(item.productType || 'N/A')}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Estimated Price</span><span class="product-meta-value">${escapeHtml(formatCurrency(item.estimatedPrice))}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Estimated Cost</span><span class="product-meta-value">${escapeHtml(formatCurrency(item.estimatedCost))}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Estimated Margin</span><span class="product-meta-value">${escapeHtml(formatMargin(item.estimatedMargin))}</span></p>
                    <p class="product-meta-item"><span class="product-meta-label">Launch Channel</span><span class="product-meta-value">${escapeHtml(item.launchChannel || 'N/A')}</span></p>
                </div>

                <div class="publishing-checklist-grid">
                    ${renderQueueStatusSelect(item.id, 'seoStatus', item.seoStatus)}
                    ${renderQueueStatusSelect(item.id, 'mockupStatus', item.mockupStatus)}
                    ${renderQueueStatusSelect(item.id, 'descriptionStatus', item.descriptionStatus)}
                    ${renderQueueStatusSelect(item.id, 'socialPostStatus', item.socialPostStatus)}
                    ${renderQueueStatusSelect(item.id, 'publishStatus', item.publishStatus)}
                </div>

                <div class="publishing-queue-card-actions">
                    <button class="btn btn-primary mark-queue-published-btn" type="button" data-queue-id="${escapeHtml(item.id)}">Mark as Published</button>
                    <button class="btn btn-secondary delete-queue-item-btn" type="button" data-queue-id="${escapeHtml(item.id)}">Delete from Queue</button>
                </div>
            </article>
        `;
    }).join('');

    publishingQueueGrid.querySelectorAll('.publishing-queue-card').forEach((card) => observeAnimatedElement(card));
    refreshMarketingProductOptions();
}

// Populate the Marketing Content product selector from Publishing Queue items.
function refreshMarketingProductOptions() {
    if (!marketingQueueProductSelect) {
        return;
    }

    const queueItems = getMarketingEligibleProducts(loadProductLibrary());
    const previousValue = marketingQueueProductSelect.value;

    marketingQueueProductSelect.innerHTML = `
        <option value="">Select product from Publishing Queue</option>
        ${queueItems.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)} - ${escapeHtml(item.title)}</option>`).join('')}
    `;

    const stillExists = queueItems.some((item) => item.id === previousValue);
    if (stillExists) {
        marketingQueueProductSelect.value = previousValue;
    }
}

// Generate deterministic mock marketing copy using user inputs and selected queue item.
function buildMockMarketingPackage(queueItem, inputs) {
    const tone = inputs.marketingTone || 'Confident and fun';
    const platform = inputs.targetPlatform || queueItem.launchChannel || 'Shopify';
    const campaignGoal = inputs.campaignGoal || 'Drive launch-day conversions';
    const audience = inputs.audience || 'Fans of casual statement apparel';
    const promoAngle = inputs.promoAngle || 'Limited first-week launch offer';
    const title = queueItem.title;
    const collection = queueItem.collection || 'Core Collection';
    const productType = queueItem.productType || 'Apparel';

    return {
        packageId: `MKT-${queueItem.id}-${Date.now()}`,
        productId: queueItem.id,
        productTitle: title,
        collection,
        marketingTone: tone,
        targetPlatform: platform,
        campaignGoal,
        audience,
        promoAngle,
        instagramCaption: `${title} is here. ${promoAngle}. Built for ${audience.toLowerCase()} with a ${tone.toLowerCase()} voice. Tap to shop the launch now.`,
        facebookPost: `New drop alert: ${title} from the ${collection} collection. ${campaignGoal}. ${promoAngle}. This ${productType.toLowerCase()} is live now.`,
        tiktokCaption: `${title} just dropped. ${promoAngle}. ${campaignGoal}.`,
        pinterestDescription: `${title} is a ${tone.toLowerCase()} ${productType.toLowerCase()} concept from our ${collection} collection. ${promoAngle}. Great for ${audience.toLowerCase()}.`,
        emailSubjectLine: `${title} just launched: ${promoAngle}`,
        shortEmailBody: `The ${title} launch is live. ${campaignGoal}. This release is designed for ${audience.toLowerCase()} and follows our ${tone.toLowerCase()} campaign direction. Shop now before this promo window closes.`,
        productSeoTitle: `${title} | ${collection} ${productType} | Suneson Commerce`,
        productMetaDescription: `Shop ${title} from the ${collection} collection. ${promoAngle}. Designed for ${audience.toLowerCase()} and ready to wear now.`,
        suggestedHashtags: '#SunesonCommerce #NewDrop #ShopNow #GraphicApparel #LimitedLaunch',
        createdAt: new Date().toISOString(),
        createdDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
}

// Render one generated package preview before it is saved.
function renderMarketingPreview(marketingPackage) {
    if (!marketingPreview) {
        return;
    }

    if (!marketingPackage) {
        marketingPreview.innerHTML = '<article class="product-empty-state">Generate a marketing package to preview launch copy for social, email, and SEO fields.</article>';
        return;
    }

    marketingPreview.innerHTML = `
        <article class="marketing-preview-card">
            <div class="product-card-top">
                <div>
                    <p class="product-id">${escapeHtml(marketingPackage.productId)}</p>
                    <h3 class="product-title">${escapeHtml(marketingPackage.productTitle)}</h3>
                </div>
                <span class="pill status-info">Preview</span>
            </div>

            <div class="marketing-content-grid">
                <p class="marketing-content-item"><span>Instagram Caption</span>${escapeHtml(marketingPackage.instagramCaption)}</p>
                <p class="marketing-content-item"><span>Facebook Post</span>${escapeHtml(marketingPackage.facebookPost)}</p>
                <p class="marketing-content-item"><span>TikTok Caption</span>${escapeHtml(marketingPackage.tiktokCaption)}</p>
                <p class="marketing-content-item"><span>Pinterest Description</span>${escapeHtml(marketingPackage.pinterestDescription)}</p>
                <p class="marketing-content-item"><span>Email Subject Line</span>${escapeHtml(marketingPackage.emailSubjectLine)}</p>
                <p class="marketing-content-item"><span>Short Email Body</span>${escapeHtml(marketingPackage.shortEmailBody)}</p>
                <p class="marketing-content-item"><span>Product SEO Title</span>${escapeHtml(marketingPackage.productSeoTitle)}</p>
                <p class="marketing-content-item"><span>Product Meta Description</span>${escapeHtml(marketingPackage.productMetaDescription)}</p>
                <p class="marketing-content-item"><span>Suggested Hashtags</span>${escapeHtml(marketingPackage.suggestedHashtags)}</p>
            </div>
        </article>
    `;

    marketingPreview.querySelectorAll('.marketing-preview-card').forEach((card) => observeAnimatedElement(card));
}

// Sync queue social post status to Drafted whenever a package is saved for a product.
function syncPublishingQueueSocialStatusToDrafted(productId) {
    updateProductDesignFields(productId, {
        socialPostStatus: 'Drafted'
    });
}

// Convert saved marketing package collection to CSV format.
function marketingPackagesToCsv(packages) {
    const headers = [
        'Package ID',
        'Product ID',
        'Product Title',
        'Collection',
        'Marketing Tone',
        'Target Platform',
        'Campaign Goal',
        'Audience',
        'Promo Angle',
        'Instagram Caption',
        'Facebook Post',
        'TikTok Caption',
        'Pinterest Description',
        'Email Subject Line',
        'Short Email Body',
        'Product SEO Title',
        'Product Meta Description',
        'Suggested Hashtags',
        'Date Created'
    ];

    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    const rows = packages.map((item) => [
        item.packageId,
        item.productId,
        item.productTitle,
        item.collection,
        item.marketingTone,
        item.targetPlatform,
        item.campaignGoal,
        item.audience,
        item.promoAngle,
        item.instagramCaption,
        item.facebookPost,
        item.tiktokCaption,
        item.pinterestDescription,
        item.emailSubjectLine,
        item.shortEmailBody,
        item.productSeoTitle,
        item.productMetaDescription,
        item.suggestedHashtags,
        item.createdDate
    ]);

    return [headers, ...rows]
        .map((row) => row.map(escapeCsv).join(','))
        .join('\n');
}

// Copy text to clipboard with a fallback for environments without clipboard permissions.
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const helperInput = document.createElement('textarea');
        helperInput.value = text;
        helperInput.style.position = 'fixed';
        helperInput.style.opacity = '0';
        document.body.appendChild(helperInput);
        helperInput.focus();
        helperInput.select();

        try {
            const successful = document.execCommand('copy');
            helperInput.remove();
            if (successful) {
                resolve();
                return;
            }

            reject(new Error('Copy command failed.'));
        } catch (error) {
            helperInput.remove();
            reject(error);
        }
    });
}

// Render full package fields into the modal for detailed review.
function renderMarketingPackageModal(packageRecord) {
    if (!marketingPackageModalContent || !packageRecord) {
        return;
    }

    marketingPackageModalContent.innerHTML = `
        <div class="product-card-top">
            <div>
                <p class="product-id">${escapeHtml(packageRecord.productId)}</p>
                <h3 class="product-title">${escapeHtml(packageRecord.productTitle)}</h3>
            </div>
            <span class="pill status-info">Package Detail</span>
        </div>
        <div class="marketing-content-grid">
            <p class="marketing-content-item"><span>Platform</span>${escapeHtml(packageRecord.targetPlatform)}</p>
            <p class="marketing-content-item"><span>Campaign Goal</span>${escapeHtml(packageRecord.campaignGoal)}</p>
            <p class="marketing-content-item"><span>Tone</span>${escapeHtml(packageRecord.marketingTone)}</p>
            <p class="marketing-content-item"><span>Audience</span>${escapeHtml(packageRecord.audience)}</p>
            <p class="marketing-content-item"><span>Promo Angle</span>${escapeHtml(packageRecord.promoAngle)}</p>
            <p class="marketing-content-item"><span>Instagram Caption</span>${escapeHtml(packageRecord.instagramCaption)}</p>
            <p class="marketing-content-item"><span>Facebook Post</span>${escapeHtml(packageRecord.facebookPost)}</p>
            <p class="marketing-content-item"><span>TikTok Caption</span>${escapeHtml(packageRecord.tiktokCaption)}</p>
            <p class="marketing-content-item"><span>Pinterest Description</span>${escapeHtml(packageRecord.pinterestDescription)}</p>
            <p class="marketing-content-item"><span>Email Subject Line</span>${escapeHtml(packageRecord.emailSubjectLine)}</p>
            <p class="marketing-content-item"><span>Short Email Body</span>${escapeHtml(packageRecord.shortEmailBody)}</p>
            <p class="marketing-content-item"><span>SEO Title</span>${escapeHtml(packageRecord.productSeoTitle)}</p>
            <p class="marketing-content-item"><span>Meta Description</span>${escapeHtml(packageRecord.productMetaDescription)}</p>
            <p class="marketing-content-item"><span>Suggested Hashtags</span>${escapeHtml(packageRecord.suggestedHashtags)}</p>
            <p class="marketing-content-item"><span>Saved On</span>${escapeHtml(packageRecord.createdDate)}</p>
        </div>
    `;
}

// Open details modal for a specific package.
function openMarketingPackageModal(packageRecord) {
    if (!marketingPackageModal || !packageRecord) {
        return;
    }

    renderMarketingPackageModal(packageRecord);
    marketingPackageModal.hidden = false;
    marketingPackageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Close details modal and restore page scroll.
function closeMarketingPackageModal() {
    if (!marketingPackageModal) {
        return;
    }

    marketingPackageModal.hidden = true;
    marketingPackageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Remove stale content so details are always rendered from an explicit package selection.
    if (marketingPackageModalContent) {
        marketingPackageModalContent.innerHTML = '';
    }
}

// Render saved marketing packages as responsive cards.
function refreshMarketingPackages() {
    if (!marketingPackagesGrid) {
        return;
    }

    const packages = loadMarketingPackages();
    const sortedPackages = [...packages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const productsById = new Map(loadProductLibrary().map((product) => [product.id, product]));

    if (marketingPackagesSummary) {
        marketingPackagesSummary.textContent = `${sortedPackages.length} saved marketing packages`;
    }

    if (!sortedPackages.length) {
        marketingPackagesGrid.innerHTML = '<article class="product-empty-state">No saved marketing packages yet. Generate and save a package to build your reusable campaign library.</article>';
        return;
    }

    marketingPackagesGrid.innerHTML = sortedPackages.map((item) => {
        const linkedProduct = productsById.get(item.productId);

        return `
        <article class="marketing-package-card" data-package-id="${escapeHtml(item.packageId)}">
            <div class="product-card-top">
                <div>
                    <p class="product-id">${escapeHtml(item.productId)}</p>
                    <h3 class="product-title">${escapeHtml(linkedProduct?.title || item.productTitle)}</h3>
                </div>
                <span class="pill status-good">Saved</span>
            </div>

            <div class="product-meta">
                <p class="product-meta-item"><span class="product-meta-label">Platform</span><span class="product-meta-value">${escapeHtml(item.targetPlatform)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Campaign Goal</span><span class="product-meta-value">${escapeHtml(item.campaignGoal)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Tone</span><span class="product-meta-value">${escapeHtml(item.marketingTone)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Audience</span><span class="product-meta-value">${escapeHtml(item.audience)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Promo Angle</span><span class="product-meta-value">${escapeHtml(item.promoAngle)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Instagram Caption</span><span class="product-meta-value">${escapeHtml(`${item.instagramCaption.slice(0, 70)}${item.instagramCaption.length > 70 ? '...' : ''}`)}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Saved On</span><span class="product-meta-value">${escapeHtml(item.createdDate)}</span></p>
            </div>

            <div class="marketing-package-actions">
                <button class="btn btn-secondary view-marketing-package-btn" type="button" data-package-id="${escapeHtml(item.packageId)}">View Package Details</button>
                <button class="btn btn-secondary copy-package-caption-btn" type="button" data-package-id="${escapeHtml(item.packageId)}">Copy Caption</button>
                <button class="btn btn-secondary delete-marketing-package-btn" type="button" data-package-id="${escapeHtml(item.packageId)}">Delete Package</button>
            </div>
        </article>
    `;
    }).join('');

    marketingPackagesGrid.querySelectorAll('.marketing-package-card').forEach((card) => observeAnimatedElement(card));
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
        designPrompt: '',
        artworkConcept: '',
        revisionNotes: '',
        seoStatus: 'Not Started',
        mockupStatus: 'Not Started',
        descriptionStatus: 'Not Started',
        socialPostStatus: 'Not Started',
        publishStatus: 'Not Ready',
        launchChannel: launchChannelSelect?.value || 'Manual',
        notes: productNotesInput?.value.trim() || '',
        createdAt: timestamp.toISOString(),
        dateCreated: timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        approvedAt: '',
        dateApproved: '',
        mockupCompletedAt: '',
        dateMockupCompleted: '',
        publishedAt: '',
        datePublished: ''
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
            ${renderWorkflowProgress(product)}
            ${renderWorkflowTimeline(product)}
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
    refreshDesignApprovalQueue();
    refreshMockupListingProductOptions();
    refreshPublishingQueue();
    refreshSavedListings();
    refreshMarketingPackages();
}

// Keep only product records currently in design workflow states.
function getDesignApprovalQueueProducts(products) {
    return products.filter((product) => designApprovalQueueStatuses.includes(product.designStatus || 'Not Started'));
}

// Apply queue-specific filters for design status, collection, and priority.
function filterDesignApprovalQueueProducts(products) {
    const selectedDesignStatus = designQueueStatusFilter?.value || 'all';
    const selectedCollection = designQueueCollectionFilter?.value || 'all';
    const selectedPriority = designQueuePriorityFilter?.value || 'all';

    return products.filter((product) => {
        const designStatus = product.designStatus || 'Not Started';
        const statusMatch = selectedDesignStatus === 'all' || designStatus === selectedDesignStatus;
        const collectionMatch = selectedCollection === 'all' || product.collection === selectedCollection;
        const priorityMatch = selectedPriority === 'all' || product.priority === selectedPriority;

        return statusMatch && collectionMatch && priorityMatch;
    });
}

// Render Design Approval Queue cards and editing controls.
function refreshDesignApprovalQueue() {
    if (!designApprovalGrid) {
        return;
    }

    const products = loadProductLibrary();
    const queueProducts = getDesignApprovalQueueProducts(products);
    const visibleProducts = filterDesignApprovalQueueProducts(queueProducts);

    if (!visibleProducts.length) {
        designApprovalGrid.innerHTML = '<article class="product-empty-state">No products currently match the Design Approval Queue filters. Add items in Product Library or adjust queue filters.</article>';
        return;
    }

    designApprovalGrid.innerHTML = visibleProducts.map((product) => `
        <article class="design-approval-card" data-product-id="${escapeHtml(product.id)}">
            <div class="product-card-top">
                <div>
                    <p class="product-id">${escapeHtml(product.id)}</p>
                    <h3 class="product-title">${escapeHtml(product.title)}</h3>
                </div>
                <span class="pill ${statusClassForProduct(product.status)}">${escapeHtml(product.status || 'In Design')}</span>
            </div>

            ${renderWorkflowProgress(product)}

            ${renderWorkflowTimeline(product)}

            <div class="product-meta">
                <p class="product-meta-item"><span class="product-meta-label">Collection</span><span class="product-meta-value">${escapeHtml(product.collection || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Product Type</span><span class="product-meta-value">${escapeHtml(product.productType || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Design Status</span><span class="product-meta-value">${escapeHtml(product.designStatus || 'Not Started')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Priority</span><span class="product-meta-value ${priorityClass(product.priority)}">${escapeHtml(product.priority || 'Medium')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Notes</span><span class="product-meta-value">${escapeHtml(product.notes || 'N/A')}</span></p>
            </div>

            <div class="design-approval-editor">
                <label class="generator-field" for="designPrompt-${escapeHtml(product.id)}">
                    <span>Design Prompt</span>
                    <textarea id="designPrompt-${escapeHtml(product.id)}" class="design-queue-input" data-design-field="designPrompt" data-product-id="${escapeHtml(product.id)}" rows="2" placeholder="Add or refine the design prompt">${escapeHtml(product.designPrompt || '')}</textarea>
                </label>

                <label class="generator-field" for="artworkConcept-${escapeHtml(product.id)}">
                    <span>Artwork Concept</span>
                    <textarea id="artworkConcept-${escapeHtml(product.id)}" class="design-queue-input" data-design-field="artworkConcept" data-product-id="${escapeHtml(product.id)}" rows="2" placeholder="Describe composition, typography, and visual direction">${escapeHtml(product.artworkConcept || '')}</textarea>
                </label>

                <label class="generator-field" for="designStatus-${escapeHtml(product.id)}">
                    <span>Design Status</span>
                    <select id="designStatus-${escapeHtml(product.id)}" class="design-queue-select" data-design-field="designStatus" data-product-id="${escapeHtml(product.id)}">
                        <option value="Not Started" ${(product.designStatus || 'Not Started') === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="Prompt Written" ${(product.designStatus || 'Not Started') === 'Prompt Written' ? 'selected' : ''}>Prompt Written</option>
                        <option value="AI Generated" ${(product.designStatus || 'Not Started') === 'AI Generated' ? 'selected' : ''}>AI Generated</option>
                        <option value="Needs Revision" ${(product.designStatus || 'Not Started') === 'Needs Revision' ? 'selected' : ''}>Needs Revision</option>
                        <option value="Approved" ${(product.designStatus || 'Not Started') === 'Approved' ? 'selected' : ''}>Approved</option>
                    </select>
                </label>

                <label class="generator-field" for="revisionNotes-${escapeHtml(product.id)}">
                    <span>Revision Notes</span>
                    <textarea id="revisionNotes-${escapeHtml(product.id)}" class="design-queue-input" data-design-field="revisionNotes" data-product-id="${escapeHtml(product.id)}" rows="2" placeholder="Capture revision requests and QA notes">${escapeHtml(product.revisionNotes || '')}</textarea>
                </label>
            </div>

            <div class="design-approval-actions">
                <button class="btn btn-secondary save-design-notes-btn" type="button" data-product-id="${escapeHtml(product.id)}">Save Design Notes</button>
                <button class="btn btn-secondary mark-ai-generated-btn" type="button" data-product-id="${escapeHtml(product.id)}">Mark AI Generated</button>
                <button class="btn btn-secondary mark-needs-revision-btn" type="button" data-product-id="${escapeHtml(product.id)}">Needs Revision</button>
                <button class="btn btn-primary approve-design-btn" type="button" data-product-id="${escapeHtml(product.id)}">Approve Design</button>
            </div>
        </article>
    `).join('');

    designApprovalGrid.querySelectorAll('.design-approval-card').forEach((card) => observeAnimatedElement(card));
}

// Read current design editor field values from one queue card.
function getDesignQueueCardValues(productId) {
    const escapedProductId = CSS.escape(productId);
    const card = designApprovalGrid?.querySelector(`.design-approval-card[data-product-id="${escapedProductId}"]`);
    if (!card) {
        return null;
    }

    return {
        designPrompt: card.querySelector('[data-design-field="designPrompt"]')?.value.trim() || '',
        artworkConcept: card.querySelector('[data-design-field="artworkConcept"]')?.value.trim() || '',
        designStatus: card.querySelector('[data-design-field="designStatus"]')?.value || 'Not Started',
        revisionNotes: card.querySelector('[data-design-field="revisionNotes"]')?.value.trim() || ''
    };
}

// Persist design updates for a single product in Product Library.
function updateProductDesignFields(productId, updates) {
    const products = loadProductLibrary();
    const updatedProducts = products.map((product) => {
        if (product.id !== productId) {
            return product;
        }

        return {
            ...product,
            ...updates
        };
    });

    saveProductLibrary(updatedProducts);
    refreshProductLibrary();
}

// Restrict builder options to approved designs that are ready for mockup or publish staging.
function getEligibleMockupListingProducts(products) {
    return products.filter((product) => product.designStatus === 'Approved');
}

// Reset the builder form when there is no selected product or after delete flows.
function resetMockupListingForm() {
    editingListingId = null;

    if (mockupListingProductSelect) {
        mockupListingProductSelect.value = '';
    }

    if (mockupImageUrlInput) {
        mockupImageUrlInput.value = '';
    }

    if (listingProductTitleInput) {
        listingProductTitleInput.value = '';
    }

    if (listingProductDescriptionInput) {
        listingProductDescriptionInput.value = '';
    }

    if (listingSeoTitleInput) {
        listingSeoTitleInput.value = '';
    }

    if (listingSeoMetaDescriptionInput) {
        listingSeoMetaDescriptionInput.value = '';
    }

    if (listingTagsInput) {
        listingTagsInput.value = '';
    }

    if (listingPriceInput) {
        listingPriceInput.value = '';
    }

    if (listingCostInput) {
        listingCostInput.value = '';
    }

    if (listingPrintProviderInput) {
        listingPrintProviderInput.value = '';
    }

    if (listingColorsInput) {
        listingColorsInput.value = '';
    }

    if (listingSizesInput) {
        listingSizesInput.value = '';
    }
}

// Populate form from selected product and any saved listing tied to that product.
function populateMockupListingForm(productId) {
    if (!productId) {
        resetMockupListingForm();
        return;
    }

    const products = loadProductLibrary();
    const targetProduct = products.find((product) => product.id === productId);
    const savedListing = loadMockupListings().find((listing) => listing.productId === productId);

    if (!targetProduct) {
        resetMockupListingForm();
        return;
    }

    editingListingId = savedListing?.listingId || null;

    if (mockupListingProductSelect) {
        mockupListingProductSelect.value = productId;
    }

    if (mockupImageUrlInput) {
        mockupImageUrlInput.value = savedListing?.mockupImageUrl || '';
    }

    if (listingProductTitleInput) {
        listingProductTitleInput.value = savedListing?.productTitle || targetProduct.title || '';
    }

    if (listingProductDescriptionInput) {
        listingProductDescriptionInput.value = savedListing?.productDescription || '';
    }

    if (listingSeoTitleInput) {
        listingSeoTitleInput.value = savedListing?.seoTitle || '';
    }

    if (listingSeoMetaDescriptionInput) {
        listingSeoMetaDescriptionInput.value = savedListing?.seoMetaDescription || '';
    }

    if (listingTagsInput) {
        listingTagsInput.value = savedListing?.tags || '';
    }

    if (listingPriceInput) {
        listingPriceInput.value = savedListing?.productPrice ?? targetProduct.estimatedPrice ?? '';
    }

    if (listingCostInput) {
        listingCostInput.value = savedListing?.productCost ?? targetProduct.estimatedCost ?? '';
    }

    if (listingPrintProviderInput) {
        listingPrintProviderInput.value = savedListing?.printProvider || '';
    }

    if (listingColorsInput) {
        listingColorsInput.value = savedListing?.productColors || '';
    }

    if (listingSizesInput) {
        listingSizesInput.value = savedListing?.availableSizes || '';
    }
}

// Keep the product selector aligned with eligible Product Library records.
function refreshMockupListingProductOptions() {
    if (!mockupListingProductSelect) {
        return;
    }

    const products = getEligibleMockupListingProducts(loadProductLibrary());
    const previousValue = mockupListingProductSelect.value;

    mockupListingProductSelect.innerHTML = `
        <option value="">Select approved product</option>
        ${products.map((product) => `<option value="${escapeHtml(product.id)}">${escapeHtml(product.id)} - ${escapeHtml(product.title)}</option>`).join('')}
    `;

    const stillExists = products.some((product) => product.id === previousValue);
    if (stillExists) {
        mockupListingProductSelect.value = previousValue;
        populateMockupListingForm(previousValue);
        return;
    }

    resetMockupListingForm();
}

// Build mock placeholder copy for listing draft generation.
function buildDraftListingContent(product) {
    const collection = product.collection || 'Core Collection';
    const productType = product.productType || 'Apparel';
    const productTitle = listingProductTitleInput?.value.trim() || product.title;

    return {
        productDescription: `${productTitle} is a premium ${productType.toLowerCase()} from the ${collection} collection, built around an approved graphic concept and designed for everyday wear, gifting, and launch-day momentum. This mock listing copy highlights comfort, visual character, and easy merchandising across storefront and social surfaces.`,
        seoTitle: `${productTitle} | ${collection} ${productType} | Suneson Commerce`,
        seoMetaDescription: `Shop ${productTitle} from the ${collection} collection. Premium ${productType.toLowerCase()} styling, approved artwork, and launch-ready presentation for your next drop.`,
        tags: `${collection}, ${productType}, graphic apparel, new drop, approved design`
    };
}

// Read current listing form values into a single object for save and status actions.
function buildListingPayloadFromForm(product) {
    const listingId = editingListingId || `LIST-${product.id}-${Date.now()}`;
    const existingListing = loadMockupListings().find((listing) => listing.listingId === editingListingId);
    const createdAt = existingListing?.createdAt || new Date().toISOString();
    const createdDate = existingListing?.createdDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return {
        listingId,
        productId: product.id,
        mockupImageUrl: mockupImageUrlInput?.value.trim() || '',
        productTitle: listingProductTitleInput?.value.trim() || product.title,
        productDescription: listingProductDescriptionInput?.value.trim() || '',
        seoTitle: listingSeoTitleInput?.value.trim() || '',
        seoMetaDescription: listingSeoMetaDescriptionInput?.value.trim() || '',
        tags: listingTagsInput?.value.trim() || '',
        productPrice: parseMoneyInput(listingPriceInput?.value.trim()),
        productCost: parseMoneyInput(listingCostInput?.value.trim()),
        printProvider: listingPrintProviderInput?.value.trim() || '',
        productColors: listingColorsInput?.value.trim() || '',
        availableSizes: listingSizesInput?.value.trim() || '',
        createdAt,
        createdDate,
        updatedAt: new Date().toISOString(),
        updatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
}

// Save current listing form and sync key fields back to the Product Library record.
function saveListingFromForm(showToast = true) {
    const productId = mockupListingProductSelect?.value || '';
    if (!productId) {
        if (showToast) {
            showMessage('Select an approved product first.', 'error');
        }
        return null;
    }

    const products = loadProductLibrary();
    const targetProduct = products.find((product) => product.id === productId);
    if (!targetProduct) {
        if (showToast) {
            showMessage('Selected product could not be found.', 'error');
        }
        return null;
    }

    const listingPayload = buildListingPayloadFromForm(targetProduct);
    if (!listingPayload.productTitle) {
        if (showToast) {
            showMessage('Product title is required for a listing.', 'error');
        }
        return null;
    }

    const listings = loadMockupListings();
    const existingIndex = listings.findIndex((listing) => listing.productId === productId || listing.listingId === listingPayload.listingId);
    const nextListings = [...listings];

    if (existingIndex >= 0) {
        nextListings[existingIndex] = listingPayload;
    } else {
        nextListings.unshift(listingPayload);
    }

    saveMockupListings(nextListings);

    const updatedProducts = products.map((product) => {
        if (product.id !== productId) {
            return product;
        }

        return {
            ...product,
            title: listingPayload.productTitle,
            estimatedPrice: listingPayload.productPrice,
            estimatedCost: listingPayload.productCost,
            listingId: listingPayload.listingId,
            mockupImageUrl: listingPayload.mockupImageUrl,
            listingSeoTitle: listingPayload.seoTitle,
            listingSeoMetaDescription: listingPayload.seoMetaDescription,
            listingTags: listingPayload.tags,
            printProvider: listingPayload.printProvider,
            productColors: listingPayload.productColors,
            availableSizes: listingPayload.availableSizes,
            productDescription: listingPayload.productDescription,
            descriptionStatus: listingPayload.productDescription ? 'Drafted' : product.descriptionStatus,
            seoStatus: listingPayload.seoTitle || listingPayload.seoMetaDescription ? 'Drafted' : product.seoStatus
        };
    });

    saveProductLibrary(updatedProducts);
    editingListingId = listingPayload.listingId;
    refreshSavedListings();
    refreshProductLibrary();

    if (showToast) {
        showMessage(`${productId} listing saved.`, 'success');
    }

    return updatedProducts.find((product) => product.id === productId) || null;
}

// Render saved listing cards for quick review and edit access.
function refreshSavedListings() {
    if (!savedListingsGrid) {
        return;
    }

    const listings = [...loadMockupListings()].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
    const productsById = new Map(loadProductLibrary().map((product) => [product.id, product]));

    if (savedListingsSummary) {
        savedListingsSummary.textContent = `${listings.length} saved listings`;
    }

    if (!listings.length) {
        savedListingsGrid.innerHTML = '<article class="product-empty-state">No saved listings yet. Select an approved product and save a listing to build this library.</article>';
        return;
    }

    savedListingsGrid.innerHTML = listings.map((listing) => {
        const linkedProduct = productsById.get(listing.productId);

        return `
        <article class="saved-listing-card" data-listing-id="${escapeHtml(listing.listingId)}">
            <div class="product-card-top">
                <div>
                    <p class="product-id">${escapeHtml(listing.productId)}</p>
                    <h3 class="product-title">${escapeHtml(linkedProduct?.title || listing.productTitle)}</h3>
                </div>
                <span class="pill status-info">Listing Saved</span>
            </div>

            ${linkedProduct ? renderWorkflowProgress(linkedProduct) : ''}

            ${linkedProduct ? renderWorkflowTimeline(linkedProduct) : ''}

            ${listing.mockupImageUrl ? `<div class="saved-listing-image-wrap"><img class="saved-listing-image" src="${escapeHtml(listing.mockupImageUrl)}" alt="${escapeHtml(listing.productTitle)} mockup preview"></div>` : ''}

            <div class="product-meta">
                <p class="product-meta-item"><span class="product-meta-label">Print Provider</span><span class="product-meta-value">${escapeHtml(listing.printProvider || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Price</span><span class="product-meta-value">${escapeHtml(formatCurrency(listing.productPrice))}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Cost</span><span class="product-meta-value">${escapeHtml(formatCurrency(listing.productCost))}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Colors</span><span class="product-meta-value">${escapeHtml(listing.productColors || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Sizes</span><span class="product-meta-value">${escapeHtml(listing.availableSizes || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Tags</span><span class="product-meta-value">${escapeHtml(listing.tags || 'N/A')}</span></p>
                <p class="product-meta-item"><span class="product-meta-label">Updated</span><span class="product-meta-value">${escapeHtml(listing.updatedDate || listing.createdDate)}</span></p>
            </div>

            <div class="saved-listing-actions">
                <button class="btn btn-secondary edit-listing-btn" type="button" data-listing-id="${escapeHtml(listing.listingId)}">Edit Listing</button>
                <button class="btn btn-secondary delete-listing-btn" type="button" data-listing-id="${escapeHtml(listing.listingId)}">Delete Listing</button>
            </div>
        </article>
    `;
    }).join('');

    savedListingsGrid.querySelectorAll('.saved-listing-card').forEach((card) => observeAnimatedElement(card));
}

// Convert saved listings to CSV for export.
function mockupListingsToCsv(listings) {
    const headers = [
        'Listing ID',
        'Product ID',
        'Product Title',
        'Mockup Image URL',
        'Product Description',
        'SEO Title',
        'SEO Meta Description',
        'Tags',
        'Product Price',
        'Product Cost',
        'Print Provider',
        'Product Colors',
        'Available Sizes',
        'Created Date',
        'Updated Date'
    ];

    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    return [headers, ...listings.map((listing) => [
        listing.listingId,
        listing.productId,
        listing.productTitle,
        listing.mockupImageUrl,
        listing.productDescription,
        listing.seoTitle,
        listing.seoMetaDescription,
        listing.tags,
        listing.productPrice ?? '',
        listing.productCost ?? '',
        listing.printProvider,
        listing.productColors,
        listing.availableSizes,
        listing.createdDate,
        listing.updatedDate || listing.createdDate
    ])]
        .map((row) => row.map(escapeCsv).join(','))
        .join('\n');
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
        designPrompt: '',
        artworkConcept: '',
        revisionNotes: '',
        seoStatus: 'Not Started',
        mockupStatus: 'Not Started',
        descriptionStatus: 'Not Started',
        socialPostStatus: 'Not Started',
        publishStatus: 'Not Ready',
        launchChannel: 'Manual',
        notes: idea.marketingAngle || '',
        createdAt: timestamp.toISOString(),
        dateCreated: timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        approvedAt: '',
        dateApproved: '',
        mockupCompletedAt: '',
        dateMockupCompleted: '',
        publishedAt: '',
        datePublished: ''
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

// Bind Design Approval Queue filter controls.
if (designQueueStatusFilter) {
    designQueueStatusFilter.addEventListener('change', refreshDesignApprovalQueue);
}

if (designQueueCollectionFilter) {
    designQueueCollectionFilter.addEventListener('change', refreshDesignApprovalQueue);
}

if (designQueuePriorityFilter) {
    designQueuePriorityFilter.addEventListener('change', refreshDesignApprovalQueue);
}

// Load selected product or existing listing details into the builder form.
if (mockupListingProductSelect) {
    mockupListingProductSelect.addEventListener('change', () => {
        populateMockupListingForm(mockupListingProductSelect.value);
    });
}

// Generate mock placeholder listing copy for the selected approved product.
if (generateDraftListingBtn) {
    generateDraftListingBtn.addEventListener('click', () => {
        const productId = mockupListingProductSelect?.value || '';
        const product = loadProductLibrary().find((item) => item.id === productId);

        if (!product) {
            showMessage('Select an approved product first.', 'error');
            return;
        }

        const draft = buildDraftListingContent(product);

        if (listingProductDescriptionInput) {
            listingProductDescriptionInput.value = draft.productDescription;
        }

        if (listingSeoTitleInput) {
            listingSeoTitleInput.value = draft.seoTitle;
        }

        if (listingSeoMetaDescriptionInput) {
            listingSeoMetaDescriptionInput.value = draft.seoMetaDescription;
        }

        if (listingTagsInput) {
            listingTagsInput.value = draft.tags;
        }

        if (listingProductTitleInput && !listingProductTitleInput.value.trim()) {
            listingProductTitleInput.value = product.title;
        }

        showMessage('Draft listing copy generated.', 'success');
    });
}

// Save listing form details and link the listing back to Product Library.
if (saveListingBtn) {
    saveListingBtn.addEventListener('click', () => {
        saveListingFromForm(true);
    });
}

// Promote selected approved product into mockup-complete stage.
if (markMockupCreatedBtn) {
    markMockupCreatedBtn.addEventListener('click', () => {
        const savedProduct = saveListingFromForm(false);
        const productId = mockupListingProductSelect?.value || '';
        const mockupCompletedAt = new Date().toISOString();

        if (!productId && !savedProduct) {
            showMessage('Select a product before marking mockup status.', 'error');
            return;
        }

        updateProductDesignFields(productId || savedProduct.id, {
            status: 'Ready to Publish',
            mockupStatus: 'Created',
            publishStatus: 'Ready',
            mockupCompletedAt,
            dateMockupCompleted: formatStoredDate(mockupCompletedAt)
        });
        showMessage(`${productId || savedProduct.id} marked as Ready to Publish.`, 'success');
    });
}

// Sync selected product into Publishing Queue once the listing is ready to launch.
if (markListingReadyToPublishBtn) {
    markListingReadyToPublishBtn.addEventListener('click', () => {
        const savedProduct = saveListingFromForm(false);
        const productId = mockupListingProductSelect?.value || savedProduct?.id || '';
        const product = loadProductLibrary().find((item) => item.id === productId);

        if (!product) {
            showMessage('Select a product before moving it to Publishing Queue.', 'error');
            return;
        }

        addToPublishingQueue(product);
    });
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
            const publishedAt = new Date().toISOString();
            const updatedProducts = products.map((product) => {
                if (product.id !== productId) {
                    return product;
                }

                return {
                    ...product,
                    status: 'Published',
                    designStatus: product.designStatus === 'Approved' ? 'Approved' : product.designStatus,
                    publishStatus: 'Published',
                    publishedAt,
                    datePublished: formatStoredDate(publishedAt)
                };
            });

            saveProductLibrary(updatedProducts);
            refreshProductLibrary();
            showMessage(`${productId} marked as Published.`, 'success');
        }
    });
}

// Delegate Design Approval Queue actions and status transitions.
if (designApprovalGrid) {
    designApprovalGrid.addEventListener('click', (event) => {
        const actionButton = event.target.closest('button[data-product-id]');
        if (!actionButton) {
            return;
        }

        const productId = actionButton.dataset.productId;
        if (!productId) {
            return;
        }

        const currentValues = getDesignQueueCardValues(productId);
        if (!currentValues) {
            showMessage('Design card values could not be read.', 'error');
            return;
        }

        if (actionButton.classList.contains('save-design-notes-btn')) {
            updateProductDesignFields(productId, {
                designPrompt: currentValues.designPrompt,
                artworkConcept: currentValues.artworkConcept,
                designStatus: currentValues.designStatus,
                revisionNotes: currentValues.revisionNotes,
                status: currentValues.designStatus === 'Approved' ? 'Ready for Mockup' : 'In Design'
            });
            showMessage(`${productId} design notes saved.`, 'success');
            return;
        }

        if (actionButton.classList.contains('mark-ai-generated-btn')) {
            updateProductDesignFields(productId, {
                designPrompt: currentValues.designPrompt,
                artworkConcept: currentValues.artworkConcept,
                designStatus: 'AI Generated',
                revisionNotes: currentValues.revisionNotes,
                status: 'In Design'
            });
            showMessage(`${productId} set to AI Generated.`, 'success');
            return;
        }

        if (actionButton.classList.contains('mark-needs-revision-btn')) {
            updateProductDesignFields(productId, {
                designPrompt: currentValues.designPrompt,
                artworkConcept: currentValues.artworkConcept,
                designStatus: 'Needs Revision',
                revisionNotes: currentValues.revisionNotes,
                status: 'In Design'
            });
            showMessage(`${productId} marked as Needs Revision.`, 'success');
            return;
        }

        if (actionButton.classList.contains('approve-design-btn')) {
            const approvedAt = new Date().toISOString();
            updateProductDesignFields(productId, {
                designPrompt: currentValues.designPrompt,
                artworkConcept: currentValues.artworkConcept,
                designStatus: 'Approved',
                revisionNotes: currentValues.revisionNotes,
                status: 'Ready for Mockup',
                approvedAt,
                dateApproved: formatStoredDate(approvedAt)
            });
            showMessage(`${productId} approved and moved to Ready for Mockup.`, 'success');
        }
    });
}

// Delegate saved listing edit and delete actions.
if (savedListingsGrid) {
    savedListingsGrid.addEventListener('click', (event) => {
        const editButton = event.target.closest('.edit-listing-btn');
        if (editButton) {
            const listingId = editButton.dataset.listingId;
            const listing = loadMockupListings().find((item) => item.listingId === listingId);

            if (!listing) {
                showMessage('Listing not found.', 'error');
                return;
            }

            populateMockupListingForm(listing.productId);
            document.querySelector('#mockup-listing-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showMessage(`Editing listing for ${listing.productId}.`, 'success');
            return;
        }

        const deleteButton = event.target.closest('.delete-listing-btn');
        if (deleteButton) {
            const listingId = deleteButton.dataset.listingId;
            const listings = loadMockupListings();
            const targetListing = listings.find((item) => item.listingId === listingId);
            const remainingListings = listings.filter((item) => item.listingId !== listingId);

            saveMockupListings(remainingListings);

            if (targetListing) {
                const updatedProducts = loadProductLibrary().map((product) => {
                    if (product.id !== targetListing.productId) {
                        return product;
                    }

                    const nextProduct = { ...product };
                    delete nextProduct.listingId;
                    delete nextProduct.mockupImageUrl;
                    delete nextProduct.listingSeoTitle;
                    delete nextProduct.listingSeoMetaDescription;
                    delete nextProduct.listingTags;
                    delete nextProduct.printProvider;
                    delete nextProduct.productColors;
                    delete nextProduct.availableSizes;
                    delete nextProduct.productDescription;
                    return nextProduct;
                });

                saveProductLibrary(updatedProducts);

                if (mockupListingProductSelect?.value === targetListing.productId) {
                    populateMockupListingForm(targetListing.productId);
                }
            }

            refreshSavedListings();
            refreshProductLibrary();
            showMessage('Listing deleted.', 'success');
        }
    });
}

// Export saved listings as CSV.
if (exportListingsCsvBtn) {
    exportListingsCsvBtn.addEventListener('click', () => {
        const listings = loadMockupListings();
        downloadTextFile('suneson-product-listings.csv', mockupListingsToCsv(listings), 'text/csv;charset=utf-8');
        showMessage('Listings exported as CSV.', 'success');
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
            if (!queueId) {
                return;
            }

            updateProductDesignFields(queueId, {
                status: 'Ready for Mockup',
                publishStatus: 'Not Ready'
            });
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
        const updatedProducts = loadProductLibrary().map((product) => {
            if (product.status !== 'Ready to Publish') {
                return product;
            }

            return {
                ...product,
                status: 'Ready for Mockup',
                publishStatus: 'Not Ready'
            };
        });

        saveProductLibrary(updatedProducts);
        refreshProductLibrary();
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

// Generate a mock marketing package using current form inputs and selected queue product.
if (generateMarketingPackageBtn) {
    generateMarketingPackageBtn.addEventListener('click', () => {
        const selectedProductId = marketingQueueProductSelect?.value || '';
        if (!selectedProductId) {
            showMessage('Select a Publishing Queue product first.', 'error');
            return;
        }

        const queueItem = loadPublishingQueue().find((item) => item.id === selectedProductId);
        if (!queueItem) {
            showMessage('Selected queue product could not be found.', 'error');
            return;
        }

        pendingMarketingPackage = buildMockMarketingPackage(queueItem, {
            marketingTone: marketingToneInput?.value.trim(),
            targetPlatform: marketingPlatformInput?.value.trim(),
            campaignGoal: marketingGoalInput?.value.trim(),
            audience: marketingAudienceInput?.value.trim(),
            promoAngle: marketingPromoAngleInput?.value.trim()
        });

        renderMarketingPreview(pendingMarketingPackage);
        if (saveMarketingPackageBtn) {
            saveMarketingPackageBtn.disabled = false;
        }

        showMessage('Mock marketing package generated.', 'success');
    });
}

// Save the generated package to localStorage and sync queue social status.
if (saveMarketingPackageBtn) {
    saveMarketingPackageBtn.addEventListener('click', () => {
        if (!pendingMarketingPackage) {
            showMessage('Generate a package before saving.', 'error');
            return;
        }

        const packages = loadMarketingPackages();
        saveMarketingPackages([pendingMarketingPackage, ...packages]);
        syncPublishingQueueSocialStatusToDrafted(pendingMarketingPackage.productId);
        refreshMarketingPackages();

        if (marketingToneInput) {
            marketingToneInput.value = '';
        }

        if (marketingPlatformInput) {
            marketingPlatformInput.value = '';
        }

        if (marketingGoalInput) {
            marketingGoalInput.value = '';
        }

        if (marketingAudienceInput) {
            marketingAudienceInput.value = '';
        }

        if (marketingPromoAngleInput) {
            marketingPromoAngleInput.value = '';
        }

        pendingMarketingPackage = null;
        renderMarketingPreview(null);
        saveMarketingPackageBtn.disabled = true;
        showMessage('Marketing package saved and queue social status set to Drafted.', 'success');
    });
}

// Handle saved package actions: copy caption and delete package.
if (marketingPackagesGrid) {
    marketingPackagesGrid.addEventListener('click', (event) => {
        const viewButton = event.target.closest('.view-marketing-package-btn');
        if (viewButton) {
            const packageId = viewButton.dataset.packageId;
            const packageRecord = loadMarketingPackages().find((item) => item.packageId === packageId);
            if (!packageRecord) {
                showMessage('Marketing package not found.', 'error');
                return;
            }

            openMarketingPackageModal(packageRecord);
            return;
        }

        const copyButton = event.target.closest('.copy-package-caption-btn');
        if (copyButton) {
            const packageId = copyButton.dataset.packageId;
            const packageRecord = loadMarketingPackages().find((item) => item.packageId === packageId);
            if (!packageRecord) {
                showMessage('Marketing package not found.', 'error');
                return;
            }

            copyToClipboard(packageRecord.instagramCaption)
                .then(() => showMessage('Instagram caption copied.', 'success'))
                .catch(() => showMessage('Could not copy caption.', 'error'));
            return;
        }

        const deleteButton = event.target.closest('.delete-marketing-package-btn');
        if (deleteButton) {
            const packageId = deleteButton.dataset.packageId;
            const remainingPackages = loadMarketingPackages().filter((item) => item.packageId !== packageId);
            saveMarketingPackages(remainingPackages);
            refreshMarketingPackages();
            showMessage('Marketing package deleted.', 'success');
        }
    });
}

// Bind modal close controls for package detail view.
if (closeMarketingPackageModalBtn) {
    closeMarketingPackageModalBtn.addEventListener('click', closeMarketingPackageModal);
}

if (marketingPackageModal) {
    marketingPackageModal.addEventListener('click', (event) => {
        if (event.target === marketingPackageModal) {
            closeMarketingPackageModal();
        }
    });
}

if (marketingPackageModalPanel) {
    marketingPackageModalPanel.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && marketingPackageModal && !marketingPackageModal.hidden) {
        closeMarketingPackageModal();
    }
});

// Export saved marketing packages as CSV.
if (exportMarketingPackagesCsvBtn) {
    exportMarketingPackagesCsvBtn.addEventListener('click', () => {
        const packages = loadMarketingPackages();
        downloadTextFile('suneson-marketing-packages.csv', marketingPackagesToCsv(packages), 'text/csv;charset=utf-8');
        showMessage('Marketing packages exported as CSV.', 'success');
    });
}

// Initialize Publishing Queue from localStorage on page load.
closeMarketingPackageModal();

// Persist one normalized master product record shape up front, then drop legacy queue copies.
saveProductLibrary(loadProductLibrary());
localStorage.removeItem(publishingQueueStorageKey);

refreshProductLibrary();
refreshPublishingQueue();
renderMarketingPreview(null);
refreshMarketingPackages();
refreshSavedListings();

console.log('Suneson Commerce OS internal dashboard initialized.');
