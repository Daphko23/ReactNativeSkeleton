# Credit System Implementation Guide

## 📋 Übersicht

Dieses README führt dich durch die komplette Implementierung eines Credit-Systems für deine React Native Story-App mit Supabase als Backend. Das System unterstützt In-App-Purchases, tägliche kostenlose Credits und ein Referral-System.

## 🏗️ Architektur

```
📱 React Native App
├── Credit Dashboard
├── Purchase Screen  
├── Transaction History
└── Referral System

🔧 Supabase Backend
├── PostgreSQL Database (Tables + Functions)
├── Row Level Security
├── Edge Functions (für Webhooks)
└── Realtime Updates
```

## 🚀 Implementierung Schritt-für-Schritt

### Phase 1: Supabase Setup

#### 1.1 Database Schema erstellen
```bash
# In Supabase SQL Editor ausführen:
```
- Kopiere das komplette SQL Schema aus dem vorherigen Artifact
- Führe es in deinem Supabase SQL Editor aus
- Überprüfe dass alle Tables, Functions und Policies erstellt wurden

#### 1.2 Supabase Client Setup
```bash
npm install @supabase/supabase-js
```

**supabase.ts**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types für bessere TypeScript-Unterstützung
export interface Profile {
  id: string
  email: string
  total_credits: number
  last_free_credit: string
  referral_code: string
  referred_by?: string
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  transaction_type: 'purchase' | 'daily_bonus' | 'referral' | 'admin_grant' | 'refund'
  reference_id?: string
  description?: string
  created_at: string
}
```

### Phase 2: React Native Components

#### 2.1 Credit Balance Hook
```typescript
// hooks/useCredits.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useCredits = () => {
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchCredits = async () => {
    try {
      const { data, error } = await supabase.rpc('get_credit_balance')
      if (error) throw error
      setCredits(data || 0)
    } catch (error) {
      console.error('Error fetching credits:', error)
    } finally {
      setLoading(false)
    }
  }

  const claimDailyCredits = async () => {
    try {
      const { data, error } = await supabase.rpc('claim_daily_credits')
      if (error) throw error
      if (data.success) {
        setCredits(data.new_balance)
        return data
      }
      return null
    } catch (error) {
      console.error('Error claiming daily credits:', error)
      return null
    }
  }

  useEffect(() => {
    fetchCredits()
    
    // Realtime-Updates für Credit-Änderungen
    const subscription = supabase
      .channel('credit-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        () => fetchCredits()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { credits, loading, fetchCredits, claimDailyCredits }
}
```

#### 2.2 Credit Display Component
```typescript
// components/CreditDisplay.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useCredits } from '../hooks/useCredits'

interface CreditDisplayProps {
  onPurchasePress?: () => void
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ onPurchasePress }) => {
  const { credits, loading } = useCredits()

  const getCreditColor = () => {
    if (credits >= 10) return '#4CAF50' // Grün
    if (credits >= 3) return '#FF9800'  // Orange
    return '#F44336' // Rot
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.creditBox}>
        <Text style={styles.creditLabel}>Credits</Text>
        <Text style={[styles.creditAmount, { color: getCreditColor() }]}>
          {credits}
        </Text>
      </View>
      
      {credits < 5 && (
        <TouchableOpacity 
          style={styles.buyButton}
          onPress={onPurchasePress}
        >
          <Text style={styles.buyButtonText}>+ Buy Credits</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
  },
  creditBox: {
    alignItems: 'center',
  },
  creditLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  creditAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingText: {
    color: '#666',
  },
})
```

#### 2.3 Daily Credits Component
```typescript
// components/DailyCredits.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useCredits } from '../hooks/useCredits'

export const DailyCredits: React.FC = () => {
  const { claimDailyCredits } = useCredits()
  const [claiming, setClaiming] = useState(false)

  const handleClaimDaily = async () => {
    setClaiming(true)
    try {
      const result = await claimDailyCredits()
      
      if (result?.success) {
        const message = result.is_streak 
          ? `🔥 Streak Bonus! You earned ${result.credits_earned} credits!`
          : `✨ You earned ${result.credits_earned} credit!`
        
        Alert.alert('Daily Credits Claimed!', message)
      } else {
        Alert.alert('Already Claimed', 'Come back tomorrow for more free credits!')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to claim daily credits')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 Daily Free Credits</Text>
      <Text style={styles.description}>
        Get 1-2 free credits every day!
      </Text>
      
      <TouchableOpacity 
        style={[styles.claimButton, claiming && styles.claimButtonDisabled]}
        onPress={handleClaimDaily}
        disabled={claiming}
      >
        <Text style={styles.claimButtonText}>
          {claiming ? 'Claiming...' : 'Claim Daily Credits'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  claimButtonDisabled: {
    backgroundColor: '#ccc',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
})
```

### Phase 3: In-App-Purchase Integration

#### 3.1 IAP Setup
```bash
npm install react-native-iap
cd ios && pod install  # Nur für iOS
```

#### 3.2 Purchase Hook
```typescript
// hooks/usePurchases.ts
import { useState, useEffect } from 'react'
import { 
  initConnection, 
  purchaseUpdatedListener, 
  getProducts, 
  requestPurchase,
  finishTransaction,
  type ProductPurchase,
  type Product
} from 'react-native-iap'
import { supabase } from '../lib/supabase'
import { Platform } from 'react-native'

const CREDIT_PRODUCTS = [
  'credits_starter',   // 12 Credits - 4,99€
  'credits_popular',   // 35 Credits - 12,99€  
  'credits_pro',       // 75 Credits - 24,99€
  'credits_ultimate',  // 150 Credits - 44,99€
]

export const usePurchases = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initIAP = async () => {
      try {
        await initConnection()
        const products = await getProducts({ skus: CREDIT_PRODUCTS })
        setProducts(products)
      } catch (error) {
        console.error('IAP init error:', error)
      }
    }

    initIAP()

    const purchaseListener = purchaseUpdatedListener(async (purchase: ProductPurchase) => {
      try {
        // Purchase an Supabase senden
        const { data, error } = await supabase.rpc('process_iap_purchase', {
          user_uuid: (await supabase.auth.getUser()).data.user?.id,
          platform_type: Platform.OS,
          product_identifier: purchase.productId,
          transaction_identifier: purchase.transactionId,
          receipt_content: purchase.transactionReceipt
        })

        if (error) throw error

        if (data.success) {
          console.log('Purchase successful:', data)
          await finishTransaction({ purchase, isConsumable: true })
        }
      } catch (error) {
        console.error('Purchase processing error:', error)
      }
    })

    return () => {
      purchaseListener?.remove()
    }
  }, [])

  const buyCredits = async (productId: string) => {
    setLoading(true)
    try {
      await requestPurchase({ sku: productId })
    } catch (error) {
      console.error('Purchase request error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, buyCredits }
}
```

#### 3.3 Purchase Screen
```typescript
// screens/PurchaseScreen.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { usePurchases } from '../hooks/usePurchases'
import { CreditDisplay } from '../components/CreditDisplay'

const CREDIT_INFO = {
  'credits_starter': { credits: 12, popular: false, bonus: 0 },
  'credits_popular': { credits: 35, popular: true, bonus: 5 },
  'credits_pro': { credits: 75, popular: false, bonus: 15 },
  'credits_ultimate': { credits: 150, popular: false, bonus: 30 }
}

export const PurchaseScreen: React.FC = () => {
  const { products, loading, buyCredits } = usePurchases()

  const renderProduct = (product: any) => {
    const info = CREDIT_INFO[product.productId as keyof typeof CREDIT_INFO]
    if (!info) return null

    return (
      <TouchableOpacity
        key={product.productId}
        style={[styles.productCard, info.popular && styles.popularCard]}
        onPress={() => buyCredits(product.productId)}
        disabled={loading}
      >
        {info.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>⭐ POPULAR</Text>
          </View>
        )}
        
        <Text style={styles.creditAmount}>{info.credits} Credits</Text>
        {info.bonus > 0 && (
          <Text style={styles.bonusText}>+ {info.bonus} Bonus</Text>
        )}
        
        <Text style={styles.price}>{product.localizedPrice}</Text>
        <Text style={styles.pricePerCredit}>
          {(parseFloat(product.price) / info.credits).toFixed(2)}€ per credit
        </Text>
        
        <View style={styles.buyButton}>
          <Text style={styles.buyButtonText}>
            {loading ? 'Processing...' : 'Buy Now'}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <CreditDisplay />
      
      <Text style={styles.title}>💳 Buy Credits</Text>
      <Text style={styles.subtitle}>
        Choose a credit package to continue creating amazing stories
      </Text>
      
      <View style={styles.productsContainer}>
        {products.map(renderProduct)}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularCard: {
    borderColor: '#FF9800',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  creditAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  bonusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pricePerCredit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
```

### Phase 4: App Store/Play Store Konfiguration

#### 4.1 iOS App Store Connect
1. **Neues App erstellen** in App Store Connect
2. **In-App-Purchases konfigurieren**:
   - `credits_starter` - Consumable - 4,99€
   - `credits_popular` - Consumable - 12,99€
   - `credits_pro` - Consumable - 24,99€
   - `credits_ultimate` - Consumable - 44,99€

#### 4.2 Google Play Console
1. **App erstellen** in Play Console
2. **In-App-Produkte erstellen** mit denselben IDs
3. **Preise entsprechend setzen**

#### 4.3 Platform-spezifische Konfiguration
```typescript
// config/products.ts
export const PRODUCT_CONFIG = {
  ios: {
    credits_starter: '4.99',
    credits_popular: '12.99', 
    credits_pro: '24.99',
    credits_ultimate: '44.99'
  },
  android: {
    credits_starter: '4.99',
    credits_popular: '12.99',
    credits_pro: '24.99', 
    credits_ultimate: '44.99'
  }
}
```

### Phase 5: Testing & Deployment

#### 5.1 Testing Checklist
- [ ] Supabase Functions funktionieren korrekt
- [ ] Credit-Anzeige updates in Realtime
- [ ] Daily Credits können geclaimed werden
- [ ] In-App-Purchases funktionieren (Sandbox)
- [ ] Purchase-Webhooks verarbeiten Credits korrekt
- [ ] RLS Policies verhindern unauthorized access

#### 5.2 Monitoring Setup
```typescript
// utils/analytics.ts
export const trackCreditEvent = (event: string, data?: any) => {
  // Deine Analytics-Integration (Firebase, Mixpanel, etc.)
  console.log('Credit Event:', event, data)
}

// In Components nutzen:
trackCreditEvent('credits_purchased', { amount: 35, price: 12.99 })
trackCreditEvent('daily_credits_claimed', { streak: true })
```

## 🛠️ Cursor Integration Prompts

### Für Database Setup:
```
"Ich möchte das Credit-System implementieren. Bitte erstelle die Supabase Client-Konfiguration und die TypeScript-Interfaces für Profile und CreditTransaction basierend auf dem SQL Schema."
```

### Für Components:
```
"Erstelle eine React Native Component für das Credit-Display mit folgenden Features: Credit-Stand anzeigen, Farbcodierung (grün>10, orange 3-9, rot<3), Buy-Button bei niedrigen Credits, Realtime-Updates via Supabase."
```

### Für IAP Integration:
```
"Implementiere react-native-iap Integration für das Credit-System. Brauche: Product-Loading, Purchase-Handling, Supabase-Integration für Purchase-Verarbeitung. Nutze die product IDs: credits_starter, credits_popular, credits_pro, credits_ultimate."
```

## 📞 Support & Next Steps

Nach der Implementierung kannst du folgende Features hinzufügen:
- **Analytics Dashboard** für Credit-Usage
- **Admin Panel** für Credit-Management
- **Seasonal Offers** und Limited-Time-Deals
- **Family Sharing** für Credit-Pools
- **Achievement System** mit Credit-Rewards

Viel Erfolg bei der Implementierung! 🚀