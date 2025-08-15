import { LightningElement, track } from 'lwc';

export default class PersonalizationCard extends LightningElement {
    @track affinityData = [
        { category: 'Dresses', affinity: 85, color: '#FF6B6B', viewTime: 120, moneySpent: 450, clicks: 25 },
        { category: 'Shoes', affinity: 72, color: '#4ECDC4', viewTime: 95, moneySpent: 320, clicks: 18 },
        { category: 'Accessories', affinity: 68, color: '#45B7D1', viewTime: 78, moneySpent: 180, clicks: 15 },
        { category: 'Outerwear', affinity: 55, color: '#96CEB4', viewTime: 60, moneySpent: 220, clicks: 12 },
        { category: 'Denim', affinity: 45, color: '#FECA57', viewTime: 45, moneySpent: 150, clicks: 8 },
        { category: 'Activewear', affinity: 35, color: '#DDA0DD', viewTime: 30, moneySpent: 80, clicks: 5 }
    ];

    @track nextBestContent = [
        {
            id: 1,
            title: 'Summer Dress Collection 2024',
            type: 'Video',
            relevanceScore: 92,
            engagement: 'High',
            contentType: 'product-showcase',
            icon: 'utility:video'
        },
        {
            id: 2,
            title: 'How to Style Your Favorite Heels',
            type: 'Article',
            relevanceScore: 87,
            engagement: 'Medium',
            contentType: 'style-guide',
            icon: 'utility:article'
        },
        {
            id: 3,
            title: 'Sustainable Fashion Trends',
            type: 'Blog',
            relevanceScore: 75,
            engagement: 'Medium',
            contentType: 'trend-report',
            icon: 'utility:comments'
        }
    ];

    @track nextBestProducts = [
        {
            id: 1,
            name: 'Floral Summer Dress',
            category: 'Dresses',
            price: '$89.99',
            relevanceScore: 94,
            inStock: true,
            imageUrl: 'https://via.placeholder.com/100x120/FF6B6B/FFFFFF?text=Dress',
            reason: 'Based on browsing history'
        },
        {
            id: 2,
            name: 'Classic Black Heels',
            category: 'Shoes',
            price: '$125.00',
            relevanceScore: 89,
            inStock: true,
            imageUrl: 'https://via.placeholder.com/100x120/4ECDC4/FFFFFF?text=Shoes',
            reason: 'Frequently bought together'
        },
        {
            id: 3,
            name: 'Gold Statement Necklace',
            category: 'Accessories',
            price: '$65.00',
            relevanceScore: 82,
            inStock: false,
            imageUrl: 'https://via.placeholder.com/100x120/45B7D1/FFFFFF?text=Acc',
            reason: 'Similar style preferences'
        }
    ];

    @track selectedCategory = null;
    @track wheelCenterX = 150;
    @track wheelCenterY = 150;
    @track wheelRadius = 120;

    connectedCallback() {
        // Simulate real-time updates
        this.startAffinityUpdates();
    }

    disconnectedCallback() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    startAffinityUpdates() {
        this.updateInterval = setInterval(() => {
            this.simulateAffinityChanges();
        }, 5000); // Update every 5 seconds
    }

    simulateAffinityChanges() {
        this.affinityData = this.affinityData.map(item => {
            // Simulate changes based on view time, clicks, and spending
            const viewTimeBoost = Math.random() * 2;
            const clickBoost = Math.random() * 3;
            const spendingBoost = Math.random() * 1.5;
            
            const newAffinity = Math.min(100, Math.max(0, 
                item.affinity + (viewTimeBoost + clickBoost + spendingBoost - 3)
            ));
            
            return {
                ...item,
                affinity: Math.round(newAffinity),
                viewTime: item.viewTime + Math.round(Math.random() * 5),
                clicks: item.clicks + Math.round(Math.random() * 2)
            };
        });
    }

    get affinityWheel() {
        const total = this.affinityData.length;
        const angleStep = (2 * Math.PI) / total;
        
        return this.affinityData.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2; // Start from top
            const radius = (item.affinity / 100) * this.wheelRadius;
            const x = this.wheelCenterX + radius * Math.cos(angle);
            const y = this.wheelCenterY + radius * Math.sin(angle);
            
            return {
                ...item,
                x: x,
                y: y,
                angle: angle,
                radius: radius,
                transform: `translate(${x - 40}px, ${y - 20}px)`,
                size: Math.max(8, (item.affinity / 100) * 16)
            };
        });
    }

    get wheelBackground() {
        const rings = [];
        for (let i = 1; i <= 5; i++) {
            rings.push({
                radius: (i * this.wheelRadius) / 5,
                strokeOpacity: Math.max(0.02, 0.1 - (i * 0.02))
            });
        }
        return rings;
    }

    get topAffinityCategory() {
        return this.affinityData.reduce((max, item) => 
            item.affinity > max.affinity ? item : max
        );
    }

    handleCategoryClick(event) {
        const categoryName = event.currentTarget.dataset.category;
        this.selectedCategory = this.selectedCategory === categoryName ? null : categoryName;
    }

    handleContentClick(event) {
        const contentId = event.currentTarget.dataset.id;
        // Simulate content engagement tracking
        console.log(`Content clicked: ${contentId}`);
        
        // Update affinity based on content interaction
        this.updateAffinityFromInteraction('content');
    }

    handleProductClick(event) {
        const productId = event.currentTarget.dataset.id;
        // Simulate product click tracking
        console.log(`Product clicked: ${productId}`);
        
        // Update affinity based on product interaction
        this.updateAffinityFromInteraction('product');
    }

    updateAffinityFromInteraction(type) {
        this.affinityData = this.affinityData.map(item => ({
            ...item,
            clicks: item.clicks + 1,
            affinity: Math.min(100, item.affinity + (type === 'product' ? 2 : 1))
        }));
    }

    get selectedCategoryData() {
        return this.affinityData.find(item => item.category === this.selectedCategory);
    }
}